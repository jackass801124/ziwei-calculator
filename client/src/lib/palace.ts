/**
 * 宮位映射模組 (Palace Mapping Module)
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 功能：命宮身宮定位、十二宮排列、宮干計算（五虎遁）
 * 依據：《紫微斗數全書》安宮準則
 */

import {
  TIAN_GAN,
  DI_ZHI,
  DIZHI_TO_INDEX,
  PALACE_INDEX_TO_DIZHI,
  DIZHI_PALACE_INDEX,
  type TianGan,
  type DiZhi,
} from './calendar';

// ============================================================
// 十二宮名稱（從命宮逆時針排列）
// ============================================================

export const PALACE_NAMES = [
  '命宮', '兄弟宮', '夫妻宮', '子女宮',
  '財帛宮', '疾厄宮', '遷移宮', '交友宮',
  '事業宮', '田宅宮', '福德宮', '父母宮',
] as const;

export type PalaceName = typeof PALACE_NAMES[number];

// ============================================================
// 宮位資料結構
// ============================================================

export interface Palace {
  /** 宮位名稱 */
  name: PalaceName;
  /** 宮位地支 */
  dizhi: DiZhi;
  /** 宮位天干（五虎遁） */
  tiangan: TianGan;
  /** 宮位索引（1=寅, 2=卯, ... 12=丑） */
  palaceIndex: number;
  /** 是否為命宮 */
  isMingGong: boolean;
  /** 是否為身宮 */
  isShenGong: boolean;
}

// ============================================================
// 命宮定位演算法
// ============================================================

/**
 * 定命宮：從寅宮起，順數生月，再從該宮逆數生時
 * 例：生月=10（十月），生時=戌（10）
 * 從寅起順數10個月 → 亥
 * 從亥逆數10個時辰 → 丑
 * 命宮在丑
 *
 * @param lunarMonth 農曆月份 (1-12)
 * @param hourZhi 時辰地支
 * @returns 命宮地支
 */
export function calcMingGong(lunarMonth: number, hourZhi: DiZhi): DiZhi {
  // 寅宮為起點（索引1），順數生月
  // 寅=1, 卯=2, 辰=3, 巳=4, 午=5, 未=6, 申=7, 酉=8, 戌=9, 亥=10, 子=11, 丑=12
  const monthPalaceIndex = ((1 + lunarMonth - 1) % 12) || 12; // 從寅起，月份對應宮位
  // 實際計算：寅起為1，加月份-1
  const afterMonthIndex = ((0 + lunarMonth) % 12) || 12; // 寅=1對應index 0，加月份

  // 時辰地支索引（子=0, 丑=1, ... 亥=11）
  const hourIndex = DIZHI_TO_INDEX[hourZhi];

  // 從月份所在宮位（以寅為起點的宮位地支）逆數時辰
  // 寅起順數月份：月份1→寅, 月份2→卯, ... 月份12→丑
  // 對應地支索引（以子=0為基準）：寅=2, 卯=3, ... 丑=1
  const DIZHI_INDEX_FROM_ZERO: Record<DiZhi, number> = {
    '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
    '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
  };

  // 月份對應的宮位地支（寅起順數）
  // 月=1→寅(2), 月=2→卯(3), ... 月=10→亥(11), 月=11→子(0), 月=12→丑(1)
  const monthDizhiIndex = (2 + lunarMonth - 1) % 12; // 寅的索引是2
  
  // 從該地支逆數時辰（逆數=減去時辰索引）
  const mingGongIndex = ((monthDizhiIndex - hourIndex) % 12 + 12) % 12;
  
  return DI_ZHI[mingGongIndex];
}

/**
 * 定身宮：從寅宮起，順數生月，再從該宮順數生時
 *
 * @param lunarMonth 農曆月份 (1-12)
 * @param hourZhi 時辰地支
 * @returns 身宮地支
 */
export function calcShenGong(lunarMonth: number, hourZhi: DiZhi): DiZhi {
  const DIZHI_INDEX_FROM_ZERO: Record<DiZhi, number> = {
    '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
    '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
  };

  const hourIndex = DIZHI_INDEX_FROM_ZERO[hourZhi];
  // 月份對應地支（寅起順數）
  const monthDizhiIndex = (2 + lunarMonth - 1) % 12;
  // 順數時辰
  const shenGongIndex = (monthDizhiIndex + hourIndex) % 12;
  
  return DI_ZHI[shenGongIndex];
}

