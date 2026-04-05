/**
 * 曆法轉換模組 (Calendar Conversion Module)
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 功能：陽曆轉農曆、干支計算、時辰判定
 * 依據：《紫微斗數全書》曆法規範
 */

// @ts-ignore - lunar-javascript 無型別定義
import { Lunar, Solar } from 'lunar-javascript';

// ============================================================
// 常數定義
// ============================================================

/** 天干 */
export const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export type TianGan = typeof TIAN_GAN[number];

/** 地支 */
export const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export type DiZhi = typeof DI_ZHI[number];

/** 時辰對應（每個時辰跨2小時，子時 23:00-00:59） */
export const HOUR_TO_DIZHI: Record<number, DiZhi> = {
  23: '子', 0: '子',
  1: '丑', 2: '丑',
  3: '寅', 4: '寅',
  5: '卯', 6: '卯',
  7: '辰', 8: '辰',
  9: '巳', 10: '巳',
  11: '午', 12: '午',
  13: '未', 14: '未',
  15: '申', 16: '申',
  17: '酉', 18: '酉',
  19: '戌', 20: '戌',
  21: '亥', 22: '亥',
};

/** 時辰索引（子=0, 丑=1, ... 亥=11） */
export const DIZHI_TO_INDEX: Record<DiZhi, number> = {
  '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
  '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
};

/** 地支索引（寅=1, 卯=2, ... 丑=12，用於宮位計算） */
export const DIZHI_PALACE_INDEX: Record<DiZhi, number> = {
  '寅': 1, '卯': 2, '辰': 3, '巳': 4, '午': 5, '未': 6,
  '申': 7, '酉': 8, '戌': 9, '亥': 10, '子': 11, '丑': 12,
};

/** 宮位索引轉地支（1=寅, 2=卯, ... 12=丑） */
export const PALACE_INDEX_TO_DIZHI: DiZhi[] = [
  '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'
];

// ============================================================
// 農曆日期介面
// ============================================================

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
  yearGan: TianGan;
  yearZhi: DiZhi;
  monthGan: TianGan;
  monthZhi: DiZhi;
  dayGan: TianGan;
  dayZhi: DiZhi;
  hourZhi: DiZhi;
  hourGan: TianGan;
  /** 農曆年干支 e.g. "辛未" */
  yearGanZhi: string;
  /** 農曆月干支 e.g. "庚戌" */
  monthGanZhi: string;
  /** 農曆日干支 e.g. "壬午" */
  dayGanZhi: string;
  /** 時辰干支 e.g. "壬戌" */
  hourGanZhi: string;
  /** 顯示用農曆字串 e.g. "辛未年十月十九日戌時" */
  displayString: string;
}

// ============================================================
// 核心轉換函數
// ============================================================

/**
 * 陽曆轉農曆
 * @param year 陽曆年
 * @param month 陽曆月 (1-12)
 * @param day 陽曆日 (1-31)
 * @param hour 時 (0-23)
 * @param minute 分 (0-59)
 */
export function solarToLunar(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): LunarDate {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();

  // 取得農曆年月日
  const lunarYear = lunar.getYear();
  const lunarMonth = lunar.getMonth();
  const lunarDay = lunar.getDay();
  // lunar-javascript 中負月份表示閏月
  const isLeapMonth = lunarMonth < 0;

  // 干支
  const yearGanZhi = lunar.getYearInGanZhi();
  const monthGanZhi = lunar.getMonthInGanZhi();
  const dayGanZhi = lunar.getDayInGanZhi();

  // 時辰地支
  const hourZhi = HOUR_TO_DIZHI[hour] ?? '子';
  const hourGanZhi = getHourGanZhi(dayGanZhi.charAt(0) as TianGan, hourZhi);

  // 解析各干支
  const yearGan = yearGanZhi.charAt(0) as TianGan;
  const yearZhi = yearGanZhi.charAt(1) as DiZhi;
  const monthGan = monthGanZhi.charAt(0) as TianGan;
  const monthZhi = monthGanZhi.charAt(1) as DiZhi;
  const dayGan = dayGanZhi.charAt(0) as TianGan;
  const dayZhi = dayGanZhi.charAt(1) as DiZhi;
  const hourGan = hourGanZhi.charAt(0) as TianGan;

  // 農曆月份中文
  const monthNames = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  const dayNames = [
    '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
  ];

  const monthStr = (isLeapMonth ? '閏' : '') + monthNames[Math.abs(lunarMonth) - 1] + '月';
  const dayStr = dayNames[lunarDay];
  const displayString = `${yearGanZhi}年${monthStr}${dayStr}${hourZhi}時`;

  return {
    year: lunarYear,
    month: Math.abs(lunarMonth),
    day: lunarDay,
    isLeapMonth,
    yearGan,
    yearZhi,
    monthGan,
    monthZhi,
    dayGan,
    dayZhi,
    hourZhi,
    hourGan,
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
    hourGanZhi,
    displayString,
  };
}

/**
 * 五鼠遁時法：根據日天干推算時辰天干
 * 甲己日：甲子時起
 * 乙庚日：丙子時起
 * 丙辛日：戊子時起
 * 丁壬日：庚子時起
 * 戊癸日：壬子時起
 */
export function getHourGanZhi(dayGan: TianGan, hourZhi: DiZhi): string {
  const dayGanIndex = TIAN_GAN.indexOf(dayGan);
  // 五鼠遁：甲己=0, 乙庚=2, 丙辛=4, 丁壬=6, 戊癸=8
  const baseGanIndex = (dayGanIndex % 5) * 2;
  const hourZhiIndex = DIZHI_TO_INDEX[hourZhi];
  const hourGanIndex = (baseGanIndex + hourZhiIndex) % 10;
  return TIAN_GAN[hourGanIndex] + hourZhi;
}

/**
 * 取得年天干索引 (甲=0, 乙=1, ... 癸=9)
 */
export function getYearGanIndex(yearGan: TianGan): number {
  return TIAN_GAN.indexOf(yearGan);
}

/**
 * 農曆月份轉數字（正月=1）
 */
export function lunarMonthToNumber(month: number): number {
  return Math.abs(month);
}

/**
 * 驗證測試案例：1991/11/24 19:30 應為 辛未年十月十九日戌時
 */
export function validateTestCase(): boolean {
  const result = solarToLunar(1991, 11, 24, 19, 30);
  const expected = {
    yearGanZhi: '辛未',
    month: 10,
    day: 19,
    hourZhi: '戌' as DiZhi,
  };
  return (
    result.yearGanZhi === expected.yearGanZhi &&
    result.month === expected.month &&
    result.day === expected.day &&
    result.hourZhi === expected.hourZhi
  );
}
