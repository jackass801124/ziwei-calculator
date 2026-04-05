/**
 * AI 分析面板元件
 * 設計風格：紫微正典 — 深墨色底搭配金色主星 (極簡純文字版)
 */

import { useState } from 'react';
import { Loader2, Sparkles, AlertCircle, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ChartResult } from '@/lib/stars';

interface AIAnalysisPanelProps {
  chart: ChartResult | null;
}

export default function AIAnalysisPanel({ chart }: AIAnalysisPanelProps) {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    if (!chart) {
      setError('缺少命盤數據');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisData(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartData: chart }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      setAnalysisData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失敗，請重試');
      console.error('分析錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  const metadata = analysisData?.metadata;
  const analysisText = analysisData?.analysis_text;

  return (
    <Card className="p-6 border-2 border-yellow-600/50 bg-slate-900/50">
      <div className="space-y-6">
        {/* 標題與風險評級 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> 總命盤 AI 分析
          </h2>
          {metadata && (
            <span className={`text-xs px-2 py-1 rounded border ${
              metadata.warning_level === 'high' ? 'bg-red-900/30 text-red-400 border-red-800' :
              metadata.warning_level === 'medium' ? 'bg-orange-900/30 text-orange-400 border-orange-800' :
              'bg-green-900/30 text-green-400 border-green-800'
            }`}>
              風險評級: {metadata.warning_level?.toUpperCase()}
            </span>
          )}
        </div>

        {/* 按鈕與讀取狀態 */}
        {!analysisData && !loading && (
          <Button onClick={handleAnalyze} disabled={!chart || loading} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold">
            開始 AI 分析
          </Button>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
            <span className="text-yellow-500 font-medium tracking-widest animate-pulse">老祖正在推演命盤，請稍候...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-600 rounded text-red-300">
            <p className="font-bold flex items-center gap-2"><AlertCircle className="h-4 w-4" /> 錯誤</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* 🌟 純淨長文渲染區塊 */}
        {analysisText && (
          <div className="animate-in fade-in duration-500">
            <div className="p-6 md:p-8 bg-slate-800/40 border border-yellow-600/20 rounded-xl shadow-inner">
              <div className="flex items-center gap-2 mb-6 border-b border-yellow-600/20 pb-4">
                <ScrollText className="text-yellow-600 w-5 h-5" />
                <h3 className="text-lg font-bold text-yellow-500 tracking-widest">命理推演長卷</h3>
              </div>
              
              {/* whitespace-pre-wrap 是魔法：它會尊重 AI 回傳的所有換行與空格，且不會破版 */}
              <div className="text-gray-300 text-sm md:text-base leading-loose whitespace-pre-wrap font-sans">
                {analysisText}
              </div>
            </div>

            {/* 系統 Metadata */}
            {metadata && (
              <div className="flex flex-wrap justify-between items-center text-[11px] text-slate-500 pt-6 px-2">
                <span className="mb-1 md:mb-0">Model: {metadata.model_used} | Latency: {metadata.response_time_ms}ms</span>
                <span>{metadata.risk_assessment}</span>
              </div>
            )}

            <Button onClick={handleAnalyze} variant="outline" className="w-full border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10 mt-6">
              重新推演命盤
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}