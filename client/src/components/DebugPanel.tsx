/**
 * 偵錯面板元件 (Debug Panel Component)
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 顯示所有關鍵計算路徑，供開發者驗證演算法正確性
 */

import React, { useState } from 'react';
import type { ChartResult } from '../lib/stars';

interface DebugPanelProps {
  chart: ChartResult;
}

export default function DebugPanel({ chart }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { debug } = chart;

  return (
    <div className="mt-4 max-w-[680px] mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-[var(--border)] rounded-sm text-xs text-[var(--muted-foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors font-['Noto_Sans_TC']"
      >
        <span>⚙ 開發者偵錯模式 (Dev Mode)</span>
        <span>{isOpen ? '▲ 收起' : '▼ 展開'}</span>
      </button>

      {isOpen && (
        <div
          className="mt-1 p-3 border border-[var(--border)] rounded-sm text-xs font-['JetBrains_Mono'] space-y-2"
          style={{ background: 'oklch(0.10 0.01 45)' }}
        >
          {/* 曆法轉換 */}
          <section>
            <div className="text-[var(--gold)] font-bold mb-1">── 曆法轉換 (Calendar Conversion) ──</div>
            <div className="text-[var(--foreground)]">
              農曆：{chart.lunarDate}
            </div>
            <div className="text-[var(--foreground)]">
              農曆日：{debug.lunarDay}，農曆月：{debug.lunarMonth}
            </div>
            <div className="text-[var(--foreground)]">
              年干支：{chart.yearGanZhi}，月干支：{chart.monthGanZhi}
            </div>
            <div className="text-[var(--foreground)]">
              日干支：{chart.dayGanZhi}，時干支：{chart.hourGanZhi}
            </div>
            <div className={`mt-1 ${debug.calendarValidation ? 'text-green-400' : 'text-red-400'}`}>
              ✓ 測試案例驗證（1991/11/24 19:30 → 辛未年十月十九日戌時）：
              {debug.calendarValidation ? ' 通過 ✓' : ' 失敗 ✗'}
            </div>
          </section>

          {/* 命宮身宮 */}
          <section>
            <div className="text-[var(--gold)] font-bold mb-1">── 命宮身宮定位 (Palace Calculation) ──</div>
            <div className="text-[var(--foreground)]">{debug.mingGongCalc}</div>
            <div className="text-[var(--foreground)]">{debug.shenGongCalc}</div>
          </section>

          {/* 五行局 */}
          <section>
            <div className="text-[var(--gold)] font-bold mb-1">── 五行局計算 (Five Elements Bureau) ──</div>
            <div className="text-[var(--foreground)]">
              命宮：{chart.mingGongDizhi} → 五行局：{chart.fiveElementsBureau}（{chart.bureauNumber}局）
            </div>
          </section>

          {/* 紫微星定位 */}
          <section>
            <div className="text-[var(--gold)] font-bold mb-1">── 紫微星定位 (Zi-Wei Formula) ──</div>
            <div className="text-[var(--foreground)]">
              D（農曆日）= {debug.ziWeiDebug.D}，B（局數）= {debug.ziWeiDebug.B}
            </div>
            <div className="text-[var(--foreground)]">
              X（餘數補足）= {debug.ziWeiDebug.X}（{debug.ziWeiDebug.X % 2 === 0 ? '偶數 → P = Q + X' : '奇數 → P = Q - X'}）
            </div>
            <div className="text-[var(--foreground)]">
              Q（商數）= {debug.ziWeiDebug.Q}，P（宮位索引）= {debug.ziWeiDebug.P}
            </div>
            <div className="text-[var(--foreground)]">
              紫微星位置：{debug.ziWeiDizhi}（索引 {debug.ziWeiDebug.P}，1=寅...12=丑）
            </div>
          </section>

          {/* 天府星 */}
          <section>
            <div className="text-[var(--gold)] font-bold mb-1">── 天府星定位 (Tian-Fu Mirror) ──</div>
            <div className="text-[var(--foreground)]">
              天府位置 = (14 - {debug.ziWeiDebug.P}) % 12 = {debug.tianFuDizhi}
            </div>
          </section>

          {/* 四化 */}
          <section>
            <div className="text-[var(--gold)] font-bold mb-1">── 年干四化 (Si-Hua) ──</div>
            <div className="text-[var(--foreground)]">
              {Object.entries(chart.siHua).map(([star, type]) => (
                <span key={star} className="mr-3">
                  {star}<span className={
                    type === '祿' ? 'text-green-400' :
                    type === '權' ? 'text-yellow-400' :
                    type === '科' ? 'text-blue-400' : 'text-red-400'
                  }>化{type}</span>
                </span>
              ))}
            </div>
          </section>

          {/* 星曜分佈 */}
          <section>
            <div className="text-[var(--gold)] font-bold mb-1">── 星曜分佈 (Star Distribution) ──</div>
            <div className="grid grid-cols-3 gap-1">
              {Object.entries(chart.starsByDizhi).map(([dz, stars]) => (
                stars.length > 0 ? (
                  <div key={dz} className="text-[var(--foreground)]">
                    <span className="text-[var(--gold-light)]">{dz}：</span>
                    {stars.map(s => s.name).join('、')}
                  </div>
                ) : null
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
