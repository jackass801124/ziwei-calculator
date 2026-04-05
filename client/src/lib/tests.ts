/**
 * 紫微斗數排盤引擎 Unit Tests
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 測試案例：1991/11/24 19:30 男
 * 預期結果：
 *   - 農曆：辛未年十月十九日戌時
 *   - 命宮在丑
 *   - 五行局：土五局
 *   - 紫微在辰
 */

import { solarToLunar } from './calendar';
import { calcMingGong, calcShenGong, calcPalaceTianGan } from './palace';
import { calcFiveElementsBureau, calcZiWeiPosition, BUREAU_TO_NAME } from './fiveElements';
import { generateChart } from './engine';

export interface TestResult {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  detail?: string;
}

export interface TestSuite {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: TestResult[];
}

/**
 * 執行所有 Unit Tests
 */
export function runAllTests(): TestSuite {
  const results: TestResult[] = [];

  // ── Test 1: 曆法轉換 ──
  {
    const lunar = solarToLunar(1991, 11, 24, 19, 30);
    results.push({
      name: 'T01: 農曆年干支',
      passed: lunar.yearGanZhi === '辛未',
      expected: '辛未',
      actual: lunar.yearGanZhi,
    });
    results.push({
      name: 'T02: 農曆月份',
      passed: lunar.month === 10,
      expected: '10（十月）',
      actual: String(lunar.month),
    });
    results.push({
      name: 'T03: 農曆日期',
      passed: lunar.day === 19,
      expected: '19（十九日）',
      actual: String(lunar.day),
    });
    results.push({
      name: 'T04: 時辰地支',
      passed: lunar.hourZhi === '戌',
      expected: '戌',
      actual: lunar.hourZhi,
    });
    results.push({
      name: 'T05: 完整農曆顯示',
      passed: lunar.displayString.includes('辛未') && lunar.displayString.includes('十月') && lunar.displayString.includes('戌'),
      expected: '辛未年十月十九日戌時',
      actual: lunar.displayString,
    });
  }

  // ── Test 2: 命宮定位 ──
  {
    // 辛未年十月十九日戌時
    const mingGong = calcMingGong(10, '戌');
    results.push({
      name: 'T06: 命宮地支',
      passed: mingGong === '丑',
      expected: '丑',
      actual: mingGong,
      detail: '生月=10(十月), 生時=戌 → 命宮在丑',
    });
  }

  // ── Test 3: 命宮天干（五虎遁） ──
  {
    const mingGongTianGan = calcPalaceTianGan('辛', '丑');
    results.push({
      name: 'T07: 命宮天干（五虎遁）',
      passed: mingGongTianGan === '辛',
      expected: '辛',
      actual: mingGongTianGan,
      detail: '辛年五虎遁，丑宮天干',
    });
  }

  // ── Test 4: 五行局 ──
  {
    const mingGongTianGan = calcPalaceTianGan('辛', '丑');
    const bureau = calcFiveElementsBureau(mingGongTianGan, '丑');
    const bureauName = BUREAU_TO_NAME[bureau];
    results.push({
      name: 'T08: 五行局',
      passed: bureau === 5 && bureauName === '土五局',
      expected: '土五局（5局）',
      actual: `${bureauName}（${bureau}局）`,
      detail: `命宮天干=${mingGongTianGan}，地支=丑 → 辛丑納音=壁上土`,
    });
  }

  // ── Test 5: 紫微星定位 ──
  {
    // 農曆日=19，土五局=5
    const ziWeiResult = calcZiWeiPosition(19, 5);
    results.push({
      name: 'T09: 紫微星位置',
      passed: ziWeiResult.dizhi === '辰',
      expected: '辰',
      actual: ziWeiResult.dizhi,
      detail: `D=19, B=5, X=${ziWeiResult.debug.X}, Q=${ziWeiResult.debug.Q}, P=${ziWeiResult.debug.P}`,
    });
  }

  // ── Test 6: 完整排盤整合測試 ──
  {
    const chart = generateChart({ year: 1991, month: 11, day: 24, hour: 19, minute: 0, gender: 'male' });
    
    results.push({
      name: 'T10: 完整排盤 - 命宮',
      passed: chart.mingGongDizhi === '丑',
      expected: '丑',
      actual: chart.mingGongDizhi,
    });
    results.push({
      name: 'T11: 完整排盤 - 五行局',
      passed: chart.fiveElementsBureau === '土五局',
      expected: '土五局',
      actual: chart.fiveElementsBureau,
    });
    results.push({
      name: 'T12: 完整排盤 - 紫微在辰',
      passed: chart.starsByDizhi['辰']?.some(s => s.name === '紫微') ?? false,
      expected: '紫微在辰',
      actual: `紫微在${Object.entries(chart.starsByDizhi).find(([_, stars]) => stars.some(s => s.name === '紫微'))?.[0] ?? '未知'}`,
    });
    results.push({
      name: 'T13: 辛年四化 - 巨門化祿',
      passed: chart.siHua['巨門'] === '祿',
      expected: '巨門化祿',
      actual: `巨門化${chart.siHua['巨門'] ?? '無'}`,
    });
    results.push({
      name: 'T14: 辛年四化 - 文昌化忌',
      passed: chart.siHua['文昌'] === '忌',
      expected: '文昌化忌',
      actual: `文昌化${chart.siHua['文昌'] ?? '無'}`,
    });
  }

  const passedTests = results.filter(r => r.passed).length;
  return {
    totalTests: results.length,
    passedTests,
    failedTests: results.length - passedTests,
    results,
  };
}
