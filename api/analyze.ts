import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// 宮位名稱映射（按逆時針順序）
const PALACE_NAMES = [
  '命宮', '兄弟宮', '夫妻宮', '子女宮',
  '財帛宮', '疾厄宮', '遷移宮', '交友宮',
  '事業宮', '田宅宮', '福德宮', '父母宮',
] as const;

// 地支順序（順時針）
const DIZHI_ORDER = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'] as const;

/**
 * 根據命宮地支和當前地支，計算宮位名稱
 * 紫微斗數的宮位是逆時針排列的：命宮 → 兄弟宮 → 夫妻宮 → ...
 * 但地支是順時針的：寅 → 卯 → 辰 → ...
 * 所以需要用 (mingGongIndex - currentIndex) 來計算
 */
function getPalaceName(mingGongDizhi: string, currentDizhi: string): string {
  const mingGongIndex = DIZHI_ORDER.indexOf(mingGongDizhi as any);
  const currentIndex = DIZHI_ORDER.indexOf(currentDizhi as any);
  
  // 逆時針排列：命宮是起點(0)，往前數（地支往後）
  // 例：命宮在丑(11)，申(8)應該是第幾宮？
  // 從丑逆時針到申：丑 → 子 → 亥 → 戌 → 酉 → 申 = 5格 = 疾厄宮(5)
  const nameIndex = (mingGongIndex - currentIndex + 12) % 12;
  return PALACE_NAMES[nameIndex];
}

/**
 * 構建宮位信息字符串
 */
function buildPalaceInfo(chartData: any): string {
  const { starsByDizhi, mingGongDizhi } = chartData;
  
  if (!starsByDizhi || !mingGongDizhi) {
    return '無法構建宮位信息';
  }

  const palaceInfo: string[] = [];

  for (const dizhi of DIZHI_ORDER) {
    const palaceName = getPalaceName(mingGongDizhi, dizhi);
    const stars = starsByDizhi[dizhi] || [];
    
    let starInfo = '';
    if (stars.length === 0) {
      starInfo = '空宮';
    } else {
      starInfo = stars
        .map((star: any) => {
          const strength = star.strength ? `(${star.strength})` : '';
          const sihua = star.sihua ? `【${star.sihua}】` : '';
          return `${star.name}${strength}${sihua}`;
        })
        .join('、');
    }

    palaceInfo.push(`【${palaceName}】（${dizhi}）：${starInfo}`);
  }

  return palaceInfo.join('\n');
}

/**
 * 構建完整的提示詞
 */
function buildPrompt(chartData: any): string {
  const palaceInfo = buildPalaceInfo(chartData);
  
  const {
    solarDate,
    lunarDate,
    gender,
    mingGongDizhi,
    shenGongDizhi,
    fiveElementsBureau,
    mingZhu,
    shenZhu,
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
    hourGanZhi,
  } = chartData;

  return `你是一位資深的紫微斗數命理師，擁有30年以上的實踐經驗。請根據以下命盤數據進行深度、全面的命理分析。

【重要提示】
以下列出的宮位信息是命盤的準確數據，請根據這些信息進行分析，不要推測或修改宮位位置。
如果某個宮位顯示「空宮」，說明該宮位確實沒有主星，請根據宮位的輔星進行分析。

【命盤基本信息】
陽曆生日：${solarDate}
農曆生日：${lunarDate}
性別：${gender === 'male' ? '男' : '女'}
命宮地支：${mingGongDizhi}
身宮地支：${shenGongDizhi}
五行局：${fiveElementsBureau}
命主：${mingZhu}
身主：${shenZhu}
年干支：${yearGanZhi}
月干支：${monthGanZhi}
日干支：${dayGanZhi}
時干支：${hourGanZhi}

【命盤各宮位信息】
${palaceInfo}

【完整命盤數據】
${JSON.stringify(chartData, null, 2)}

【分析要求】
請按照以下結構進行詳細分析：

1. 【命盤基本資訊】
   - 陽曆生日、農曆生日、性別
   - 命宮、身宮、五行局、命主、身主
   - 年干四化

2. 【命宮分析】（最重要）
   - 命宮主星及其特質
   - 性格特徵、人生底層架構
   - 優勢與挑戰

3. 【性格與氣質】
   - 內在性格特質
   - 外在表現與人際風格
   - 情緒特點與應對方式

4. 【事業前景與財富運勢】
   - 事業宮分析
   - 適合的職業方向
   - 財富積累能力與方式
   - 事業發展的關鍵期

5. 【感情與婚姻】
   - 夫妻宮分析
   - 感情運勢與婚配特點
   - 伴侶特質與相處建議
   - 婚姻穩定性評估

6. 【家庭與人倫】
   - 父母宮分析
   - 兄弟宮分析
   - 子女宮分析
   - 交友宮分析

7. 【健康與身體】
   - 疾厄宮分析
   - 先天體質特點
   - 易患疾病傾向
   - 保健建議

8. 【遷移與環境】
   - 遷移宮分析
   - 適合的居住環境
   - 出行與移居運勢

9. 【福德與精神】
   - 福德宮分析
   - 精神世界與修養
   - 快樂源泉與滿足感

10. 【田宅與資產】
    - 田宅宮分析
    - 房產運勢
    - 家庭資產累積

11. 【流年運勢預測】（2026-2030）
    - 每一年的運勢概況
    - 吉凶時期
    - 建議與應對策略

12. 【綜合建議】
    - 人生發展方向
    - 需要特別注意的事項
    - 開運建議

【輸出格式要求】
- 使用清晰的中文，避免任何技術符號、代碼或格式標籤
- 每個分析部分用【】標記標題
- 內容要具體、實用、易於理解
- 避免使用 Markdown 符號、JSON 格式、轉義字符等
- 直接輸出純文本，段落之間用空行分隔
- 每個維度至少 200-300 字的深入分析

請開始詳細分析：`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const { chartData } = req.body;
    if (!chartData) {
      return res.status(400).json({ error: 'Missing chartData in request body' });
    }

    const startTime = Date.now();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const prompt = buildPrompt(chartData);
    console.log('[Analyze] Prompt length:', prompt.length);

    const response = await model.generateContent(prompt);
    const responseText = response.response.text();

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const tokensUsed = Math.ceil(responseText.length / 4);

    // 評估風險等級
    let warningLevel: 'low' | 'medium' | 'high' = 'low';
    if (responseText.includes('化忌') || responseText.includes('陷地') || responseText.includes('煞星')) {
      warningLevel = 'high';
    } else if (responseText.includes('平地') || responseText.includes('挑戰')) {
      warningLevel = 'medium';
    }

    const riskMessages = {
      high: '命盤中存在多個風險因素，建議重點關注化忌與煞星的影響。',
      medium: '命盤中存在中等風險因素，需要適當調整策略。',
      low: '命盤整體風險較低，可按計畫推進。',
    };

    return res.status(200).json({
      analysis_text: responseText,
      metadata: {
        model_used: 'gemini-2.5-flash',
        tokens_used: tokensUsed,
        response_time_ms: responseTime,
        warning_level: warningLevel,
        risk_assessment: riskMessages[warningLevel],
      },
    });

  } catch (error) {
    console.error('Gemini 分析失敗:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: `分析失敗: ${message}` });
  }
}
