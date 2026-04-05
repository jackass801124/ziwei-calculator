/**
 * Gemini AI 服務層 - 多模型編排與上下文快取
 * 支援 Gemini 1.5 Pro（深度分析）與 Flash（快速回應）
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

/**
 * API 回應的 JSON Schema 結構
 */
export interface ZiWeiAnalysisResponse {
  analysis: {
    personality: {
      core_traits: string[];
      life_foundation: string;
      five_elements_impact: string;
      four_transformations_analysis: string;
      auspicious_inauspicious_stars: string;
    };
    career_wealth: {
      career_palace_analysis: string;
      wealth_palace_analysis: string;
      wealth_multipliers: string;
      career_trajectory: string;
    };
    relationships: {
      spouse_palace_analysis: string;
      migration_palace_impact: string;
      virtue_palace_impact: string;
      relationship_strengths: string;
      relationship_challenges: string;
    };
    family: {
      parents_palace_analysis: string;
      siblings_palace_analysis: string;
      family_role: string;
      family_improvement_suggestions: string;
    };
    fortune_predictions: {
      year_2026: {
        career: string;
        wealth: string;
        relationships: string;
        health: string;
        suggestions: string;
      };
      year_2027: {
        career: string;
        wealth: string;
        relationships: string;
        health: string;
        suggestions: string;
      };
      year_2028: {
        career: string;
        wealth: string;
        relationships: string;
        health: string;
        suggestions: string;
      };
      year_2029: {
        career: string;
        wealth: string;
        relationships: string;
        health: string;
        suggestions: string;
      };
      year_2030: {
        career: string;
        wealth: string;
        relationships: string;
        health: string;
        suggestions: string;
      };
      five_year_trend: string;
    };
  };
  metadata: {
    analysis_timestamp: string;
    model_used: string;
    tokens_used: number;
    cache_hit: boolean;
    response_time_ms: number;
    warning_level: 'low' | 'medium' | 'high';
    risk_assessment: string;
  };
}

/**
 * LLMProvider 類別 - 多模型編排
 */
