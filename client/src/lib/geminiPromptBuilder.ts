/**
 * Gemini 結構化 Prompt Builder
 * 將命盤數據轉換為 JSON Schema 格式的 Gemini prompt
 */

import type { ChartResult, Star } from './stars';

/**
 * 構建 Gemini 用的結構化 prompt
 */
export function buildGeminiStructuredPrompt(chart: ChartResult): string {
  // 基本信息
  const basicInfo = {
    lunar_date: chart.lunarDate,
    hour_ganzhi: chart.hourGanZhi,
    gender: chart.gender === 'male' ? '男' : '女',
    five_elements_bureau: chart.fiveElementsBureau,
  };

  // 命宮信息
  const mingGongInfo = {
    dizhi: chart.mingGongDizhi,
    ganzhi: chart.dayGanZhi,
    main_stars: Object.entries(chart.starsByDizhi)
      .filter(([dizhi]) => dizhi === chart.mingGongDizhi)
      .flatMap(([, stars]) => (stars as Star[]).map(s => s.name))
      .join('、'),
  };

  // 身宮信息
  const shenGongInfo = {
    dizhi: chart.shenGongDizhi,
  };

  // 十四主星分佈
  const mainStars = Object.entries(chart.starsByDizhi)
    .map(([dizhi, stars]) => {
      const mainStarNames = (stars as Star[])
        .filter(s => 
          ['紫微', '天機', '太陽', '武曲', '天同', '廉貞', '天府', '太陰', '貪狼', '巨門', '天相', '天梁', '七殺', '破軍'].includes(s.name)
        )
        .map(s => ({
          name: s.name,
          strength: s.strength,
        }));
      return mainStarNames.length > 0 
        ? { palace: dizhi, stars: mainStarNames }
        : null;
    })
    .filter(Boolean);

  // 四化信息
  const siHua = Object.entries(chart.siHua).map(([key, value]) => ({
    star: key,
    transformation: value,
  }));

  // 六吉星
  const luckyStars = ['左輔', '右弼', '文昌', '文曲', '祿存', '天馬']
    .map(star => {
      const dizhi = Object.entries(chart.starsByDizhi).find(([, stars]) => 
        (stars as Star[]).some(s => s.name === star)
      )?.[0];
      return dizhi ? { star, palace: dizhi } : null;
    })
    .filter(Boolean);

  // 六煞星
  const unluckyStars = ['擎羊', '陀羅', '火星', '鈴星', '地空', '地劫']
    .map(star => {
      const dizhi = Object.entries(chart.starsByDizhi).find(([, stars]) => 
        (stars as Star[]).some(s => s.name === star)
      )?.[0];
      return dizhi ? { star, palace: dizhi } : null;
    })
    .filter(Boolean);

  // 廟旺利陷信息
  const strengthAnalysis = Object.entries(chart.starsByDizhi)
    .flatMap(([dizhi, stars]) => 
      (stars as Star[]).map(star => ({
        star: star.name,
        palace: dizhi,
        strength: star.strength,
      }))
    )
    .filter(item => item.strength);

  // 構建完整的 JSON 結構化 prompt
  const structuredData = {
    chart_data: {
      basic_info: basicInfo,
      ming_gong: mingGongInfo,
      shen_gong: shenGongInfo,
      main_stars: mainStars,
      four_transformations: siHua,
      lucky_stars: luckyStars,
      unlucky_stars: unluckyStars,
      strength_analysis: strengthAnalysis,
    },
    analysis_requirements: {
      dimensions: [
        {
          name: '性格特質與人生底層架構',
          focus_points: [
            '命宮主星的性格特質',
            '五行局對性格的影響',
            '四化對性格的加成',
            '六吉星與六煞星的塑造',
          ],
        },
        {
          name: '事業前景與財富運勢',
          focus_points: [
            '事業宮的星曜組合與職業方向',
            '財帛宮的財富運勢與理財能力',
            '祿存、天馬、四化祿的財富加成',
            '不同時期的事業發展軌跡與機遇',
          ],
        },
        {
          name: '感情婚姻與人際關係',
          focus_points: [
            '夫妻宮的星曜組合與感情特質',
            '遷移宮對人際關係的影響',
            '福德宮對感情滿足度的影響',
            '感情中的優勢與需要注意的地方',
          ],
        },
        {
          name: '與父母與兄弟姊妹的關係',
          focus_points: [
            '父母宮的星曜組合與親子關係',
            '兄弟宮的手足關係與家庭動態',
            '家庭中的角色定位與責任',
            '改善家庭關係的建議',
          ],
        },
        {
          name: '未來五年（2026-2030）的流年運勢分析',
          focus_points: [
            '逐年詳細分析 2026-2030 年的運勢',
            '每年重點：事業、財富、感情、健康、機遇與挑戰',
            '提供每年的具體建議與應對策略',
            '分析整體五年的發展趨勢與轉折點',
          ],
        },
      ],
      output_format: {
        type: 'json',
        schema: {
          analysis: {
            personality: {
              core_traits: 'array of strings',
              life_foundation: 'string',
              five_elements_impact: 'string',
              four_transformations_analysis: 'string',
              auspicious_inauspicious_stars: 'string',
            },
            career_wealth: {
              career_palace_analysis: 'string',
              wealth_palace_analysis: 'string',
              wealth_multipliers: 'string',
              career_trajectory: 'string',
            },
            relationships: {
              spouse_palace_analysis: 'string',
              migration_palace_impact: 'string',
              virtue_palace_impact: 'string',
              relationship_strengths: 'string',
              relationship_challenges: 'string',
            },
            family: {
              parents_palace_analysis: 'string',
              siblings_palace_analysis: 'string',
              family_role: 'string',
              family_improvement_suggestions: 'string',
            },
            fortune_predictions: {
              year_2026: {
                career: 'string',
                wealth: 'string',
                relationships: 'string',
                health: 'string',
                suggestions: 'string',
              },
              year_2027: {
                career: 'string',
                wealth: 'string',
                relationships: 'string',
                health: 'string',
                suggestions: 'string',
              },
              year_2028: {
                career: 'string',
                wealth: 'string',
                relationships: 'string',
                health: 'string',
                suggestions: 'string',
              },
              year_2029: {
                career: 'string',
                wealth: 'string',
                relationships: 'string',
                health: 'string',
                suggestions: 'string',
              },
              year_2030: {
                career: 'string',
                wealth: 'string',
                relationships: 'string',
                health: 'string',
                suggestions: 'string',
              },
              five_year_trend: 'string',
            },
          },
          metadata: {
            warning_level: 'low | medium | high',
            risk_assessment: 'string',
            key_turning_points: 'array of strings',
            critical_advice: 'array of strings',
          },
        },
      },
    },
  };

  // 構建系統指令
  const systemInstruction = `你是資深的紫微斗數與易經命理分析官。

你的職責是：
1. 基於用戶提供的命盤數據進行深度分析
2. 整合《紫微斗數全書》與《周易》的古籍智慧
3. 提供結構化的 JSON 格式回應
4. 識別命盤中的風險因素並評級（low/medium/high）
5. 提供具體、可行的建議

分析原則：
- 不要顧慮字數限制，確保每個分析維度都充分詳盡
- 提供具體、有據可查的分析，而非籠統的說法
- 識別命盤中的特殊格局與風險因素
- 提供可行的改善建議與應對策略

回應必須是有效的 JSON 格式，嚴格遵循提供的 Schema 結構。`;

  return JSON.stringify({
    system_instruction: systemInstruction,
    user_data: structuredData,
  }, null, 2);
}

