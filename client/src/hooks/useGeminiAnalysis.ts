/**
 * React Hook: useGeminiAnalysis
 * 管理 Gemini 分析的狀態與邏輯
 */

import { useState, useCallback, useEffect } from 'react';
import { GeminiIntegrationService, getGeminiIntegration } from '../lib/geminiIntegration';
import { ZiWeiAnalysisResponse } from '../lib/geminiService';
import type { ChartResult } from '../lib/stars';

/**
 * Hook 狀態類型
 */
export interface UseGeminiAnalysisState {
  loading: boolean;
  error: Error | null;
  analysis: ZiWeiAnalysisResponse | null;
  cacheHit: boolean;
  tokensUsed: number;
  responseTimeMs: number;
  warningLevel: 'low' | 'medium' | 'high' | null;
}

/**
 * Hook 初始狀態
 */
const initialState: UseGeminiAnalysisState = {
  loading: false,
  error: null,
  analysis: null,
  cacheHit: false,
  tokensUsed: 0,
  responseTimeMs: 0,
  warningLevel: null,
};

/**
 * useGeminiAnalysis Hook
 */
export function useGeminiAnalysis() {
  const [state, setState] = useState<UseGeminiAnalysisState>(initialState);
  const [geminiService, setGeminiService] = useState<GeminiIntegrationService | null>(null);

  // 初始化 Gemini 服務
  useEffect(() => {
    try {
      const service = getGeminiIntegration();
      setGeminiService(service);
    } catch (error) {
      console.error('❌ 無法初始化 Gemini 服務:', error);
    }
  }, []);

  /**
   * 分析命盤
   */
  const analyzeChart = useCallback(
    async (chart: ChartResult) => {
      if (!geminiService) {
        setState(prev => ({
          ...prev,
          error: new Error('Gemini 服務未初始化'),
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await geminiService.analyzeChart(chart);

        setState(prev => ({
          ...prev,
          loading: false,
          analysis: result.analysis,
          cacheHit: result.cacheHit,
          tokensUsed: result.tokensUsed,
          responseTimeMs: result.responseTimeMs,
          warningLevel: result.analysis.metadata.warning_level,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
      }
    },
    [geminiService]
  );

  /**
   * 解釋星曜
   */
  const explainStar = useCallback(
    async (starName: string, context: string): Promise<string> => {
      if (!geminiService) {
        throw new Error('Gemini 服務未初始化');
      }

      try {
        return await geminiService.explainStar(starName, context);
      } catch (error) {
        console.error('❌ 星曜解釋失敗:', error);
        throw error;
      }
    },
    [geminiService]
  );

  /**
   * 分析命盤圖像
   */
  const analyzeImage = useCallback(
    async (imageBase64: string) => {
      if (!geminiService) {
        throw new Error('Gemini 服務未初始化');
      }

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await geminiService.analyzeChartImage(imageBase64);

        setState(prev => ({
          ...prev,
          loading: false,
        }));

        return result;
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
        throw error;
      }
    },
    [geminiService]
  );

  /**
   * 重置狀態
   */
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  /**
   * 清空錯誤
   */
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    ...state,
    analyzeChart,
    explainStar,
    analyzeImage,
    reset,
    clearError,
  };
}

/**
 * Hook: useAnalysisMetrics
 * 獲取分析性能指標
 */
export function useAnalysisMetrics() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const refreshMetrics = useCallback(() => {
    try {
      const service = getGeminiIntegration();
      const allMetrics = service.getPerformanceMetrics();
      setMetrics(allMetrics);

      // 計算摘要
      if (allMetrics.length > 0) {
        const avgResponseTime = Math.round(
          allMetrics.reduce((sum: number, m: any) => sum + m.response_time_ms, 0) / allMetrics.length
        );
        const totalTokens = allMetrics.reduce((sum: number, m: any) => sum + m.tokens_used, 0);
        const successCount = allMetrics.filter((m: any) => m.status === 'success').length;
        const successRate = Math.round((successCount / allMetrics.length) * 100);

        setSummary({
          total_calls: allMetrics.length,
          average_response_time_ms: avgResponseTime,
          total_tokens_used: totalTokens,
          success_rate: successRate,
        });
      }
    } catch (error) {
      console.error('❌ 無法獲取指標:', error);
    }
  }, []);

  return {
    metrics,
    summary,
    refreshMetrics,
  };
}

/**
 * Hook: useWarningLevel
 * 根據風險等級返回 UI 樣式
 */
export function useWarningLevelStyles(warningLevel: 'low' | 'medium' | 'high' | null) {
  const getBackgroundColor = useCallback(() => {
    switch (warningLevel) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  }, [warningLevel]);

  const getTextColor = useCallback(() => {
    switch (warningLevel) {
      case 'high':
        return 'text-red-700';
      case 'medium':
        return 'text-yellow-700';
      case 'low':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  }, [warningLevel]);

  const getBadgeColor = useCallback(() => {
    switch (warningLevel) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, [warningLevel]);

  return {
    backgroundColor: getBackgroundColor(),
    textColor: getTextColor(),
    badgeColor: getBadgeColor(),
  };
}
