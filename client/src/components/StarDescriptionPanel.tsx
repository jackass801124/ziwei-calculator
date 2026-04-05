/**
 * 星曜詳細解說面板元件
 * 顯示選中星曜的詳細信息、特性、關係、運勢分析
 */

import { useState } from 'react';
import { type ChartResult } from '@/lib/engine';
import { getStarDescription } from '@/lib/starDescriptions';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface StarDescriptionPanelProps {
  chart: ChartResult;
}

export function StarDescriptionPanel({ chart }: StarDescriptionPanelProps) {
  const [selectedStar, setSelectedStar] = useState<string | null>(null);

  // 收集所有星曜
  const allStars = new Set<string>();
  for (const dizhi in chart.starsByDizhi) {
    const starsInPalace = (chart.starsByDizhi as any)[dizhi];
    if (starsInPalace) {
      starsInPalace.forEach((star: any) => {
        allStars.add(star.name);
      });
    }
  }

  const starList = Array.from(allStars).sort();
  const selectedStarDesc = selectedStar ? getStarDescription(selectedStar) : null;

  return (
    <Card className="p-6 bg-slate-900 border-amber-700">
      <h3 className="text-lg font-bold text-amber-400 mb-4">本命各星詳細說明</h3>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="list">星曜列表</TabsTrigger>
          <TabsTrigger value="detail">詳細說明</TabsTrigger>
        </TabsList>

        {/* 星曜列表 */}
        <TabsContent value="list" className="space-y-2 mt-4">
          <div className="grid grid-cols-3 gap-2">
            {starList.map((star) => {
              const desc = getStarDescription(star);
              const isSelected = selectedStar === star;
              return (
                <button
                  key={star}
                  onClick={() => setSelectedStar(star)}
                  className={`p-2 text-sm font-semibold rounded transition-colors ${
                    isSelected
                      ? 'bg-amber-600 text-white'
                      : desc?.category === 'main'
                      ? 'bg-slate-700 text-amber-400 hover:bg-slate-600'
                      : desc?.category === 'luck'
                      ? 'bg-slate-700 text-green-400 hover:bg-slate-600'
                      : 'bg-slate-700 text-red-400 hover:bg-slate-600'
                  }`}
                >
                  {star}
                </button>
              );
            })}
          </div>
        </TabsContent>

        {/* 詳細說明 */}
        <TabsContent value="detail" className="space-y-4 mt-4">
          {selectedStarDesc ? (
            <div className="space-y-4">
              {/* 星曜基本信息 */}
              <div className="border-b border-amber-700 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-xl font-bold text-amber-400">
                    {selectedStarDesc.name}
                  </h4>
                  <Badge
                    variant={
                      selectedStarDesc.category === 'main'
                        ? 'default'
                        : selectedStarDesc.category === 'luck'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {selectedStarDesc.category === 'main'
                      ? '主星'
                      : selectedStarDesc.category === 'luck'
                      ? '吉星'
                      : '煞星'}
                  </Badge>
                  <Badge variant="outline" className="border-amber-700 text-amber-300">
                    {selectedStarDesc.brightness}
                  </Badge>
                </div>

                <p className="text-amber-300 text-sm leading-relaxed">
                  {selectedStarDesc.description}
                </p>
              </div>

              {/* 星曜特性 */}
              <div>
                <h5 className="font-semibold text-amber-400 mb-2">星曜特性</h5>
                <div className="grid grid-cols-2 gap-2">
                  {selectedStarDesc.characteristics.map((char, idx) => (
                    <div
                      key={idx}
                      className="text-sm text-amber-300 bg-slate-800 p-2 rounded"
                    >
                      • {char}
                    </div>
                  ))}
                </div>
              </div>

              {/* 星曜關係 */}
              <div>
                <h5 className="font-semibold text-amber-400 mb-2">星曜關係</h5>
                <div className="space-y-2">
                  {selectedStarDesc.relationships.map((rel, idx) => (
                    <div key={idx} className="text-sm text-amber-300 bg-slate-800 p-2 rounded">
                      • {rel}
                    </div>
                  ))}
                </div>
              </div>

              {/* 運勢分析 */}
              <div className="border-t border-amber-700 pt-4">
                <h5 className="font-semibold text-amber-400 mb-2">運勢分析</h5>
                <p className="text-sm text-amber-300 leading-relaxed">
                  {selectedStarDesc.fortuneAnalysis}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-amber-300 py-8">
              請從左側選擇星曜查看詳細說明
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
