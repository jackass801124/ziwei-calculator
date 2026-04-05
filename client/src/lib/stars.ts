/**
 * 星曜模組 (Stars Module)
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 功能：十四主星定位、六吉六煞、年月時系星、四化計算、廟旺利陷判定
 * 依據：《紫微斗數全書》安星準則
 */

import { PALACE_INDEX_TO_DIZHI, TIAN_GAN, type TianGan, type DiZhi } from './calendar';
import type { FiveElementsBureau } from './fiveElements';

// ============================================================
// 星曜類型定義
// ============================================================

export type StarCategory = 'main' | 'lucky' | 'unlucky' | 'year' | 'month' | 'time';
export type SiHuaType = '祿' | '權' | '科' | '忌';
export type StarStrength = '廟' | '旺' | '利' | '平' | '陷';

export interface Star {
  name: string;
  category: StarCategory;
  dizhi: DiZhi;
  strength?: StarStrength;
  sihua?: SiHuaType;
}

// ============================================================
// 十四主星定位
// ============================================================

/**
 * 紫微星系（逆時針排列）
 * 紫微 → 天機(跳1) → 太陽 → 武曲 → 天同(跳2) → 廉貞
 * 逆時針 = 地支索引遞減（寅→丑→子→亥...）
 */
const ZI_WEI_CHAIN: Array<{ name: string; skip: number }> = [
  { name: '紫微', skip: 0 },
  { name: '天機', skip: 1 }, // 跳1格
  { name: '太陽', skip: 0 },
  { name: '武曲', skip: 0 },
  { name: '天同', skip: 2 }, // 跳2格
  { name: '廉貞', skip: 0 },
];

/**
 * 天府星系（順時針排列）
 * 天府 → 太陰 → 貪狼 → 巨門 → 天相 → 天梁 → 七殺(跳3) → 破軍
 * 順時針 = 地支索引遞增
 */
const TIAN_FU_CHAIN: Array<{ name: string; skip: number }> = [
  { name: '天府', skip: 0 },
  { name: '太陰', skip: 0 },
  { name: '貪狼', skip: 0 },
  { name: '巨門', skip: 0 },
  { name: '天相', skip: 0 },
  { name: '天梁', skip: 0 },
  { name: '七殺', skip: 3 }, // 跳3格
  { name: '破軍', skip: 0 },
];

/**
 * 計算紫微星系位置
 * @param ziWeiDizhi 紫微星所在地支
 * @returns 紫微星系各星的地支映射
 */
function calcZiWeiChain(ziWeiDizhi: DiZhi): Record<string, DiZhi> {
  const result: Record<string, DiZhi> = {};
  
  // 地支索引（寅=0, 卯=1, ... 丑=11）
  const ziWeiIndex = PALACE_INDEX_TO_DIZHI.indexOf(ziWeiDizhi);
  
  let currentIndex = ziWeiIndex;
  
  for (const star of ZI_WEI_CHAIN) {
    // 跳過空格（逆時針 = 索引遞減）
    currentIndex = (currentIndex - star.skip - (star === ZI_WEI_CHAIN[0] ? 0 : 1) + 12) % 12;
    if (star === ZI_WEI_CHAIN[0]) {
      currentIndex = ziWeiIndex; // 紫微本身
    }
    result[star.name] = PALACE_INDEX_TO_DIZHI[currentIndex];
  }
  
  return result;
}

/**
 * 計算天府星位置（寅申軸對稱）
 * 天府位置 = 對稱於紫微（以寅申為軸）
 * 公式：tianFuIndex = (14 - ziWeiPalaceIndex) % 12
 * 其中 palaceIndex: 寅=1, 卯=2, ... 丑=12
 */
function calcTianFuPosition(ziWeiDizhi: DiZhi): DiZhi {
  // 轉換為宮位索引（寅=1, 卯=2, ... 丑=12）
  const ziWeiArrayIndex = PALACE_INDEX_TO_DIZHI.indexOf(ziWeiDizhi);
  const ziWeiPalaceIndex = ziWeiArrayIndex + 1; // 1-based
  
  // 天府索引
  let tianFuPalaceIndex = (14 - ziWeiPalaceIndex) % 12;
  if (tianFuPalaceIndex <= 0) tianFuPalaceIndex += 12;
  
  return PALACE_INDEX_TO_DIZHI[tianFuPalaceIndex - 1];
}

