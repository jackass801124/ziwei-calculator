/**
 * AI 分析面板元件
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 */

import { useState } from 'react';
import { 
  Loader2, Sparkles, AlertCircle, Lightbulb, 
  Briefcase, Heart, TrendingUp, Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ChartResult } from '@/lib/stars';

interface AIAnalysisPanelProps {
  chart: ChartResult | null;
  apiKey?: string;
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

  const getSection = (keyEn: string, keyZh: string) => {
    if (!analysisData) return null;
    return analysisData?.analysis?.[keyEn] || analysisData?.analysis?.[keyZh] || analysisData?.[keyEn] || analysisData?.[keyZh];
  };

  const extractText = (data: any): string => {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (typeof data === 'object') {
      return data.ziweiAnalysis || data.analysis || data.description || data.content || JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  const personality = getSection('personalityAndLifeStructure', '性格特質與人生底層架構');
  const career = getSection('careerAndWealth', '事業前景與財富運勢');
  const relationships = getSection('relationshipsAndMarriage', '感情婚姻與人際關係');
  const family = getSection('familyRelations', '與父母與兄弟姊妹的關係');
  const fortunes = getSection('yearlyFortunes2026to2030', '2026-2030 年流年運勢預測');
  const metadata = analysisData?.metadata;

  // 🌟 新增：檢查是否有抓到任何一個我們已知的區塊
  const hasAnyContent = personality || career || relationships || family || fortunes;

  return (
    <Card className="p-6 border-2 border-yellow-600/50 bg-slate-900/50">
      <div className="space-y-6">
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
              風險評級: {metadata.warning_level?.toUpperCase() || 'UNKNOWN'}
            </span>
          )}
        </div>

        {!analysisData && !loading && (
          <Button onClick={handleAnalyze} disabled={!chart || loading} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold">
            開始 AI 分析
          </Button>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
            <span className="text-yellow-500 font-medium tracking-widest animate-pulse">神仙正在推演命盤... (這可能需要幾十秒)</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-600 rounded text-red-300">
            <p className="font-bold flex items-center gap-2"><AlertCircle className="h-4 w-4" /> 錯誤</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {analysisData && (
          <div className="space-y-4 animate-in fade-in duration-500">
            
            {/* 🌟 終極防線：如果完全沒抓到已知格式，直接印出美化後的 JSON */}
            {!hasAnyContent && !analysisData.raw_analysis && (
              <div className="p-5 bg-slate-800/50 border border-orange-500/50 rounded-lg space-y-4">
                <h3 className="text-orange-400 font-bold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" /> 系統提示：AI 回傳了非標準結構
                </h3>
                <p className="text-gray-300 text-sm">神仙這次給的籤詩格式不太一樣！以下是未經排版的完整分析：</p>
                <pre className="text-xs text-gray-400 bg-black/60 p-4 rounded overflow-auto max-h-[500px] whitespace-pre-wrap">
                  {/* 過濾掉 metadata，只顯示 AI 真正回傳的分析內容 */}
                  {JSON.stringify(Object.fromEntries(Object.entries(analysisData).filter(([k]) => k !== 'metadata')), null, 2)}
                </pre>
              </div>
            )}

            {/* 原始解析失敗的 Fallback */}
            {analysisData.raw_analysis && (
              <div className="p-4 bg-slate-800/50 border border-red-600/30 rounded-lg">
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{analysisData.raw_analysis}</p>
              </div>
            )}

            {/* ----- 以下是你原本的區塊渲染 ----- */}
            {personality && (
              <div className="p-5 bg-slate-800/50 border border-yellow-600/30 rounded-lg space-y-4">
                <h3 className="text-yellow-500 font-bold flex items-center gap-2 border-b border-yellow-600/20 pb-2">
                  <Sparkles className="h-4 w-4" /> 性格特質與易經架構
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{extractText(personality)}</p>
                
                {personality.ichingIntegration && (
                  <div className="mt-3 p-3 bg-slate-900/80 rounded border border-slate-700">
                    <span className="text-yellow-600 text-xs font-bold mb-1 block">《周易》卦象整合：</span>
                    <p className="text-gray-400 text-sm leading-relaxed">{extractText(personality.ichingIntegration)}</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {career && (
                <div className="p-4 bg-slate-800/50 border border-blue-600/30 rounded-lg">
                  <h3 className="text-blue-400 font-bold flex items-center gap-2 mb-2 text-sm">
                    <Briefcase className="h-4 w-4" /> 事業與財富
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{extractText(career)}</p>
                </div>
              )}
              {relationships && (
                <div className="p-4 bg-slate-800/50 border border-pink-600/30 rounded-lg">
                  <h3 className="text-pink-400 font-bold flex items-center gap-2 mb-2 text-sm">
                    <Heart className="h-4 w-4" /> 感情與人際
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{extractText(relationships)}</p>
                </div>
              )}
            </div>

            {family && (
              <div className="p-4 bg-slate-800/50 border border-emerald-600/30 rounded-lg">
                <h3 className="text-emerald-400 font-bold flex items-center gap-2 mb-2 text-sm">
                  <Users className="h-4 w-4" /> 父母與手足
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{extractText(family)}</p>
              </div>
            )}

            {fortunes && (
              <div className="p-4 bg-slate-800/50 border border-purple-600/30 rounded-lg">
                <h3 className="text-purple-400 font-bold flex items-center gap-2 mb-3 text-sm">
                  <TrendingUp className="h-4 w-4" /> 2026-2030 流年運勢
                </h3>
                <div className="space-y-3">
                  {Array.isArray(fortunes) ? fortunes.map((f: any, i: number) => (
                    <div key={i} className="flex gap-3 text-sm bg-slate-900/50 p-2 rounded">
                      <span className="text-purple-400 font-bold min-w-[50px]">{f.year || `第 ${i+1} 年`}</span>
                      <span className="text-gray-300 leading-relaxed">{extractText(f.prediction || f)}</span>
                    </div>
                  )) : (
                    <p className="text-gray-300 text-sm leading-relaxed">{extractText(fortunes)}</p>
                  )}
                </div>
              </div>
            )}

            {metadata && (
              <div className="flex flex-wrap justify-between items-center text-[10px] text-slate-500 pt-2 px-1">
                <span className="mb-1 md:mb-0">Model: {metadata.model_used} | Latency: {metadata.response_time_ms}ms</span>
                <span>{metadata.risk_assessment}</span>
              </div>
            )}

            <Button onClick={handleAnalyze} variant="outline" className="w-full border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10 mt-4">
              重新推演命盤
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}