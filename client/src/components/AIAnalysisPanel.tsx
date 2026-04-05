/**
 * AI 分析面板元件
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 */

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ChartResult } from '@/lib/stars';

interface AIAnalysisPanelProps {
  chart: ChartResult | null;
  apiKey?: string;
}

/** 將 camelCase / snake_case key 轉為可讀的中文標題 */
const KEY_LABELS: Record<string, string> = {
  analysis: '命盤分析',
  personalityAndLifeStructure: '性格特質與人生底層架構',
  careerAndWealth: '事業前景與財富運勢',
  loveAndRelationships: '感情婚姻與人際關係',
  familyRelationships: '與父母及兄弟姊妹的關係',
  yearlyFortune: '流年運勢預測',
  yearlyFortunePredictions: '流年運勢預測',
  fortunePredictions: '流年運勢預測',
  ziweiAnalysis: '紫微斗數分析',
  ichingIntegration: '易經整合',
  riskFactors: '風險因素',
  advice: '建議',
  description: '說明',
  rating: '風險等級',
  year: '年份',
  overview: '總覽',
  summary: '總結',
  overallSummary: '整體總結',
  metadata: '分析資訊',
  analysis_timestamp: '分析時間',
  model_used: '使用模型',
  tokens_used: '使用 Token 數',
  response_time_ms: '回應時間 (ms)',
  warning_level: '警示等級',
  risk_assessment: '風險評估',
  cache_hit: '快取命中',
  raw_analysis: '分析結果',
  prediction: '預測',
  predictions: '預測',
  opportunities: '機會',
  challenges: '挑戰',
  health: '健康',
  relationships: '人際關係',
  career: '事業',
  wealth: '財富',
  love: '感情',
  marriage: '婚姻',
  family: '家庭',
  parentRelationship: '與父母的關係',
  siblingRelationship: '與兄弟姊妹的關係',
};

function getLabel(key: string): string {
  if (KEY_LABELS[key]) return KEY_LABELS[key];
  return key.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').trim();
}

/** 風險等級 badge */
function RatingBadge({ rating }: { rating: string }) {
  const colors: Record<string, string> = {
    high: 'bg-red-900/50 text-red-300 border-red-600',
    medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-600',
    low: 'bg-green-900/50 text-green-300 border-green-600',
  };
  const labels: Record<string, string> = {
    high: '高風險',
    medium: '中風險',
    low: '低風險',
  };
  const colorClass = colors[rating] || 'bg-slate-700 text-gray-300 border-slate-500';
  return (
    <span className={`inline-block px-2 py-0.5 text-xs rounded border ${colorClass}`}>
      {labels[rating] || rating}
    </span>
  );
}

/** 遞迴渲染分析資料 */
function RenderValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return <span>{value ? '是' : '否'}</span>;
  if (typeof value === 'number') return <span>{value.toLocaleString()}</span>;
  if (typeof value === 'string') {
    return <p className="text-gray-200 leading-relaxed">{value}</p>;
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((item, i) => {
          if (typeof item === 'string') {
            return (
              <div key={i} className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1 shrink-0">•</span>
                <p className="text-gray-200 leading-relaxed">{item}</p>
              </div>
            );
          }
          return (
            <div key={i} className="pl-2 border-l-2 border-yellow-700/30 ml-1">
              <RenderValue value={item} depth={depth + 1} />
            </div>
          );
        })}
      </div>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return (
      <div className="space-y-3">
        {entries.map(([key, val]) => {
          if (key === 'metadata' && depth === 0) return null;

          if (key === 'rating' && typeof val === 'string') {
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-yellow-500/70 text-sm">{getLabel(key)}：</span>
                <RatingBadge rating={val} />
              </div>
            );
          }

          const label = getLabel(key);
          const isSection = typeof val === 'object' && val !== null && !Array.isArray(val);
          const isTopSection = depth <= 1 && isSection;

          if (isTopSection) {
            return (
              <div key={key} className="mt-4">
                <h3 className={`font-bold mb-2 pb-1 border-b border-yellow-600/30 ${
                  depth === 0 ? 'text-lg text-yellow-400' : 'text-base text-yellow-500'
                }`}>
                  {label}
                </h3>
                <div className="pl-1">
                  <RenderValue value={val} depth={depth + 1} />
                </div>
              </div>
            );
          }

          if (typeof val === 'string' && val.length > 80) {
            return (
              <div key={key} className="mt-2">
                <h4 className="text-sm font-semibold text-yellow-500/80 mb-1">{label}</h4>
                <p className="text-gray-200 leading-relaxed">{val}</p>
              </div>
            );
          }

          return (
            <div key={key} className="mt-2">
              <h4 className="text-sm font-semibold text-yellow-500/80 mb-1">{label}</h4>
              <div className="pl-1">
                <RenderValue value={val} depth={depth + 1} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <span className="text-gray-200">{String(value)}</span>;
}

/** 渲染 metadata 區塊 */
function MetadataSection({ metadata }: { metadata: Record<string, unknown> }) {
  return (
    <details className="mt-4">
      <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
        📊 分析資訊
      </summary>
      <div className="mt-2 p-3 bg-slate-800/30 rounded text-xs text-gray-400 space-y-1">
        {Object.entries(metadata).map(([key, val]) => (
          <div key={key} className="flex gap-2">
            <span className="text-gray-500 shrink-0">{getLabel(key)}:</span>
            <span>{typeof val === 'boolean' ? (val ? '是' : '否') : String(val)}</span>
          </div>
        ))}
      </div>
    </details>
  );
}

export default function AIAnalysisPanel({ chart }: AIAnalysisPanelProps) {
  const [analysisData, setAnalysisData] = useState<Record<string, unknown> | null>(null);
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

  const metadata = analysisData?.metadata as Record<string, unknown> | undefined;

  return (
    <Card className="p-6 border-2 border-yellow-600/50 bg-slate-900/50">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-yellow-500">✨ 總命盤 AI 分析</h2>

        {!analysisData && !loading && (
          <Button
            onClick={handleAnalyze}
            disabled={!chart || loading}
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

        {analysisData && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 border border-yellow-600/30 rounded-lg">
              <RenderValue value={analysisData} depth={0} />
              {metadata && <MetadataSection metadata={metadata} />}
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
