/**
 * Gemini 完整整合服務層
 * 支援 JSON 結構化輸出、錯誤重試、上下文快取
 */

import { LLMProvider, ZiWeiAnalysisResponse } from './geminiService';
import { buildSystemInstruction } from './geminiPromptBuilder';
import { knowledgeBaseCache } from './knowledgeBase';
import { PrivacyFilter, recordAPICall } from './privacyAndMetrics';
import type { ChartResult } from './stars';

/**
 * 重試配置
 */
interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

/**
 * 默認重試配置
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

/**
 * Gemini 整合服務
 */
export class GeminiIntegrationService {
  private provider: LLMProvider;
  private retryConfig: RetryConfig;
  private knowledgeBase: string;

  constructor(apiKey: string, retryConfig?: Partial<RetryConfig>) {
    this.provider = new LLMProvider(apiKey);
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    this.knowledgeBase = knowledgeBaseCache.getFullKnowledgeBase();
  }

  /**
   * 初始化服務
   */
  async initialize(): Promise<void> {
    await this.provider.initializeContextCache();
    console.log('✓ Gemini 整合服務已初始化');
  }

  /**
   * 執行帶重試的 API 呼叫
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | null = null;
    let delayMs = this.retryConfig.initialDelayMs;

    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        console.log(`📡 ${operationName} - 嘗試 ${attempt}/${this.retryConfig.maxRetries}`);
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`⚠️ ${operationName} 失敗 (嘗試 ${attempt}): ${lastError.message}`);

        if (attempt < this.retryConfig.maxRetries) {
          console.log(`⏳ 等待 ${delayMs}ms 後重試...`);
          await this.delay(delayMs);
          delayMs = Math.min(delayMs * this.retryConfig.backoffMultiplier, this.retryConfig.maxDelayMs);
        }
      }
    }

    throw new Error(`${operationName} 失敗，已達最大重試次數: ${lastError?.message}`);
  }

  /**
   * 延遲函數
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 分析命盤 - 主要入口
   */
  async analyzeChart(
    chart: ChartResult,
    useCache: boolean = true
  ): Promise<{
    analysis: ZiWeiAnalysisResponse;
    cacheHit: boolean;
    tokensUsed: number;
    responseTimeMs: number;
  }> {
    const startTime = Date.now();

    try {
      // 脫敏用戶數據
      const deidentifiedChart = PrivacyFilter.deidentifyChartData(chart);

      // 驗證隱私合規性
      if (!PrivacyFilter.validatePrivacyCompliance(deidentifiedChart)) {
        console.warn('⚠️ 隱私合規性檢查失敗，但繼續進行');
      }

      // 執行帶重試的分析
      const { response, metrics } = await this.executeWithRetry(
        () => this.provider.analyzeChartDeep(deidentifiedChart, ''),
        '紫微斗數深度分析'
      );

      const responseTimeMs = Date.now() - startTime;

      // 記錄 API 呼叫
      recordAPICall(
        '/api/analyze-chart',
        'POST',
        metrics.tokens_used,
        responseTimeMs,
        'gemini-1.5-pro',
        metrics.cache_hit,
        'success'
      );

      return {
        analysis: response,
        cacheHit: metrics.cache_hit,
        tokensUsed: metrics.tokens_used,
        responseTimeMs,
      };
    } catch (error) {
      const responseTimeMs = Date.now() - startTime;
      recordAPICall(
        '/api/analyze-chart',
        'POST',
        0,
        responseTimeMs,
        'gemini-1.5-pro',
        false,
        'error',
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * 快速解釋星曜
   */
  async explainStar(starName: string, context: string): Promise<string> {
    try {
      const explanation = await this.executeWithRetry(
        () => this.provider.explainStarQuick(starName, context),
        `解釋星曜 ${starName}`
      );

      recordAPICall(
        '/api/explain-star',
        'POST',
        Math.ceil(explanation.length / 4),
        100,
        'gemini-1.5-flash',
        false,
        'success'
      );

      return explanation;
    } catch (error) {
      recordAPICall(
        '/api/explain-star',
        'POST',
        0,
        100,
        'gemini-1.5-flash',
        false,
        'error',
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * 分析命盤圖像
   */
  async analyzeChartImage(imageBase64: string): Promise<any> {
    try {
      const result = await this.executeWithRetry(
        () => this.provider.analyzeChartImage(imageBase64),
        '分析命盤圖像'
      );

      recordAPICall(
        '/api/analyze-chart-image',
        'POST',
        Math.ceil(imageBase64.length / 4),
        500,
        'gemini-1.5-pro',
        false,
        'success'
      );

      return result;
    } catch (error) {
      recordAPICall(
        '/api/analyze-chart-image',
        'POST',
        Math.ceil(imageBase64.length / 4),
        500,
        'gemini-1.5-pro',
        false,
        'error',
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * 獲取性能指標
   */
  getPerformanceMetrics(): any {
    return this.provider.getPerformanceMetrics();
  }

  /**
   * 清空性能指標
   */
  clearMetrics(): void {
    this.provider.clearMetrics();
  }

  /**
   * 驗證 JSON 回應的有效性
   */
  static validateAnalysisResponse(response: any): boolean {
    // 檢查必需的字段
    const requiredFields = [
      'analysis',
      'metadata',
    ];

    for (const field of requiredFields) {
      if (!(field in response)) {
        console.error(`❌ 缺少必需字段: ${field}`);
        return false;
      }
    }

    // 檢查分析字段
    const analysisFields = [
      'personality',
      'career_wealth',
      'relationships',
      'family',
      'fortune_predictions',
    ];

    for (const field of analysisFields) {
      if (!(field in response.analysis)) {
        console.error(`❌ 分析缺少字段: ${field}`);
        return false;
      }
    }

    // 檢查元數據字段
    const metadataFields = [
      'analysis_timestamp',
      'model_used',
      'tokens_used',
      'warning_level',
    ];

    for (const field of metadataFields) {
      if (!(field in response.metadata)) {
        console.error(`❌ 元數據缺少字段: ${field}`);
        return false;
      }
    }

    return true;
  }

  /**
   * 格式化分析結果用於顯示
   */
  static formatAnalysisForDisplay(response: ZiWeiAnalysisResponse): string {
    const lines: string[] = [];

    // 標題
    lines.push('═'.repeat(60));
    lines.push('紫微斗數 AI 深度分析報告');
    lines.push('═'.repeat(60));
    lines.push('');

    // 性格特質
    lines.push('【性格特質與人生底層架構】');
    lines.push(response.analysis.personality.life_foundation);
    lines.push('');

    // 事業財富
    lines.push('【事業前景與財富運勢】');
    lines.push(response.analysis.career_wealth.career_palace_analysis);
    lines.push(response.analysis.career_wealth.wealth_palace_analysis);
    lines.push('');

    // 感情關係
    lines.push('【感情婚姻與人際關係】');
    lines.push(response.analysis.relationships.spouse_palace_analysis);
    lines.push('');

    // 家庭關係
    lines.push('【與父母與兄弟姊妹的關係】');
    lines.push(response.analysis.family.parents_palace_analysis);
    lines.push('');

    // 流年預測
    lines.push('【未來五年流年運勢預測】');
    lines.push('2026年: ' + response.analysis.fortune_predictions.year_2026.suggestions);
    lines.push('2027年: ' + response.analysis.fortune_predictions.year_2027.suggestions);
    lines.push('2028年: ' + response.analysis.fortune_predictions.year_2028.suggestions);
    lines.push('2029年: ' + response.analysis.fortune_predictions.year_2029.suggestions);
    lines.push('2030年: ' + response.analysis.fortune_predictions.year_2030.suggestions);
    lines.push('');

    // 風險評估
    lines.push('【風險評估】');
    lines.push(`風險等級: ${response.metadata.warning_level.toUpperCase()}`);
    lines.push(`評估: ${response.metadata.risk_assessment}`);
    lines.push('');

    // 元數據
    lines.push('【分析元數據】');
    lines.push(`模型: ${response.metadata.model_used}`);
    lines.push(`Token 消耗: ${response.metadata.tokens_used}`);
    lines.push(`響應時間: ${response.metadata.response_time_ms}ms`);
    lines.push(`分析時間: ${response.metadata.analysis_timestamp}`);
    lines.push('');

    lines.push('═'.repeat(60));

    return lines.join('\n');
  }
}

/**
 * 導出單例實例
 */
let geminiIntegrationService: GeminiIntegrationService | null = null;

export function initGeminiIntegration(apiKey: string): GeminiIntegrationService {
  if (!geminiIntegrationService) {
    geminiIntegrationService = new GeminiIntegrationService(apiKey);
  }
  return geminiIntegrationService;
}

export function getGeminiIntegration(): GeminiIntegrationService {
  if (!geminiIntegrationService) {
    throw new Error('Gemini 整合服務未初始化');
  }
  return geminiIntegrationService;
}
