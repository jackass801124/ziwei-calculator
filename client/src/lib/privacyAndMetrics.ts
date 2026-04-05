/**
 * 隱私過濾與效能監控系統
 * 負責用戶數據脫敏與 API 呼叫性能追蹤
 */

/**
 * 隱私過濾器
 */
export class PrivacyFilter {
  /**
   * 脫敏用戶個人信息
   */
  static deidentifyChartData(chartData: any): any {
    const deidentified = { ...chartData };

    // 移除可識別的個人信息
    const sensitiveFields = [
      'user_id',
      'user_name',
      'user_email',
      'phone_number',
      'address',
      'id_number',
      'passport_number',
      'social_security_number',
    ];

    sensitiveFields.forEach(field => {
      delete deidentified[field];
    });

    return deidentified;
  }

  /**
   * 脫敏 API 回應
   */
  static deidentifyResponse(response: any): any {
    // 移除可能包含的個人信息
    const deidentified = { ...response };

    if (deidentified.metadata) {
      delete deidentified.metadata.user_id;
      delete deidentified.metadata.user_email;
    }

    return deidentified;
  }

  /**
   * 驗證數據隱私合規性
   */
  static validatePrivacyCompliance(data: any): boolean {
    const sensitivePatterns = [
      /\d{10,}/,  // 長數字序列（可能是 ID）
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,  // 電子郵件
      /\d{3}-\d{2}-\d{4}/,  // 社會安全號碼格式
    ];

    const dataString = JSON.stringify(data);

    for (const pattern of sensitivePatterns) {
      if (pattern.test(dataString)) {
        console.warn('⚠️ 檢測到潛在的敏感信息');
        return false;
      }
    }

    return true;
  }
}

/**
 * 效能監控系統
 */
export interface PerformanceMetric {
  timestamp: string;
  endpoint: string;
  method: string;
  tokens_used: number;
  response_time_ms: number;
  status: 'success' | 'error';
  error_message?: string;
  model_used: string;
  cache_hit: boolean;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetricsSize: number = 1000;  // 最多保留 1000 條記錄

  /**
   * 記錄 API 呼叫性能
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // 如果超過最大數量，移除最舊的記錄
    if (this.metrics.length > this.maxMetricsSize) {
      this.metrics.shift();
    }
  }

  /**
   * 獲取所有性能指標
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * 獲取最近 N 條記錄
   */
  getRecentMetrics(count: number = 10): PerformanceMetric[] {
    return this.metrics.slice(-count);
  }

  /**
   * 計算平均響應時間
   */
  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;

    const totalTime = this.metrics.reduce((sum, m) => sum + m.response_time_ms, 0);
    return Math.round(totalTime / this.metrics.length);
  }

  /**
   * 計算平均 Token 消耗
   */
  getAverageTokensUsed(): number {
    if (this.metrics.length === 0) return 0;

    const totalTokens = this.metrics.reduce((sum, m) => sum + m.tokens_used, 0);
    return Math.round(totalTokens / this.metrics.length);
  }

  /**
   * 計算快取命中率
   */
  getCacheHitRate(): number {
    if (this.metrics.length === 0) return 0;

    const cacheHits = this.metrics.filter(m => m.cache_hit).length;
    return Math.round((cacheHits / this.metrics.length) * 100);
  }

  /**
   * 計算成功率
   */
  getSuccessRate(): number {
    if (this.metrics.length === 0) return 0;

    const successCount = this.metrics.filter(m => m.status === 'success').length;
    return Math.round((successCount / this.metrics.length) * 100);
  }

  /**
   * 獲取性能統計摘要
   */
  getSummary(): {
    total_calls: number;
    average_response_time_ms: number;
    average_tokens_used: number;
    cache_hit_rate: number;
    success_rate: number;
    total_tokens_used: number;
    total_cost_estimate: string;
  } {
    const totalTokens = this.metrics.reduce((sum, m) => sum + m.tokens_used, 0);
    // Gemini 1.5 Pro: 輸入 $1.25/百萬 tokens，輸出 $5/百萬 tokens（粗略估計）
    const estimatedCost = (totalTokens / 1000000) * 3.125;

    return {
      total_calls: this.metrics.length,
      average_response_time_ms: this.getAverageResponseTime(),
      average_tokens_used: this.getAverageTokensUsed(),
      cache_hit_rate: this.getCacheHitRate(),
      success_rate: this.getSuccessRate(),
      total_tokens_used: totalTokens,
      total_cost_estimate: `$${estimatedCost.toFixed(4)}`,
    };
  }

  /**
   * 按模型分組統計
   */
  getMetricsByModel(): Record<string, PerformanceMetric[]> {
    const grouped: Record<string, PerformanceMetric[]> = {};

    this.metrics.forEach(metric => {
      if (!grouped[metric.model_used]) {
        grouped[metric.model_used] = [];
      }
      grouped[metric.model_used].push(metric);
    });

    return grouped;
  }

  /**
   * 清空所有指標
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * 導出指標為 CSV 格式
   */
  exportAsCSV(): string {
    const headers = [
      'Timestamp',
      'Endpoint',
      'Method',
      'Tokens Used',
      'Response Time (ms)',
      'Status',
      'Model Used',
      'Cache Hit',
    ];

    const rows = this.metrics.map(m => [
      m.timestamp,
      m.endpoint,
      m.method,
      m.tokens_used,
      m.response_time_ms,
      m.status,
      m.model_used,
      m.cache_hit ? 'Yes' : 'No',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * 導出指標為 JSON 格式
   */
  exportAsJSON(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

/**
 * 導出單例實例
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * 便利函數：記錄 API 呼叫
 */
export function recordAPICall(
  endpoint: string,
  method: string,
  tokensUsed: number,
  responseTimeMs: number,
  modelUsed: string,
  cacheHit: boolean = false,
  status: 'success' | 'error' = 'success',
  errorMessage?: string
): void {
  performanceMonitor.recordMetric({
    timestamp: new Date().toISOString(),
    endpoint,
    method,
    tokens_used: tokensUsed,
    response_time_ms: responseTimeMs,
    status,
    error_message: errorMessage,
    model_used: modelUsed,
    cache_hit: cacheHit,
  });
}

/**
 * 便利函數：獲取性能摘要
 */
export function getPerformanceSummary(): any {
  return performanceMonitor.getSummary();
}

/**
 * 便利函數：導出性能報告
 */
export function exportPerformanceReport(format: 'csv' | 'json' = 'json'): string {
  if (format === 'csv') {
    return performanceMonitor.exportAsCSV();
  } else {
    return performanceMonitor.exportAsJSON();
  }
}
