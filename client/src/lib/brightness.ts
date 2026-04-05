/**
 * 主星亮度計算與格局識別引擎
 * 根據星曜與宮位的關係計算亮度分值，識別特殊格局
 */

import { type ChartResult } from './engine';
import { PALACE_INDEX_TO_DIZHI } from './calendar';

// 主星亮度對應表（0-100分）
const STAR_BRIGHTNESS: Record<string, Record<string, number>> = {
  紫微: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  天機: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  太陽: { 寅: 100, 申: 100, 卯: 90, 酉: 90, 子: 80, 午: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  武曲: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  天同: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  廉貞: { 寅: 100, 申: 100, 卯: 90, 酉: 90, 子: 80, 午: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  天府: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  太陰: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  貪狼: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  巨門: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  天相: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  天梁: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  七殺: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
  破軍: { 子: 100, 午: 100, 寅: 90, 申: 90, 卯: 80, 酉: 80, 辰: 75, 戌: 75, 巳: 70, 亥: 70, 丑: 65, 未: 65 },
};

// 六吉星亮度加成
const LUCK_STAR_BONUS: Record<string, number> = {
  左輔: 10,
  右弼: 10,
  文昌: 8,
  文曲: 8,
  祿存: 12,
  天馬: 5,
};

// 六煞星亮度減成
const UNLUCK_STAR_PENALTY: Record<string, number> = {
  擎羊: -15,
  陀羅: -15,
  火星: -12,
  鈴星: -12,
  地空: -10,
  地劫: -10,
};

export interface StarBrightnessInfo {
  star: string;
  dizhi: string;
  brightness: number;
  status: '廟' | '旺' | '利' | '平' | '陷';
}

export interface PalaceAnalysis {
  dizhi: string;
  mainStars: StarBrightnessInfo[];
  luckStars: string[];
  unluckStars: string[];
  totalBrightness: number;
  luckyCount: number;
  unluckyCount: number;
  auspiciousIndex: number;
}

export interface PatternInfo {
  name: string;
  description: string;
  type: 'auspicious' | 'inauspicious' | 'neutral';
}

/**
 * 計算單個星曜的亮度
 */
export function calculateStarBrightness(star: string, dizhi: string): number {
  const brightness = STAR_BRIGHTNESS[star]?.[dizhi];
  return brightness !== undefined ? brightness : 50; // 預設值
}

/**
 * 計算宮位的總亮度與吉凶指數
 * 注意：命宮在 palaceIndex = 0，對應 chart.mingGongDizhi
 */
export function analyzePalace(chart: ChartResult, palaceIndex: number): PalaceAnalysis {
  // 命宮特殊處理：使用 mingGongDizhi
  let targetDizhi: string;
  if (palaceIndex === 0) {
    targetDizhi = chart.mingGongDizhi as string;
  } else {
    targetDizhi = PALACE_INDEX_TO_DIZHI[palaceIndex] as string;
  }
  
  const starsInPalace = chart.starsByDizhi[targetDizhi as keyof typeof chart.starsByDizhi] || [];
  
  const mainStars: StarBrightnessInfo[] = [];
  const luckStars: string[] = [];
  const unluckStars: string[] = [];
  
  let totalBrightness = 0;
  let luckyCount = 0;
  let unluckyCount = 0;

  // 計算主星亮度
  for (const star of starsInPalace) {
    const brightness = calculateStarBrightness(star.name, targetDizhi);
    const status = star.strength || '平';
    
    if (star.category === 'main') {
      mainStars.push({
        star: star.name,
        dizhi: targetDizhi,
        brightness,
        status: status as '廟' | '旺' | '利' | '平' | '陷',
      });
      totalBrightness += brightness;
    } else if (['month', 'time', 'year'].includes(star.category)) {
      // 檢查是吉星還是煞星
      if (['左輔', '右弼', '文昌', '文曲', '祿存', '天馬'].includes(star.name)) {
        luckStars.push(star.name);
        const bonus = LUCK_STAR_BONUS[star.name] || 5;
        totalBrightness += bonus;
        luckyCount++;
      } else if (['擎羊', '陀羅', '火星', '鈴星', '地空', '地劫'].includes(star.name)) {
        unluckStars.push(star.name);
        const penalty = UNLUCK_STAR_PENALTY[star.name] || -10;
        totalBrightness += penalty;
        unluckyCount++;
      }
    }
  }

  // 確保亮度在 0-100 範圍內
  totalBrightness = Math.max(0, Math.min(100, totalBrightness));

  // 計算吉凶指數
  const auspiciousIndex = luckyCount === 0 && unluckyCount === 0 
    ? 50 
    : (luckyCount / (luckyCount + unluckyCount)) * 100;

  return {
    dizhi: targetDizhi,
    mainStars,
    luckStars,
    unluckStars,
    totalBrightness,
    luckyCount,
    unluckyCount,
    auspiciousIndex: Math.round(auspiciousIndex),
  };
}

/**
 * 識別命盤中的特殊格局
 */
export function identifyPatterns(chart: ChartResult): PatternInfo[] {
  const patterns: PatternInfo[] = [];

  // 檢查祿馬交馳格
  if (hasLuMaJiaoChiPattern(chart)) {
    patterns.push({
      name: '祿馬交馳格',
      description: '主奔波勞碌而招財。',
      type: 'neutral',
    });
  }

  // 檢查泛水桃花格
  if (hasFanShuiTaoHuaPattern(chart)) {
    patterns.push({
      name: '泛水桃花',
      description: '無論男女，多風流，感情債不斷。',
      type: 'inauspicious',
    });
  }

  // 檢查祿權科忌格
  if (hasLuQuanKeJiPattern(chart)) {
    patterns.push({
      name: '祿權科忌聚',
      description: '四化齊聚，主事業有成。',
      type: 'auspicious',
    });
  }

  // 檢查紫府同宮格
  if (hasZiFuTongGongPattern(chart)) {
    patterns.push({
      name: '紫府同宮',
      description: '紫微天府同宮，主貴人相助。',
      type: 'auspicious',
    });
  }

  // 檢查日月坐命格
  if (hasRiYueZuoMingPattern(chart)) {
    patterns.push({
      name: '日月坐命',
      description: '太陽太陰坐命，主聰慧聰穎。',
      type: 'auspicious',
    });
  }

  // 檢查空劫格
  if (hasKongJiePattern(chart)) {
    patterns.push({
      name: '空劫同宮',
      description: '地空地劫同宮，主虛耗損失。',
      type: 'inauspicious',
    });
  }

  return patterns;
}

/**
 * 檢查祿馬交馳格：祿存與天馬在命宮三方四正
 */
function hasLuMaJiaoChiPattern(chart: ChartResult): boolean {
  const mingGongDizhi = chart.mingGongDizhi;
  const mingGongStars = chart.starsByDizhi[mingGongDizhi] || [];
  
  const hasLuCun = mingGongStars.some((s: any) => s.name === '祿存');
  const hasTianMa = mingGongStars.some((s: any) => s.name === '天馬');
  
  return hasLuCun && hasTianMa;
}

/**
 * 檢查泛水桃花格：貪狼在命宮且有擎羊陀羅
 */
function hasFanShuiTaoHuaPattern(chart: ChartResult): boolean {
  const mingGongDizhi = chart.mingGongDizhi;
  const mingGongStars = chart.starsByDizhi[mingGongDizhi] || [];
  
  const hasTanLang = mingGongStars.some((s: any) => s.name === '貪狼');
  const hasYangTuo = mingGongStars.some((s: any) => ['擎羊', '陀羅'].includes(s.name));
  
  return hasTanLang && hasYangTuo;
}

/**
 * 檢查祿權科忌格：四化齊聚在命宮
 */
function hasLuQuanKeJiPattern(chart: ChartResult): boolean {
  const mingGongDizhi = chart.mingGongDizhi;
  const mingGongStars = chart.starsByDizhi[mingGongDizhi] || [];
  
  let hasLu = false, hasQuan = false, hasKe = false, hasJi = false;
  
  for (const star of mingGongStars) {
    const sihua = chart.siHua[star.name as any];
    if (sihua?.includes('祿')) hasLu = true;
    if (sihua?.includes('權')) hasQuan = true;
    if (sihua?.includes('科')) hasKe = true;
    if (sihua?.includes('忌')) hasJi = true;
  }
  
  return hasLu && hasQuan && hasKe && hasJi;
}

/**
 * 檢查紫府同宮格
 */
function hasZiFuTongGongPattern(chart: ChartResult): boolean {
  for (const dizhi in chart.starsByDizhi) {
    const starsInPalace = (chart.starsByDizhi as any)[dizhi];
    const hasZiWei = starsInPalace.some((s: any) => s.name === '紫微');
    const hasTianFu = starsInPalace.some((s: any) => s.name === '天府');
    if (hasZiWei && hasTianFu) return true;
  }
  return false;
}

/**
 * 檢查日月坐命格
 */
function hasRiYueZuoMingPattern(chart: ChartResult): boolean {
  const mingGongDizhi = chart.mingGongDizhi;
  const mingGongStars = chart.starsByDizhi[mingGongDizhi] || [];
  
  const hasTaiYang = mingGongStars.some((s: any) => s.name === '太陽');
  const hasTaiYin = mingGongStars.some((s: any) => s.name === '太陰');
  
  return hasTaiYang && hasTaiYin;
}

/**
 * 檢查空劫格
 */
function hasKongJiePattern(chart: ChartResult): boolean {
  for (const dizhi in chart.starsByDizhi) {
    const starsInPalace = (chart.starsByDizhi as any)[dizhi];
    const hasKongJie = starsInPalace.some((s: any) => ['地空', '地劫'].includes(s.name));
    if (hasKongJie) return true;
  }
  return false;
}

/**
 * 計算命盤整體吉凶指數
 */
export function calculateChartAuspiciousIndex(chart: ChartResult): number {
  let totalLucky = 0;
  let totalUnlucky = 0;

  for (const dizhi in chart.starsByDizhi) {
    const starsInPalace = (chart.starsByDizhi as any)[dizhi] || [];
    totalLucky += starsInPalace.filter((s: any) => ['左輔', '右弼', '文昌', '文曲', '祿存', '天馬'].includes(s.name)).length;
    totalUnlucky += starsInPalace.filter((s: any) => ['地空', '地劫', '擎羊', '陀羅'].includes(s.name)).length;
  }

  if (totalLucky === 0 && totalUnlucky === 0) return 50;
  return Math.round((totalLucky / (totalLucky + totalUnlucky)) * 100);
}
