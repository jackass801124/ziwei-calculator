/**
 * 格局分析元件
 * 顯示命盤中識別的特殊格局及其含義
 */

import { type ChartResult } from '@/lib/engine';
import { identifyPatterns } from '@/lib/brightness';
import { Card } from './ui/card';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface PatternAnalysisProps {
  chart: ChartResult;
}

export function PatternAnalysis({ chart }: PatternAnalysisProps) {
  const patterns = identifyPatterns(chart);

  if (patterns.length === 0) {
    return (
      <Card className="p-6 bg-slate-900 border-amber-700">
        <h3 className="text-lg font-bold text-amber-400 mb-4">格局分析</h3>
        <div className="text-amber-300 text-sm">
          暫無特殊格局識別。此命盤為普通格局。
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-slate-900 border-amber-700">
      <h3 className="text-lg font-bold text-amber-400 mb-4">格局分析</h3>
      
      <div className="space-y-4">
        {patterns.map((pattern, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 ${
              pattern.type === 'auspicious'
                ? 'border-green-600 bg-green-950'
                : pattern.type === 'inauspicious'
                ? 'border-red-600 bg-red-950'
                : 'border-amber-600 bg-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {pattern.type === 'auspicious' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : pattern.type === 'inauspicious' ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <Info className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="flex-1">
                <h4
                  className={`font-semibold mb-2 ${
                    pattern.type === 'auspicious'
                      ? 'text-green-400'
                      : pattern.type === 'inauspicious'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}
                >
                  {pattern.name}
                </h4>
                <p
                  className={`text-sm ${
                    pattern.type === 'auspicious'
                      ? 'text-green-300'
                      : pattern.type === 'inauspicious'
                      ? 'text-red-300'
                      : 'text-amber-300'
                  }`}
                >
                  {pattern.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 格局統計 */}
      <div className="mt-6 pt-4 border-t border-amber-700">
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <div className="text-green-400 font-bold">
              {patterns.filter((p) => p.type === 'auspicious').length}
            </div>
            <div className="text-green-300 text-xs">吉利格局</div>
          </div>
          <div>
            <div className="text-amber-400 font-bold">
              {patterns.filter((p) => p.type === 'neutral').length}
            </div>
            <div className="text-amber-300 text-xs">中性格局</div>
          </div>
          <div>
            <div className="text-red-400 font-bold">
              {patterns.filter((p) => p.type === 'inauspicious').length}
            </div>
            <div className="text-red-300 text-xs">凶險格局</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