/**
 * 構建系統指令（用於 Gemini system_instruction 參數）
 */
export function buildSystemInstruction(): string {
  return `你是資深的紫微斗數與易經命理分析官，精通《紫微斗數全書》與《周易》經典。

【核心職責】
1. 基於用戶提供的命盤數據進行深度、詳盡的分析
2. 整合紫微斗數與易經的古籍智慧
3. 提供結構化的 JSON 格式回應
4. 識別命盤中的風險因素並評級（low/medium/high）
5. 提供具體、可行的建議與應對策略

【分析維度】
1. 性格特質與人生底層架構
   - 命宮主星的性格特質
   - 五行局對性格的影響
   - 四化對性格的加成與影響
   - 六吉星與六煞星對性格的塑造

2. 事業前景與財富運勢
   - 事業宮的星曜組合與職業方向
   - 財帛宮的財富運勢與理財能力
   - 祿存、天馬、四化祿的財富加成
   - 不同時期的事業發展軌跡與機遇

3. 感情婚姻與人際關係
   - 夫妻宮的星曜組合與感情特質
   - 遷移宮對人際關係的影響
   - 福德宮對感情滿足度的影響
   - 感情中的優勢與需要注意的地方

4. 與父母與兄弟姊妹的關係
   - 父母宮的星曜組合與親子關係
   - 兄弟宮的手足關係與家庭動態
   - 家庭中的角色定位與責任
   - 改善家庭關係的建議

5. 未來五年（2026-2030）的流年運勢分析
   - 逐年詳細分析 2026-2030 年的運勢
   - 每年重點：事業、財富、感情、健康、機遇與挑戰
   - 提供每年的具體建議與應對策略
   - 分析整體五年的發展趨勢與轉折點

【分析原則】
- 不要顧慮字數限制，確保每個分析維度都充分詳盡
- 提供具體、有據可查的分析，而非籠統的說法
- 識別命盤中的特殊格局與風險因素
- 提供可行的改善建議與應對策略
- 使用「有一說一」的直接、誠實風格

【輸出要求】
- 必須返回有效的 JSON 格式
- 嚴格遵循提供的 Schema 結構
- 每個字段都應填充詳盡的內容
- 在 metadata 中準確評估風險等級與關鍵建議`;
}