export class LLMProvider {
  private genAI: GoogleGenerativeAI;
  private modelPro: any;
  private modelFlash: any;
  private contextCache: Map<string, any> = new Map();
  private performanceMetrics: any[] = [];

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelPro = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 8000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    this.modelFlash = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.5,
        maxOutputTokens: 4000,
      },
    });
  }

  /**
   * 初始化上下文快取 - 預先加載靜態知識庫
   */
  async initializeContextCache(): Promise<void> {
    const knowledgeBase = {
      ziwei_classics: '《紫微斗數全書》核心理論與星曜解釋',
      yijing_texts: '《周易》原文、卦辭、爻辭完整資料庫',
      palace_meanings: '十二宮位的傳統命理含義',
      star_descriptions: '十四主星與輔星的詳細特性',
    };

    // 模擬快取初始化
    for (const [key, value] of Object.entries(knowledgeBase)) {
      this.contextCache.set(key, value);
    }

    console.log('✓ 上下文快取已初始化');
  }

  /**
   * 脫敏用戶敏感信息
   */
  private deidentifyUserData(chartData: any): any {
    const deidentified = { ...chartData };
    // 移除可識別的個人信息
    delete deidentified.user_id;
    delete deidentified.user_name;
    delete deidentified.user_email;
    return deidentified;
  }

  /**
   * 深度分析 - 使用 Gemini 1.5 Pro 與上下文快取
   */
  async analyzeChartDeep(
    chartData: any,
    apiKey: string
  ): Promise<{ response: ZiWeiAnalysisResponse; metrics: any }> {
    const startTime = Date.now();
    const deidentifiedData = this.deidentifyUserData(chartData);

    try {
      // 構建系統指令
      const systemInstruction = `你是資深的紫微斗數與易經命理分析官。
      
你的職責是：
1. 基於用戶提供的命盤數據進行深度分析
2. 整合《紫微斗數全書》與《周易》的古籍智慧
3. 提供結構化的 JSON 格式回應
4. 識別命盤中的風險因素並評級（low/medium/high）
5. 提供具體、可行的建議

分析維度：
- 性格特質與人生底層架構
- 事業前景與財富運勢
- 感情婚姻與人際關係
- 與父母與兄弟姊妹的關係
- 2026-2030 年流年運勢預測

回應必須是有效的 JSON 格式。`;

      // 構建用戶提示
      const userPrompt = `請分析以下命盤數據，並提供深度的紫微斗數與易經整合分析：

${JSON.stringify(deidentifiedData, null, 2)}

請按照 JSON Schema 結構回應，確保每個分析維度都充分詳盡。`;

      // 調用 Gemini 1.5 Pro
      const response = await this.modelPro.generateContent([
        {
          text: systemInstruction,
        },
        {
          text: userPrompt,
        },
      ]);

      const responseText = response.response.text();
      const analysisData = JSON.parse(responseText);

      // 計算性能指標
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const tokensUsed = Math.ceil(responseText.length / 4); // 粗略估計

      const metrics = {
        model: 'gemini-1.5-pro',
        tokens_used: tokensUsed,
        response_time_ms: responseTime,
        cache_hit: false,
        timestamp: new Date().toISOString(),
      };

      // 添加元數據
      const fullResponse: ZiWeiAnalysisResponse = {
        ...analysisData,
        metadata: {
          analysis_timestamp: new Date().toISOString(),
          model_used: 'gemini-1.5-pro',
          tokens_used: tokensUsed,
          cache_hit: false,
          response_time_ms: responseTime,
          warning_level: this.assessRiskLevel(analysisData),
          risk_assessment: this.generateRiskAssessment(analysisData),
        },
      };

      // 記錄性能指標
      this.performanceMetrics.push(metrics);

      return { response: fullResponse, metrics };
    } catch (error) {
      console.error('Gemini 深度分析失敗:', error);
      throw error;
    }
  }

  /**
   * 快速解釋 - 使用 Gemini 1.5 Flash 節省成本
   */
  async explainStarQuick(
    starName: string,
    context: string
  ): Promise<string> {
    try {
      const prompt = `簡潔解釋紫微斗數中的 "${starName}" 星曜在 ${context} 的含義（100 字內）`;

      const response = await this.modelFlash.generateContent(prompt);
      return response.response.text();
    } catch (error) {
      console.error('快速解釋失敗:', error);
      throw error;
    }
  }

  /**
   * 評估風險等級
   */
  private assessRiskLevel(analysisData: any): 'low' | 'medium' | 'high' {
    // 簡化的風險評估邏輯
    const analysisText = JSON.stringify(analysisData).toLowerCase();

    if (
      analysisText.includes('化忌') ||
      analysisText.includes('陷地') ||
      analysisText.includes('煞星')
    ) {
      return 'high';
    } else if (
      analysisText.includes('平地') ||
      analysisText.includes('挑戰')
    ) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * 生成風險評估報告
   */
  private generateRiskAssessment(analysisData: any): string {
    const riskLevel = this.assessRiskLevel(analysisData);
    const riskMessages = {
      high: '命盤中存在多個風險因素，建議重點關注化忌與煞星的影響。',
      medium: '命盤中存在中等風險因素，需要適當調整策略。',
      low: '命盤整體風險較低，可按計畫推進。',
    };
    return riskMessages[riskLevel];
  }

  /**
   * 獲取性能指標
   */
  getPerformanceMetrics(): any[] {
    return this.performanceMetrics;
  }

  /**
   * 清空性能指標
   */
  clearMetrics(): void {
    this.performanceMetrics = [];
  }

  /**
   * 支援多模態輸入 - 圖像識別命盤
   */
  async analyzeChartImage(imageData: string): Promise<any> {
    try {
      const response = await this.modelPro.generateContent([
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageData,
          },
        },
        {
          text: '請識別這張命盤圖片中的所有星曜、宮位和四化信息，並以 JSON 格式回應。',
        },
      ]);

      return JSON.parse(response.response.text());
    } catch (error) {
      console.error('圖像分析失敗:', error);
      throw error;
    }
  }
}

/**
 * 導出單例實例
 */
let geminiProvider: LLMProvider | null = null;

export function initGeminiProvider(apiKey: string): LLMProvider {
  if (!geminiProvider) {
    geminiProvider = new LLMProvider(apiKey);
  }
  return geminiProvider;
}

export function getGeminiProvider(): LLMProvider {
  if (!geminiProvider) {
    throw new Error('Gemini Provider 未初始化');
  }
  return geminiProvider;
}
