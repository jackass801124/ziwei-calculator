/**
 * 主星亮度與吉凶分析元件
 * 顯示命盤中的主星亮度、六吉六煞統計、吉凶指數
 */

import { type ChartResult } from '@/lib/engine';
import { analyzePalace, calculateChartAuspiciousIndex } from '@/lib/brightness';
import { Card } from './ui/card';

interface BrightnessAnalysisProps {
  chart: ChartResult;
}

export function BrightnessAnalysis({ chart }: BrightnessAnalysisProps) {
  const mingGongAnalysis = analyzePalace(chart, 0);
  const chartAuspiciousIndex = calculateChartAuspiciousIndex(chart);

  return (
    <div className="space-y-6">
      {/* 主星亮度與吉凶分析表 */}
      <Card className="p-6 bg-slate-900 border-amber-700">
        <h3 className="text-lg font-bold text-amber-400 mb-4">主星亮度與吉凶分析</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* 命宮主星亮度 */}
          <div className="border border-amber-700 p-4">
            <div className="text-sm text-amber-300 mb-2">命宮主星亮度</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-amber-400">
                {mingGongAnalysis.totalBrightness}
              </div>
              <div className="text-xs text-amber-300">/100</div>
            </div>
          </div>

          {/* 吉凶指數 */}
          <div className="border border-amber-700 p-4">
            <div className="text-sm text-amber-300 mb-2">吉凶指數</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-amber-400">
                {mingGongAnalysis.auspiciousIndex}
              </div>
              <div className="text-xs text-amber-300">%</div>
            </div>
          </div>
        </div>

        {/* 主星亮度詳細表 */}
        <div className="mb-6">
          <div className="text-sm text-amber-300 mb-3">主星亮度</div>
          <div className="space-y-2">
            {mingGongAnalysis.mainStars.map((star) => (
              <div key={star.star} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-semibold">{star.star}</span>
                  <span className="text-amber-300 text-xs">({star.status})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-700 rounded">
                    <div
                      className="h-full bg-amber-500 rounded"
                      style={{ width: `${star.brightness}%` }}
                    />
                  </div>
                  <span className="text-amber-300 w-8 text-right">{star.brightness}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 六吉六煞統計 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-green-700 p-3">
            <div className="text-xs text-green-400 mb-2">六吉星</div>
            <div className="text-2xl font-bold text-green-400 mb-2">
              {mingGongAnalysis.luckyCount}
            </div>
            {mingGongAnalysis.luckStars.length > 0 && (
              <div className="text-xs text-green-300 space-y-1">
                {mingGongAnalysis.luckStars.map((star) => (
                  <div key={star}>{star}</div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-red-700 p-3">
            <div className="text-xs text-red-400 mb-2">六煞星</div>
            <div className="text-2xl font-bold text-red-400 mb-2">
              {mingGongAnalysis.unluckyCount}
            </div>
            {mingGongAnalysis.unluckStars.length > 0 && (
              <div className="text-xs text-red-300 space-y-1">
                {mingGongAnalysis.unluckStars.map((star) => (
                  <div key={star}>{star}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 整體吉凶指數 */}
      <Card className="p-6 bg-slate-900 border-amber-700">
        <h3 className="text-lg font-bold text-amber-400 mb-4">命盤整體吉凶指數</h3>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-slate-700 rounded overflow-hidden">
              <div
                className={`h-full transition-all ${
                  chartAuspiciousIndex >= 70
                    ? 'bg-green-500'
                    : chartAuspiciousIndex >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${chartAuspiciousIndex}%` }}
              />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-400 w-16 text-right">
            {chartAuspiciousIndex}%
          </div>
        </div>

        <div className="mt-4 text-sm text-amber-300">
          {chartAuspiciousIndex >= 70
            ? '✓ 吉利：命盤吉星眾多，運勢良好'
            : chartAuspiciousIndex >= 50
            ? '◐ 中等：命盤吉凶參半，需要謹慎'
            : '✗ 凶險：命盤煞星較多，需要特別注意'}
        </div>
      </Card>
    </div>
  );
}