/**
 * 計算天府星系位置
 * 天府 → 太陰 → 貪狼 → 巨門 → 天相 → 天梁 → 七殺(跳化3格) → 破軍
 * 跳N格 = 中間空過N個小格，即順時针移動N+1格
 * @param tianFuDizhi 天府星所在地支
 * @returns 天府星系各星的地支映射
 */
function calcTianFuChain(tianFuDizhi: DiZhi): Record<string, DiZhi> {
  const result: Record<string, DiZhi> = {};
  
  const tianFuIndex = PALACE_INDEX_TO_DIZHI.indexOf(tianFuDizhi);
  
  // 天府本身
  result['天府'] = PALACE_INDEX_TO_DIZHI[tianFuIndex];
  // 太陰：順時针+1
  result['太陰'] = PALACE_INDEX_TO_DIZHI[(tianFuIndex + 1) % 12];
  // 貪狼：+2
  result['貪狼'] = PALACE_INDEX_TO_DIZHI[(tianFuIndex + 2) % 12];
  // 巨門：+3
  result['巨門'] = PALACE_INDEX_TO_DIZHI[(tianFuIndex + 3) % 12];
  // 天相：+4
  result['天相'] = PALACE_INDEX_TO_DIZHI[(tianFuIndex + 4) % 12];
  // 天梁：+5
  result['天梁'] = PALACE_INDEX_TO_DIZHI[(tianFuIndex + 5) % 12];
  // 七殺：跳化3格，即+5+3+1=+9
  result['七殺'] = PALACE_INDEX_TO_DIZHI[(tianFuIndex + 9) % 12];
  // 破軍：七殺+1
  result['破軍'] = PALACE_INDEX_TO_DIZHI[(tianFuIndex + 10) % 12];
  
  return result;
}

/**
 * 計算所有十四主星位置
 */
export function calcMainStars(ziWeiDizhi: DiZhi): Record<string, DiZhi> {
  const tianFuDizhi = calcTianFuPosition(ziWeiDizhi);
  
  const ziWeiChain = calcZiWeiChainCorrect(ziWeiDizhi);
  const tianFuChain = calcTianFuChain(tianFuDizhi);
  
  return { ...ziWeiChain, ...tianFuChain };
}

/**
 * 修正版紫微星系計算
 * 從紫微出發，逆時針排列（地支索引遞減）
 * 跳格規則：跳N格 = 中間空N個宮位
 */
function calcZiWeiChainCorrect(ziWeiDizhi: DiZhi): Record<string, DiZhi> {
  const result: Record<string, DiZhi> = {};
  const ziWeiIndex = PALACE_INDEX_TO_DIZHI.indexOf(ziWeiDizhi);
  
  // 紫微星本身
  result['紫微'] = ziWeiDizhi;
  
  // 天機：逆時針1格（跳1格=間隔1個空宮）
  // 逆時針1步 = index - 1
  // 跳1格 = 再逆時針1步 = index - 2
  const tianJiIndex = (ziWeiIndex - 2 + 12) % 12;
  result['天機'] = PALACE_INDEX_TO_DIZHI[tianJiIndex];
  
  // 太陽：從天機逆時針1格（無跳格）
  const taiYangIndex = (tianJiIndex - 1 + 12) % 12;
  result['太陽'] = PALACE_INDEX_TO_DIZHI[taiYangIndex];
  
  // 武曲：從太陽逆時針1格
  const wuQuIndex = (taiYangIndex - 1 + 12) % 12;
  result['武曲'] = PALACE_INDEX_TO_DIZHI[wuQuIndex];
  
  // 天同：從武曲逆時針1格（跳2格=再逆時針2步）
  // 跳2格 = 武曲之後空2格，天同在武曲逆時針3格
  const tianTongIndex = (wuQuIndex - 3 + 12) % 12;
  result['天同'] = PALACE_INDEX_TO_DIZHI[tianTongIndex];
  
  // 廉貞：從天同逆時針1格（無跳格）
  const lianZhenIndex = (tianTongIndex - 1 + 12) % 12;
  result['廉貞'] = PALACE_INDEX_TO_DIZHI[lianZhenIndex];
  
  return result;
}

// ============================================================
// 六吉星（月系、時系、年系）
// ============================================================

/**
 * 左輔星：農曆月份定位
 * 正月起辰，順數至生月
 */
export function calcZuoFu(lunarMonth: number): DiZhi {
  // 正月在辰（索引2，辰=PALACE_INDEX_TO_DIZHI[2]）
  const chenIndex = 2; // 辰在陣列中的索引
  const index = (chenIndex + lunarMonth - 1) % 12;
  return PALACE_INDEX_TO_DIZHI[index];
}

