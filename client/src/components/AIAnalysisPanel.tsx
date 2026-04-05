/**
 * AI 分析面板元件
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 */

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ChartResult } from '@/lib/stars';
import { buildZiWeiPrompt } from '@/lib/promptBuilder';
import { initGeminiService } from '@/lib/gemini_service';

interface AIAnalysisPanelProps {
  chart: ChartResult | null;
  apiKey: string;
}

export default function AIAnalysisPanel({ chart, apiKey }: AIAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    if (!chart || !apiKey) {
      setError('缺少命盤數據或 API Key');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const geminiService = initGeminiService(apiKey);
      const result = await geminiService.analyzeChart(chart);
      setAnalysis(JSON.stringify(result.analysis, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失敗，請重試');
      console.error('分析錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 border-2 border-yellow-600/50 bg-slate-900/50">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-yellow-500">✨ 總命盤 AI 分析</h2>

        {!analysis && !loading && (
          <Button
            onClick={handleAnalyze}
            disabled={!chart || !apiKey || loading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                分析中...
              </>
            ) : (
              '開始 AI 分析'
            )}
          </Button>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            <span className="ml-3 text-yellow-500">神仙正在分析命盤...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-600 rounded text-red-300">
            <p className="font-bold">❌ 錯誤</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 border border-yellow-600/30 rounded-lg">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {analysis}
              </p>
            </div>

            <Button
              onClick={handleAnalyze}
              variant="outline"
              className="w-full border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10"
            >
              重新分析
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
