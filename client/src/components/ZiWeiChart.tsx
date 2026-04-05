/**
 * 紫微斗數命盤元件 (Zi-Wei Dou-Shu Chart Component)
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 標準 4x4 宮格命盤佈局
 * 宮位排列（逆時針，從巳宮開始）：
 *
 * 巳  午  未  申
 * 辰  [中宮]  酉
 * 卯  [中宮]  戌
 * 寅  丑  子  亥
 */

import React, { useState } from 'react';
import type { ChartResult } from '../lib/stars';
import { buildPalaces } from '../lib/palace';
import type { DiZhi } from '../lib/calendar';
import PalaceCell from './PalaceCell';
import CenterPalace from './CenterPalace';

interface ZiWeiChartProps {
  chart: ChartResult;
}

// 標準命盤宮位排列（4x4 格，中間 2x2 為中宮）
// 外圈12個宮位的地支順序（從左上角巳宮，順時針）
const CHART_LAYOUT: (DiZhi | 'center')[][] = [
  ['巳', '午', '未', '申'],
  ['辰', 'center', 'center', '酉'],
  ['卯', 'center', 'center', '戌'],
  ['寅', '丑', '子', '亥'],
];

export default function ZiWeiChart({ chart }: ZiWeiChartProps) {
  const [selectedDizhi, setSelectedDizhi] = useState<DiZhi | null>(null);

  const palaces = buildPalaces(chart.mingGongDizhi, chart.shenGongDizhi, chart.yearGanZhi.charAt(0) as any);
  const palaceMap = Object.fromEntries(palaces.map(p => [p.dizhi, p]));

  return (
    <div className="w-full">
      {/* 命盤標題 */}
      <div className="text-center mb-3">
        <h2 className="chart-title text-lg tracking-[0.2em]">紫微斗數命盤</h2>
        <div className="text-[0.7rem] text-[var(--muted-foreground)] mt-0.5">
          命宮：{chart.mingGongDizhi} ｜ 身宮：{chart.shenGongDizhi} ｜ {chart.fiveElementsBureau}
        </div>
      </div>

      {/* 4x4 命盤格 */}
      <div
        className="grid gap-0 border border-[var(--palace-border)]"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          aspectRatio: '1 / 1',
          maxWidth: '680px',
          margin: '0 auto',
        }}
      >
        {CHART_LAYOUT.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            if (cell === 'center') {
              // 中宮只渲染一次（左上角的 center 格）
              if (rowIdx === 1 && colIdx === 1) {
                return (
                  <div
                    key="center"
                    className="palace-cell"
                    style={{
                      gridColumn: '2 / 4',
                      gridRow: '2 / 4',
                    }}
                  >
                    <CenterPalace chart={chart} />
                  </div>
                );
              }
              return null; // 其他 center 格不渲染
            }

            const dizhi = cell as DiZhi;
            const palace = palaceMap[dizhi];
            if (!palace) return null;

            const stars = chart.starsByDizhi[dizhi] ?? [];
            const isSelected = selectedDizhi === dizhi;

            return (
              <div
                key={dizhi}
                className={`palace-cell ${isSelected ? 'ring-1 ring-[var(--gold)]' : ''}`}
                style={{ gridColumn: colIdx + 1, gridRow: rowIdx + 1 }}
              >
                <PalaceCell
                  palace={palace}
                  stars={stars}
                  onClick={() => setSelectedDizhi(isSelected ? null : dizhi)}
                />
              </div>
            );
          })
        )}
      </div>

      {/* 選中宮位詳細資訊 */}
      {selectedDizhi && (() => {
        const palace = palaceMap[selectedDizhi];
        const stars = chart.starsByDizhi[selectedDizhi] ?? [];
        if (!palace) return null;
        return (
          <div className="mt-3 p-3 border border-[var(--palace-border)] rounded-sm max-w-[680px] mx-auto"
            style={{ background: 'var(--palace-bg)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="chart-title text-sm">{palace.tiangan}{palace.dizhi} {palace.name}</span>
              {palace.isMingGong && <span className="text-[0.6rem] text-[var(--gold)] border border-[var(--gold)] px-1 rounded-sm">命宮</span>}
              {palace.isShenGong && <span className="text-[0.6rem] text-[var(--celadon)] border border-[var(--celadon)] px-1 rounded-sm">身宮</span>}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {stars.length === 0 ? (
                <span className="text-[var(--muted-foreground)] col-span-2">此宮無星曜</span>
              ) : (
                stars.map(star => (
                  <div key={star.name} className="flex items-center gap-1.5">
                    <span className={star.category === 'main' ? 'star-main' : 
                      (star.name === '擎羊' || star.name === '陀羅' || star.name === '地空' || star.name === '地劫') 
                        ? 'star-unlucky' : 'star-lucky'}>
                      {star.name}
                    </span>
                    {star.strength && (
                      <span className={`text-[0.6rem] ${
                        star.strength === '廟' ? 'strength-miao' :
                        star.strength === '旺' ? 'strength-wang' :
                        star.strength === '利' ? 'strength-li' :
                        star.strength === '陷' ? 'strength-xian' : 'strength-ping'
                      }`}>{star.strength}</span>
                    )}
                    {star.sihua && (
                      <span className={`sihua-badge ${
                        star.sihua === '祿' ? 'sihua-lu' :
                        star.sihua === '權' ? 'sihua-quan' :
                        star.sihua === '科' ? 'sihua-ke' : 'sihua-ji'
                      }`}>{star.sihua}</span>
                    )}
                    <span className="text-[var(--muted-foreground)] text-[0.6rem]">
                      {star.category === 'main' ? '主星' :
                       star.category === 'month' ? '月系' :
                       star.category === 'time' ? '時系' :
                       star.category === 'year' ? '年系' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