/**
 * 右弼星：農曆月份定位
 * 正月起戌，逆數至生月
 */
export function calcYouBi(lunarMonth: number): DiZhi {
  // 正月在戌（索引8，戌=PALACE_INDEX_TO_DIZHI[8]）
  const xuIndex = 8; // 戌在陣列中的索引
  const index = ((xuIndex - lunarMonth + 1) % 12 + 12) % 12;
  return PALACE_INDEX_TO_DIZHI[index];
}

/**
 * 文昌星：時辰定位
 * 子時起酉，逆數至生時
 */
export function calcWenChang(hourZhi: DiZhi): DiZhi {
  const DIZHI_INDEX: Record<DiZhi, number> = {
    '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
    '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
  };
  // 文昌：子時起酉，逆數
  // 酉的陣列索引為7（寅=0,卯=1,辰=2,巳=3,午=4,未=5,申=6,酉=7,戌=8,亥=9,子=10,丑=11）
  const youArrayIndex = 7; // 酉在PALACE_INDEX_TO_DIZHI中的索引
  const hourIndex = DIZHI_INDEX[hourZhi];
  const index = ((youArrayIndex - hourIndex) % 12 + 12) % 12;
  return PALACE_INDEX_TO_DIZHI[index];
}

/**
 * 文曲星：時辰定位
 * 子時起辰，順數至生時
 */
export function calcWenQu(hourZhi: DiZhi): DiZhi {
  const DIZHI_INDEX: Record<DiZhi, number> = {
    '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
    '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
  };
  // 文曲：子時起辰，順數
  const chenIndex = 2; // 辰的索引
  const hourIndex = DIZHI_INDEX[hourZhi];
  const index = (chenIndex + hourIndex) % 12;
  return PALACE_INDEX_TO_DIZHI[index];
}

/**
 * 地空星：時辰定位
 * 亥時起亥，逆數至生時
 */
export function calcDiKong(hourZhi: DiZhi): DiZhi {
  const DIZHI_INDEX: Record<DiZhi, number> = {
    '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
    '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
  };
  // 地空：亥時起亥，逆數
  const haiIndex = 11; // 亥的索引
  const hourIndex = DIZHI_INDEX[hourZhi];
  const index = ((haiIndex - hourIndex) % 12 + 12) % 12;
  return PALACE_INDEX_TO_DIZHI[index];
}

/**
 * 地劫星：時辰定位
 * 亥時起亥，順數至生時
 */
export function calcDiJie(hourZhi: DiZhi): DiZhi {
  const DIZHI_INDEX: Record<DiZhi, number> = {
    '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
    '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
  };
  // 地劫：亥時起亥，順數
  const haiIndex = 11; // 亥的索引
  const hourIndex = DIZHI_INDEX[hourZhi];
  const index = (haiIndex + hourIndex) % 12;
  return PALACE_INDEX_TO_DIZHI[index];
}

// ============================================================
// 年系星（祿存、擎羊、陀羅）
// ============================================================

/**
 * 祿存、擎羊、陀羅定位表
 * 根據年天干定位
 */
const LU_CUN_TABLE: Record<TianGan, DiZhi> = {
  '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
  '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
  '壬': '亥', '癸': '子',
};

/**
 * 祿存：年天干定位
 */
export function calcLuCun(yearGan: TianGan): DiZhi {
  return LU_CUN_TABLE[yearGan];
}

/**
 * 擎羊：祿存前一位（順時針）
 */
export function calcQingYang(yearGan: TianGan): DiZhi {
  const luCun = LU_CUN_TABLE[yearGan];
  const index = PALACE_INDEX_TO_DIZHI.indexOf(luCun);
  return PALACE_INDEX_TO_DIZHI[(index + 1) % 12];
}

/**
 * 陀羅：祿存後一位（逆時針）
 */
export function calcTuoLuo(yearGan: TianGan): DiZhi {
  const luCun = LU_CUN_TABLE[yearGan];
  const index = PALACE_INDEX_TO_DIZHI.indexOf(luCun);
  return PALACE_INDEX_TO_DIZHI[(index - 1 + 12) % 12];
}

// ============================================================
// 天馬星（年支定位）
// ============================================================

const TIAN_MA_TABLE: Record<DiZhi, DiZhi> = {
  '寅': '申', '午': '申', '戌': '申',
  '申': '寅', '子': '寅', '辰': '寅',
  '亥': '巳', '卯': '巳', '未': '巳',
  '巳': '亥', '酉': '亥', '丑': '亥',
};

