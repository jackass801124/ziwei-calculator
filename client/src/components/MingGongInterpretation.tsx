/**
 * 命宮星曜深度解析 UI 元件
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 功能：根據排盤結果，自動生成表格化的命宮星曜深度解析
 */

import { type ChartResult } from '@/lib/engine';
import { generatePalaceInterpretation, type PalaceInterpretationResult } from '@/lib/palaceInterpretation';
import { Card } from './ui/card';

interface MingGongInterpretationProps {
  chart: ChartResult;
}

export function MingGongInterpretation({ chart }: MingGongInterpretationProps) {
  const interpretation = generatePalaceInterpretation(chart);

  return (
    <div className="space-y-6">
      {/* 命宮整體性格特質 */}
      <Card className="p-6 bg-slate-900 border-amber-700">
        <h3 className="text-lg font-bold text-amber-400 mb-4">命宮本質摘要</h3>
        <div className="text-sm text-amber-100 leading-relaxed">
          <p className="mb-3">{interpretation.overallCharacter}</p>
          {interpretation.combinationAnalysis && (
            <p className="text-amber-200 italic">{interpretation.combinationAnalysis}</p>
          )}
        </div>
      </Card>

      {/* 主星詳細解析 */}
      {interpretation.mainStars.length > 0 && (
        <Card className="p-6 bg-slate-900 border-amber-700">
          <h3 className="text-lg font-bold text-amber-400 mb-4">命宮主星詳解</h3>
          <div className="space-y-4">
            {interpretation.mainStars.map((star) => (
              <div key={star.starName} className="border-l-4 border-amber-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-amber-400">{star.starName}</span>
                  {star.strength && (
                    <span className="text-xs bg-amber-700 text-amber-100 px-2 py-1 rounded">
                      {star.strength}
                    </span>
                  )}
                  {star.sihua && (
                    <span className="text-xs bg-blue-700 text-blue-100 px-2 py-1 rounded">
                      化{star.sihua}
                    </span>
                  )}
                </div>
                <p className="text-sm text-amber-100 leading-relaxed">
                  {star.contextInterpretation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 六吉星詳細解析 */}
      {interpretation.luckyStars.length > 0 && (
        <Card className="p-6 bg-slate-900 border-green-700">
          <h3 className="text-lg font-bold text-green-400 mb-4">六吉星輔助</h3>
          <div className="space-y-3">
            {interpretation.luckyStars.map((star) => (
              <div key={star.starName} className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-green-400">{star.starName}</span>
                  {star.strength && (
                    <span className="text-xs bg-green-700 text-green-100 px-2 py-1 rounded">
                      {star.strength}
                    </span>
                  )}
                </div>
                <p className="text-sm text-green-100 leading-relaxed">
                  {star.contextInterpretation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 六煞星詳細解析 */}
      {interpretation.unluckyStars.length > 0 && (
        <Card className="p-6 bg-slate-900 border-red-700">
          <h3 className="text-lg font-bold text-red-400 mb-4">六煞星警示</h3>
          <div className="space-y-3">
            {interpretation.unluckyStars.map((star) => (
              <div key={star.starName} className="border-l-4 border-red-500 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-red-400">{star.starName}</span>
                  {star.strength && (
                    <span className="text-xs bg-red-700 text-red-100 px-2 py-1 rounded">
                      {star.strength}
                    </span>
                  )}
                </div>
                <p className="text-sm text-red-100 leading-relaxed">
                  {star.contextInterpretation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 小星補充 */}
      {interpretation.minorStars.length > 0 && (
        <Card className="p-6 bg-slate-900 border-purple-700">
          <h3 className="text-lg font-bold text-purple-400 mb-4">小星補充</h3>
          <div className="space-y-3">
            {interpretation.minorStars.map((star) => (
              <div key={star.starName} className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-purple-400">{star.starName}</span>
                  {star.strength && (
                    <span className="text-xs bg-purple-700 text-purple-100 px-2 py-1 rounded">
                      {star.strength}
                    </span>
                  )}
                </div>
                <p className="text-sm text-purple-100 leading-relaxed">
                  {star.contextInterpretation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 人生路徑警示 */}
      <Card className="p-6 bg-slate-900 border-yellow-700">
        <h3 className="text-lg font-bold text-yellow-400 mb-4">人生路徑警示</h3>
        <p className="text-sm text-yellow-100 leading-relaxed">
          {interpretation.lifePathWarning}
        </p>
      </Card>
    </div>
  );
}