// ============================================================
// 五虎遁年起月干（宮干計算）
// ============================================================

/**
 * 五虎遁：根據年天干推算寅月天干
 * 甲己年：寅月起丙寅
 * 乙庚年：寅月起戊寅
 * 丙辛年：寅月起庚寅
 * 丁壬年：寅月起壬寅
 * 戊癸年：寅月起甲寅
 */
const FIVE_TIGER_BASE: Record<string, number> = {
  '甲': 2, '己': 2,  // 丙=2
  '乙': 4, '庚': 4,  // 戊=4
  '丙': 6, '辛': 6,  // 庚=6
  '丁': 8, '壬': 8,  // 壬=8
  '戊': 0, '癸': 0,  // 甲=0
};

/**
 * 計算各宮位天干（五虎遁）
 * 寅月天干確定後，依次順推
 *
 * @param yearGan 年天干
 * @param palaceDizhi 宮位地支
 * @returns 宮位天干
 */
export function calcPalaceTianGan(yearGan: TianGan, palaceDizhi: DiZhi): TianGan {
  // 寅月的天干索引
  const yinBaseGanIndex = FIVE_TIGER_BASE[yearGan];
  
  // 宮位地支相對於寅的偏移（寅=0, 卯=1, ... 丑=11）
  const DIZHI_FROM_YIN: Record<DiZhi, number> = {
    '寅': 0, '卯': 1, '辰': 2, '巳': 3, '午': 4, '未': 5,
    '申': 6, '酉': 7, '戌': 8, '亥': 9, '子': 10, '丑': 11,
  };
  
  const offset = DIZHI_FROM_YIN[palaceDizhi];
  const ganIndex = (yinBaseGanIndex + offset) % 10;
  return TIAN_GAN[ganIndex];
}

// ============================================================
// 十二宮完整排列
// ============================================================

/**
 * 建立十二宮配置
 * 命宮確定後，逆時針排列：命、兄、夫、子、財、疾、遷、奴、官、田、福、父
 * 注意：逆時針在地支序列中是「逆數」（地支順序為子丑寅...，逆時針即地支倒退）
 *
 * @param mingGongDizhi 命宮地支
 * @param shenGongDizhi 身宮地支
 * @param yearGan 年天干（用於計算宮干）
 * @returns 十二宮陣列（按地支順序，寅=index 0）
 */
export function buildPalaces(
  mingGongDizhi: DiZhi,
  shenGongDizhi: DiZhi,
  yearGan: TianGan
): Palace[] {
  // 命宮的地支在 PALACE_INDEX_TO_DIZHI 中的位置（寅=0, 卯=1, ... 丑=11）
  const mingGongArrayIndex = PALACE_INDEX_TO_DIZHI.indexOf(mingGongDizhi);
  
  const palaces: Palace[] = [];
  
  for (let i = 0; i < 12; i++) {
    // 宮位地支（按寅到丑順序）
    const dizhi = PALACE_INDEX_TO_DIZHI[i];
    
    // 計算此地支對應的宮名
    // 命宮在 mingGongArrayIndex，逆時針排列意味著地支索引減少對應宮名增加
    // 從命宮逆時針：命(0)→兄(1)→夫(2)...
    // 地支順序是順時針（寅→卯→辰...），所以逆時針排列宮名時，
    // 地支索引減少（或從命宮地支往前數）對應宮名順序
    const nameIndex = ((mingGongArrayIndex - i) % 12 + 12) % 12;
    
    const palace: Palace = {
      name: PALACE_NAMES[nameIndex],
      dizhi,
      tiangan: calcPalaceTianGan(yearGan, dizhi),
      palaceIndex: i + 1, // 1=寅, 2=卯, ... 12=丑
      isMingGong: dizhi === mingGongDizhi,
      isShenGong: dizhi === shenGongDizhi,
    };
    
    palaces.push(palace);
  }
  
  return palaces;
}

/**
 * 根據地支取得宮位
 */
export function getPalaceByDizhi(palaces: Palace[], dizhi: DiZhi): Palace | undefined {
  return palaces.find(p => p.dizhi === dizhi);
}

/**
 * 根據宮名取得宮位
 */
export function getPalaceByName(palaces: Palace[], name: PalaceName): Palace | undefined {
  return palaces.find(p => p.name === name);
}