export function calcTianMa(yearZhi: DiZhi): DiZhi {
  return TIAN_MA_TABLE[yearZhi] ?? '寅';
}

// ============================================================
// 命主與身主
// ============================================================

const MING_ZHU_TABLE: Record<DiZhi, string> = {
  '子': '貪狼', '丑': '巨門', '寅': '祿存', '卯': '文曲',
  '辰': '廉貞', '巳': '武曲', '午': '破軍', '未': '武曲',
  '申': '廉貞', '酉': '文曲', '戌': '祿存', '亥': '巨門',
};

const SHEN_ZHU_TABLE: Record<DiZhi, string> = {
  '子': '火星', '丑': '天相', '寅': '天梁', '卯': '天同',
  '辰': '文昌', '巳': '天機', '午': '火星', '未': '天相',
  '申': '天梁', '酉': '天同', '戌': '文昌', '亥': '天機',
};

export function calcMingZhu(yearZhi: DiZhi): string {
  return MING_ZHU_TABLE[yearZhi] ?? '貪狼';
}

export function calcShenZhu(shenGongDizhi: DiZhi): string {
  return SHEN_ZHU_TABLE[shenGongDizhi] ?? '火星';
}

// ============================================================
// 十干四化
// ============================================================

export interface SiHuaMapping {
  lu: string;  // 化祿
  quan: string; // 化權
  ke: string;  // 化科
  ji: string;  // 化忌
}

/**
 * 十干四化對照表
 * 依據《紫微斗數全書》
 */
export const SI_HUA_TABLE: Record<TianGan, SiHuaMapping> = {
  '甲': { lu: '廉貞', quan: '破軍', ke: '武曲', ji: '太陽' },
  '乙': { lu: '天機', quan: '天梁', ke: '紫微', ji: '太陰' },
  '丙': { lu: '天同', quan: '天機', ke: '文昌', ji: '廉貞' },
  '丁': { lu: '太陰', quan: '天同', ke: '天機', ji: '巨門' },
  '戊': { lu: '貪狼', quan: '太陰', ke: '右弼', ji: '天機' },
  '己': { lu: '武曲', quan: '貪狼', ke: '天梁', ji: '文曲' },
  '庚': { lu: '太陽', quan: '武曲', ke: '太陰', ji: '天同' },
  '辛': { lu: '巨門', quan: '太陽', ke: '文曲', ji: '文昌' },
  '壬': { lu: '天梁', quan: '紫微', ke: '左輔', ji: '武曲' },
  '癸': { lu: '破軍', quan: '巨門', ke: '太陰', ji: '貪狼' },
};

/**
 * 計算年干四化
 * @param yearGan 年天干
 * @returns 各星曜的四化類型映射
 */
export function calcSiHua(yearGan: TianGan): Record<string, SiHuaType> {
  const mapping = SI_HUA_TABLE[yearGan];
  const result: Record<string, SiHuaType> = {};
  
  result[mapping.lu] = '祿';
  result[mapping.quan] = '權';
  result[mapping.ke] = '科';
  result[mapping.ji] = '忌';
  
  return result;
}

// ============================================================
// 廟旺利陷判定
// ============================================================

/**
 * 廟旺利陷對照表
 * 各主星在不同地支宮位的強度
 */
