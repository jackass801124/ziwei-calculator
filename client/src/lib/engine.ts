/**
 * 紫微斗數排盤引擎 (Zi-Wei Dou-Shu Chart Engine)
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 主引擎：整合所有模組，產生完整命盤
 * 依據：《紫微斗數全書》
 */

import { solarToLunar, PALACE_INDEX_TO_DIZHI, type DiZhi, type TianGan } from './calendar';
import { calcMingGong, calcShenGong, buildPalaces, calcPalaceTianGan, type Palace } from './palace';
import { calcFiveElementsBureau, calcZiWeiPosition, BUREAU_TO_NAME, type FiveElementsBureau } from './fiveElements';
import {
  calcMainStars,
  calcZuoFu, calcYouBi,
  calcWenChang, calcWenQu,
  calcDiKong, calcDiJie,
  calcLuCun, calcQingYang, calcTuoLuo,
  calcTianMa,
  calcMingZhu, calcShenZhu,
  calcSiHua,
  getStarStrength,
  type Star, type StarCategory, type SiHuaType, type ChartResult,
} from './stars';

export type { ChartResult };

// ============================================================
// 排盤主函數
// ============================================================

export interface ChartInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: 'male' | 'female';
}

/**
 * 執行完整排盤
 */
export function generateChart(input: ChartInput): ChartResult {
  const { year, month, day, hour, minute, gender } = input;
  
  // ── 第一步：曆法轉換 ──
  const lunar = solarToLunar(year, month, day, hour, minute);
  
  // ── 第二步：定命宮與身宮 ──
  const mingGongDizhi = calcMingGong(lunar.month, lunar.hourZhi);
  const shenGongDizhi = calcShenGong(lunar.month, lunar.hourZhi);
  
  // ── 第三步：計算命宮天干（五虎遁） ──
  const mingGongTianGan = calcPalaceTianGan(lunar.yearGan, mingGongDizhi);
  
  // ── 第四步：定五行局 ──
  const bureau = calcFiveElementsBureau(mingGongTianGan, mingGongDizhi);
  const bureauName = BUREAU_TO_NAME[bureau];
  
  // ── 第五步：紫微星定位 ──
  const ziWeiResult = calcZiWeiPosition(lunar.day, bureau);
  const ziWeiDizhi = ziWeiResult.dizhi;
  
  // ── 第六步：天府星定位（寅申軸對稱） ──
  const ziWeiArrayIndex = PALACE_INDEX_TO_DIZHI.indexOf(ziWeiDizhi);
  const ziWeiPalaceIndex = ziWeiArrayIndex + 1;
  let tianFuPalaceIndex = (14 - ziWeiPalaceIndex) % 12;
  if (tianFuPalaceIndex <= 0) tianFuPalaceIndex += 12;
  const tianFuDizhi = PALACE_INDEX_TO_DIZHI[tianFuPalaceIndex - 1];
  
  // ── 第七步：建立十二宮 ──
  const palaces = buildPalaces(mingGongDizhi, shenGongDizhi, lunar.yearGan);
  
  // ── 第八步：計算所有星曜位置 ──
  const mainStarPositions = calcMainStars(ziWeiDizhi);
  
  // 吉星
  const zuoFuDizhi = calcZuoFu(lunar.month);
  const youBiDizhi = calcYouBi(lunar.month);
  const wenChangDizhi = calcWenChang(lunar.hourZhi);
  const wenQuDizhi = calcWenQu(lunar.hourZhi);
  const diKongDizhi = calcDiKong(lunar.hourZhi);
  const diJieDizhi = calcDiJie(lunar.hourZhi);
  const luCunDizhi = calcLuCun(lunar.yearGan);
  const qingYangDizhi = calcQingYang(lunar.yearGan);
  const tuoLuoDizhi = calcTuoLuo(lunar.yearGan);
  const tianMaDizhi = calcTianMa(lunar.yearZhi);
  
  // ── 第九步：計算四化 ──
  const siHua = calcSiHua(lunar.yearGan);
  
  // ── 第十步：命主與身主 ──
  const mingZhu = calcMingZhu(lunar.yearZhi);
  const shenZhu = calcShenZhu(shenGongDizhi);
  
  // ── 第十一步：整合星曜到各宮位 ──
  const starsByDizhi: Record<string, Star[]> = {};
  
  // 初始化所有宮位
  for (const dz of PALACE_INDEX_TO_DIZHI) {
    starsByDizhi[dz] = [];
  }
  
  // 加入十四主星
  for (const [starName, dz] of Object.entries(mainStarPositions)) {
    const strength = getStarStrength(starName, dz as DiZhi);
    const sihuaType = siHua[starName];
    starsByDizhi[dz].push({
      name: starName,
      category: 'main',
      dizhi: dz as DiZhi,
      strength,
      sihua: sihuaType,
    });
  }
  
  // 加入六吉星
  const luckyStars: Array<{ name: string; dizhi: DiZhi; category: StarCategory }> = [
    { name: '左輔', dizhi: zuoFuDizhi, category: 'month' },
    { name: '右弼', dizhi: youBiDizhi, category: 'month' },
    { name: '文昌', dizhi: wenChangDizhi, category: 'time' },
    { name: '文曲', dizhi: wenQuDizhi, category: 'time' },
    { name: '祿存', dizhi: luCunDizhi, category: 'year' },
    { name: '天馬', dizhi: tianMaDizhi, category: 'year' },
  ];
  
  for (const s of luckyStars) {
    const sihuaType = siHua[s.name];
    starsByDizhi[s.dizhi].push({
      name: s.name,
      category: s.category,
      dizhi: s.dizhi,
      strength: getStarStrength(s.name, s.dizhi),
      sihua: sihuaType,
    });
  }
  
  // 加入六煞星
  const unluckyStars: Array<{ name: string; dizhi: DiZhi; category: StarCategory }> = [
    { name: '地空', dizhi: diKongDizhi, category: 'time' },
    { name: '地劫', dizhi: diJieDizhi, category: 'time' },
    { name: '擎羊', dizhi: qingYangDizhi, category: 'year' },
    { name: '陀羅', dizhi: tuoLuoDizhi, category: 'year' },
  ];
  
  for (const s of unluckyStars) {
    starsByDizhi[s.dizhi].push({
      name: s.name,
      category: s.category,
      dizhi: s.dizhi,
      strength: '平',
    });
  }
  
  // ── 組裝結果 ──
  const solarDateStr = `${year}年${month}月${day}日 ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  
  return {
    solarDate: solarDateStr,
    lunarDate: lunar.displayString,
    yearGanZhi: lunar.yearGanZhi,
    monthGanZhi: lunar.monthGanZhi,
    dayGanZhi: lunar.dayGanZhi,
    hourGanZhi: lunar.hourGanZhi,
    gender,
    
    mingGongDizhi,
    shenGongDizhi,
    fiveElementsBureau: bureauName,
    bureauNumber: bureau,
    mingZhu,
    shenZhu,
    
    starsByDizhi: starsByDizhi as Record<DiZhi, Star[]>,
    siHua,
    
    debug: {
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      ziWeiDebug: ziWeiResult.debug,
      ziWeiDizhi,
      tianFuDizhi,
      mingGongCalc: `生月=${lunar.month}(${lunar.monthGanZhi}), 生時=${lunar.hourZhi} → 命宮=${mingGongDizhi}`,
      shenGongCalc: `生月=${lunar.month}, 生時=${lunar.hourZhi} → 身宮=${shenGongDizhi}`,
      calendarValidation: lunar.yearGanZhi === '辛未' && lunar.month === 10 && lunar.day === 19 && lunar.hourZhi === '戌',
    },
  };
}

/**
 * 取得宮位中的星曜（按地支）
 */
export function getStarsForDizhi(chart: ChartResult, dizhi: DiZhi): Star[] {
  return chart.starsByDizhi[dizhi] ?? [];
}

/**
 * 取得命宮宮位
 */
export function getMingGongPalace(palaces: Palace[]): Palace | undefined {
  return palaces.find(p => p.isMingGong);
}
