/**
 * 五行局與紫微星定位模組 (Five Elements & Zi-Wei Star Module)
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 功能：五行局計算（六十甲子納音）、紫微星定位公式
 * 依據：《紫微斗數全書》安紫微星準則
 */

import { PALACE_INDEX_TO_DIZHI, type TianGan, type DiZhi } from './calendar';

// ============================================================
// 五行局定義
// ============================================================

export type FiveElementsBureau = 2 | 3 | 4 | 5 | 6;
export type FiveElementsName = '水二局' | '木三局' | '金四局' | '土五局' | '火六局';

export const BUREAU_TO_NAME: Record<FiveElementsBureau, FiveElementsName> = {
  2: '水二局',
  3: '木三局',
  4: '金四局',
  5: '土五局',
  6: '火六局',
};

// ============================================================
// 六十甲子納音表
// 依序為：甲子、乙丑、丙寅、丁卯、戊辰、己巳、庚午、辛未、壬申、癸酉...
// 每兩個干支共用一個納音五行
// ============================================================

/**
 * 六十甲子納音五行對應表
 * key: 天干索引(0-9) + 地支索引(0-11) 組合的甲子序號 (0-59)
 * value: 五行局數
 */
const NAYIN_TABLE: Record<number, FiveElementsBureau> = {
  // 甲子乙丑：海中金 → 金四局
  0: 4, 1: 4,
  // 丙寅丁卯：爐中火 → 火六局
  2: 6, 3: 6,
  // 戊辰己巳：大林木 → 木三局
  4: 3, 5: 3,
  // 庚午辛未：路旁土 → 土五局
  6: 5, 7: 5,
  // 壬申癸酉：劍鋒金 → 金四局
  8: 4, 9: 4,
  // 甲戌乙亥：山頭火 → 火六局
  10: 6, 11: 6,
  // 丙子丁丑：澗下水 → 水二局
  12: 2, 13: 2,
  // 戊寅己卯：城頭土 → 土五局
  14: 5, 15: 5,
  // 庚辰辛巳：白蠟金 → 金四局
  16: 4, 17: 4,
  // 壬午癸未：楊柳木 → 木三局
  18: 3, 19: 3,
  // 甲申乙酉：泉中水 → 水二局
  20: 2, 21: 2,
  // 丙戌丁亥：屋上土 → 土五局
  22: 5, 23: 5,
  // 戊子己丑：霹靂火 → 火六局
  24: 6, 25: 6,
  // 庚寅辛卯：松柏木 → 木三局
  26: 3, 27: 3,
  // 壬辰癸巳：長流水 → 水二局
  28: 2, 29: 2,
  // 甲午乙未：沙中金 → 金四局
  30: 4, 31: 4,
  // 丙申丁酉：山下火 → 火六局
  32: 6, 33: 6,
  // 戊戌己亥：平地木 → 木三局
  34: 3, 35: 3,
  // 庚子辛丑：壁上土 → 土五局
  36: 5, 37: 5,
  // 壬寅癸卯：金箔金 → 金四局
  38: 4, 39: 4,
  // 甲辰乙巳：覆燈火 → 火六局
  40: 6, 41: 6,
  // 丙午丁未：天河水 → 水二局
  42: 2, 43: 2,
  // 戊申己酉：大驛土 → 土五局
  44: 5, 45: 5,
  // 庚戌辛亥：釵釧金 → 金四局
  46: 4, 47: 4,
  // 壬子癸丑：桑柘木 → 木三局
  48: 3, 49: 3,
  // 甲寅乙卯：大溪水 → 水二局
  50: 2, 51: 2,
  // 丙辰丁巳：沙中土 → 土五局
  52: 5, 53: 5,
  // 戊午己未：天上火 → 火六局
  54: 6, 55: 6,
  // 庚申辛酉：石榴木 → 木三局
  56: 3, 57: 3,
  // 壬戌癸亥：大海水 → 水二局
  58: 2, 59: 2,
};

/**
 * 計算六十甲子序號 (0-59)
 * @param tiangan 天干
 * @param dizhi 地支
 */
function calcJiaZiIndex(tiangan: TianGan, dizhi: DiZhi): number {
  const TIAN_GAN_INDEX: Record<TianGan, number> = {
    '甲': 0, '乙': 1, '丙': 2, '丁': 3, '戊': 4,
    '己': 5, '庚': 6, '辛': 7, '壬': 8, '癸': 9,
  };
  const DI_ZHI_INDEX: Record<DiZhi, number> = {
    '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
    '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
  };
  
  const ganIdx = TIAN_GAN_INDEX[tiangan];
  const zhiIdx = DI_ZHI_INDEX[dizhi];
  
  // 六十甲子序號：天干每10循環，地支每12循環，序號 = (ganIdx * 6 + zhiIdx * 5) % 60
  // 更精確的計算：找到最小的 n >= 0 使得 n ≡ ganIdx (mod 10) 且 n ≡ zhiIdx (mod 12)
  for (let n = 0; n < 60; n++) {
    if (n % 10 === ganIdx && n % 12 === zhiIdx) {
      return n;
    }
  }
  return 0;
}

/**
 * 計算五行局
 * @param mingGongTianGan 命宮天干
 * @param mingGongDiZhi 命宮地支
 * @returns 五行局數
 */
export function calcFiveElementsBureau(
  mingGongTianGan: TianGan,
  mingGongDiZhi: DiZhi
): FiveElementsBureau {
  const jiaZiIndex = calcJiaZiIndex(mingGongTianGan, mingGongDiZhi);
  return NAYIN_TABLE[jiaZiIndex];
}

// ============================================================
// 紫微星定位公式
// ============================================================

/**
 * 紫微星定位演算法
 * D = 農曆日，B = 局數
 * 求最小非負整數 X，使得 (D + X) 能被 B 整除
 * 若 X 為偶數：宮位索引 P = (D+X)/B + X
 * 若 X 為奇數：宮位索引 P = (D+X)/B - X
 * 索引 1=寅, 2=卯, ... 12=丑
 *
 * @param lunarDay 農曆日 (1-30)
 * @param bureau 五行局數 (2-6)
 * @returns 紫微星所在地支
 */
export function calcZiWeiPosition(
  lunarDay: number,
  bureau: FiveElementsBureau
): { dizhi: DiZhi; debug: { D: number; B: number; X: number; Q: number; P: number } } {
  const D = lunarDay;
  const B = bureau;
  
  // 求最小非負整數 X 使得 (D + X) 能被 B 整除
  let X = 0;
  while ((D + X) % B !== 0) {
    X++;
  }
  
  const Q = (D + X) / B; // 商數
  
  let P: number;
  if (X % 2 === 0) {
    // X 為偶數
    P = Q + X;
  } else {
    // X 為奇數
    P = Q - X;
  }
  
  // 確保 P 在 1-12 範圍內
  P = ((P - 1) % 12 + 12) % 12 + 1;
  
  // 索引轉地支（1=寅, 2=卯, ... 12=丑）
  const dizhi = PALACE_INDEX_TO_DIZHI[P - 1];
  
  return {
    dizhi,
    debug: { D, B, X, Q, P },
  };
}