const STAR_STRENGTH_TABLE: Record<string, Partial<Record<DiZhi, StarStrength>>> = {
  '紫微': {
    '子': '廟', '丑': '旺', '寅': '利', '卯': '平', '辰': '廟', '巳': '旺',
    '午': '廟', '未': '旺', '申': '利', '酉': '平', '戌': '廟', '亥': '旺',
  },
  '天機': {
    '子': '旺', '丑': '平', '寅': '廟', '卯': '廟', '辰': '陷', '巳': '利',
    '午': '陷', '未': '平', '申': '利', '酉': '旺', '戌': '陷', '亥': '廟',
  },
  '太陽': {
    '子': '陷', '丑': '陷', '寅': '旺', '卯': '廟', '辰': '廟', '巳': '廟',
    '午': '廟', '未': '旺', '申': '利', '酉': '平', '戌': '陷', '亥': '陷',
  },
  '武曲': {
    '子': '廟', '丑': '廟', '寅': '平', '卯': '陷', '辰': '廟', '巳': '廟',
    '午': '平', '未': '陷', '申': '廟', '酉': '廟', '戌': '平', '亥': '陷',
  },
  '天同': {
    '子': '廟', '丑': '陷', '寅': '平', '卯': '旺', '辰': '陷', '巳': '陷',
    '午': '陷', '未': '廟', '申': '平', '酉': '旺', '戌': '陷', '亥': '廟',
  },
  '廉貞': {
    '子': '平', '丑': '陷', '寅': '廟', '卯': '平', '辰': '廟', '巳': '平',
    '午': '廟', '未': '陷', '申': '廟', '酉': '平', '戌': '廟', '亥': '陷',
  },
  '天府': {
    '子': '廟', '丑': '廟', '寅': '旺', '卯': '旺', '辰': '廟', '巳': '廟',
    '午': '廟', '未': '廟', '申': '旺', '酉': '旺', '戌': '廟', '亥': '廟',
  },
  '太陰': {
    '子': '廟', '丑': '廟', '寅': '陷', '卯': '陷', '辰': '陷', '巳': '陷',
    '午': '陷', '未': '陷', '申': '旺', '酉': '廟', '戌': '廟', '亥': '廟',
  },
  '貪狼': {
    '子': '旺', '丑': '廟', '寅': '廟', '卯': '旺', '辰': '平', '巳': '陷',
    '午': '平', '未': '廟', '申': '廟', '酉': '旺', '戌': '平', '亥': '陷',
  },
  '巨門': {
    '子': '廟', '丑': '旺', '寅': '陷', '卯': '陷', '辰': '旺', '巳': '廟',
    '午': '陷', '未': '陷', '申': '旺', '酉': '廟', '戌': '旺', '亥': '廟',
  },
  '天相': {
    '子': '廟', '丑': '廟', '寅': '廟', '卯': '廟', '辰': '廟', '巳': '廟',
    '午': '廟', '未': '廟', '申': '廟', '酉': '廟', '戌': '廟', '亥': '廟',
  },
  '天梁': {
    '子': '旺', '丑': '廟', '寅': '廟', '卯': '旺', '辰': '廟', '巳': '陷',
    '午': '廟', '未': '廟', '申': '旺', '酉': '廟', '戌': '陷', '亥': '陷',
  },
  '七殺': {
    '子': '廟', '丑': '平', '寅': '廟', '卯': '平', '辰': '廟', '巳': '平',
    '午': '廟', '未': '平', '申': '廟', '酉': '平', '戌': '廟', '亥': '平',
  },
  '破軍': {
    '子': '廟', '丑': '陷', '寅': '旺', '卯': '陷', '辰': '旺', '巳': '陷',
    '午': '廟', '未': '陷', '申': '旺', '酉': '陷', '戌': '旺', '亥': '陷',
  },
};

/**
 * 取得星曜廟旺利陷
 */
export function getStarStrength(starName: string, dizhi: DiZhi): StarStrength {
  const table = STAR_STRENGTH_TABLE[starName];
  if (!table) return '平';
  return table[dizhi] ?? '平';
}

// ============================================================
// 大限計算
// ============================================================

/**
 * 計算起大限年齡
 * 水二局：2歲起運
 * 木三局：3歲起運
 * 金四局：4歲起運
 * 土五局：5歲起運
 * 火六局：6歲起運
 */
export function calcDaXianStart(bureau: FiveElementsBureau): number {
  return bureau;
}

// ============================================================
// 完整排盤結果
// ============================================================

export interface ChartResult {
  // 基本資訊
  solarDate: string;
  lunarDate: string;
  yearGanZhi: string;
  monthGanZhi: string;
  dayGanZhi: string;
  hourGanZhi: string;
  gender: 'male' | 'female';
  
  // 命盤關鍵資訊
  mingGongDizhi: DiZhi;
  shenGongDizhi: DiZhi;
  fiveElementsBureau: string;
  bureauNumber: FiveElementsBureau;
  mingZhu: string;
  shenZhu: string;
  
  // 星曜位置（地支 → 星曜列表）
  starsByDizhi: Record<DiZhi, Star[]>;
  
  // 四化
  siHua: Record<string, SiHuaType>;
  
  // 偵錯資訊
  debug: {
    lunarDay: number;
    lunarMonth: number;
    ziWeiDebug: { D: number; B: number; X: number; Q: number; P: number };
    ziWeiDizhi: DiZhi;
    tianFuDizhi: DiZhi;
    mingGongCalc: string;
    shenGongCalc: string;
    calendarValidation: boolean;
  };
}
