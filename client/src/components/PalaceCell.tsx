/**
 * 命盤宮格元件 (Palace Cell Component)
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 顯示單一宮格的所有資訊：宮名、天干地支、星曜、四化、廟旺利陷
 */

import React from 'react';
import type { Palace } from '../lib/palace';
import type { Star, SiHuaType, StarStrength } from '../lib/stars';

interface PalaceCellProps {
  palace: Palace;
  stars: Star[];
  isCenter?: boolean;
  onClick?: () => void;
}

// 四化標籤顏色
const SIHUA_CLASS: Record<SiHuaType, string> = {
  '祿': 'sihua-badge sihua-lu',
  '權': 'sihua-badge sihua-quan',
  '科': 'sihua-badge sihua-ke',
  '忌': 'sihua-badge sihua-ji',
};

// 廟旺利陷顏色
const STRENGTH_CLASS: Record<StarStrength, string> = {
  '廟': 'strength-miao',
  '旺': 'strength-wang',
  '利': 'strength-li',
  '平': 'strength-ping',
  '陷': 'strength-xian',
};

// 星曜分類顯示
function StarDisplay({ star }: { star: Star }) {
  const isMain = star.category === 'main';
  const isUnlucky = star.category === 'year' && 
    (star.name === '擎羊' || star.name === '陀羅') ||
    star.category === 'time' && 
    (star.name === '地空' || star.name === '地劫');

  return (
    <div className={`flex items-center gap-0.5 ${isMain ? 'star-main text-sm' : isUnlucky ? 'star-unlucky' : 'star-lucky'}`}>
      <span>{star.name}</span>
      {star.strength && isMain && (
        <span className={`text-[0.55rem] ${STRENGTH_CLASS[star.strength]}`}>
          {star.strength}
        </span>
      )}
      {star.sihua && (
        <span className={SIHUA_CLASS[star.sihua]}>
          {star.sihua}
        </span>
      )}
    </div>
  );
}

export default function PalaceCell({ palace, stars, isCenter = false, onClick }: PalaceCellProps) {
  // 分類星曜
  const mainStars = stars.filter(s => s.category === 'main');
  const luckyStars = stars.filter(s => 
    s.category === 'month' || 
    (s.category === 'year' && (s.name === '祿存' || s.name === '天馬')) ||
    (s.category === 'time' && (s.name === '文昌' || s.name === '文曲'))
  );
  const unluckyStars = stars.filter(s => 
    (s.category === 'year' && (s.name === '擎羊' || s.name === '陀羅')) ||
    (s.category === 'time' && (s.name === '地空' || s.name === '地劫'))
  );

  return (
    <div
      className={`palace-cell flex flex-col h-full min-h-[120px] p-1.5 cursor-pointer select-none
        ${palace.isMingGong ? 'ring-1 ring-[var(--gold)] ring-inset' : ''}
        ${palace.isShenGong ? 'ring-1 ring-[var(--celadon)] ring-inset' : ''}
        ${palace.isMingGong && palace.isShenGong ? 'ring-1 ring-purple-400 ring-inset' : ''}
      `}
      onClick={onClick}
    >
      {/* 宮名與地支天干 */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[0.65rem] text-[var(--muted-foreground)] font-['Noto_Sans_TC']">
          {palace.tiangan}{palace.dizhi}
        </span>
        <div className="flex items-center gap-1">
          {palace.isMingGong && (
            <span className="text-[0.55rem] text-[var(--gold)] border border-[var(--gold)] px-0.5 rounded-sm">命</span>
          )}
          {palace.isShenGong && !palace.isMingGong && (
            <span className="text-[0.55rem] text-[var(--celadon)] border border-[var(--celadon)] px-0.5 rounded-sm">身</span>
          )}
          {palace.isMingGong && palace.isShenGong && (
            <span className="text-[0.55rem] text-purple-400 border border-purple-400 px-0.5 rounded-sm">身</span>
          )}
        </div>
      </div>

      {/* 宮名 */}
      <div className="text-[0.7rem] text-[var(--muted-foreground)] mb-1 font-['Noto_Sans_TC']">
        {palace.name.replace('宮', '')}
      </div>

      {/* 主星 */}
      <div className="flex flex-col gap-0.5 flex-1">
        {mainStars.map(star => (
          <StarDisplay key={star.name} star={star} />
        ))}
      </div>

      {/* 輔助星 */}
      {(luckyStars.length > 0 || unluckyStars.length > 0) && (
        <div className="mt-1 pt-1 border-t border-[var(--border)] flex flex-wrap gap-x-1.5 gap-y-0.5">
          {luckyStars.map(star => (
            <StarDisplay key={star.name} star={star} />
          ))}
          {unluckyStars.map(star => (
            <StarDisplay key={star.name} star={star} />
          ))}
        </div>
      )}
    </div>
  );
}
