/**
 * 中宮元件 (Center Palace Component)
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 顯示命盤中宮資訊：農曆/陽曆生辰、五行局、命主、身主、四化
 */

import React from 'react';
import type { ChartResult } from '../lib/stars';
import { SI_HUA_TABLE } from '../lib/stars';

interface CenterPalaceProps {
  chart: ChartResult;
}

export default function CenterPalace({ chart }: CenterPalaceProps) {
  const siHuaMapping = SI_HUA_TABLE[chart.yearGanZhi.charAt(0) as keyof typeof SI_HUA_TABLE];

  return (
    <div
      className="flex flex-col items-center justify-center h-full p-2 text-center"
      style={{ background: 'var(--center-bg)' }}
    >
      {/* 裝飾性邊框 */}
      <div className="w-full h-full border border-[var(--gold)] rounded-sm p-2 flex flex-col items-center justify-center gap-1"
        style={{ borderStyle: 'double', borderWidth: '3px' }}>
        
        {/* 陽曆 */}
        <div className="text-[0.6rem] text-[var(--muted-foreground)] font-['Noto_Sans_TC']">
          {chart.solarDate}
        </div>
        
        {/* 農曆 */}
        <div className="text-[0.65rem] text-[var(--gold-light)] font-['Noto_Serif_TC'] font-medium">
          {chart.lunarDate}
        </div>
        
        {/* 干支 */}
        <div className="text-[0.6rem] text-[var(--muted-foreground)] font-['JetBrains_Mono']">
          {chart.yearGanZhi}年 {chart.monthGanZhi}月
        </div>
        <div className="text-[0.6rem] text-[var(--muted-foreground)] font-['JetBrains_Mono']">
          {chart.dayGanZhi}日 {chart.hourGanZhi}時
        </div>

        {/* 分隔線 */}
        <div className="w-full border-t gold-divider my-0.5" />

        {/* 五行局 */}
        <div className="text-sm font-bold text-[var(--gold)] font-['Noto_Serif_TC'] tracking-wider">
          {chart.fiveElementsBureau}
        </div>

        {/* 命主身主 */}
        <div className="flex gap-2 text-[0.6rem]">
          <span className="text-[var(--muted-foreground)]">
            命主：<span className="text-[var(--gold-light)]">{chart.mingZhu}</span>
          </span>
          <span className="text-[var(--muted-foreground)]">
            身主：<span className="text-[var(--celadon)]">{chart.shenZhu}</span>
          </span>
        </div>

        {/* 分隔線 */}
        <div className="w-full border-t gold-divider my-0.5" />

        {/* 年干四化 */}
        <div className="text-[0.55rem] text-[var(--muted-foreground)] font-['Noto_Sans_TC']">
          {chart.yearGanZhi.charAt(0)}年四化
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[0.6rem]">
          {siHuaMapping && (
            <>
              <div className="flex items-center gap-0.5">
                <span className="sihua-badge sihua-lu">祿</span>
                <span className="text-[var(--foreground)]">{siHuaMapping.lu}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="sihua-badge sihua-quan">權</span>
                <span className="text-[var(--foreground)]">{siHuaMapping.quan}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="sihua-badge sihua-ke">科</span>
                <span className="text-[var(--foreground)]">{siHuaMapping.ke}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="sihua-badge sihua-ji">忌</span>
                <span className="text-[var(--foreground)]">{siHuaMapping.ji}</span>
              </div>
            </>
          )}
        </div>

        {/* 性別 */}
        <div className="text-[0.6rem] text-[var(--muted-foreground)] mt-0.5">
          {chart.gender === 'male' ? '♂ 男命' : '♀ 女命'}
        </div>
      </div>
    </div>
  );
}
