import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

/**
 * Vercel Serverless Function: /api/analyze
 * 將 Gemini AI 分析移至伺服器端，保護 API Key 不暴露於前端
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 僅允許 POST
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
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 8000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const systemInstruction = `你是資深的紫微斗數與易經命理分析官。
      
你的職責是：
1. 基於用戶提供的命盤數據進行深度分析
2. 整合《紫微斗數全書》與《周易》的古籍智慧
3. 提供結構化的 JSON 格式回應
4. 識別命盤中的風險因素並評級（low/medium/high）
5. 提供具體、可行的建議

分析維度：
- 性格特質與人生底層架構
- 事業前景與財富運勢
- 感情婚姻與人際關係
- 與父母與兄弟姊妹的關係
- 2026-2030 年流年運勢預測

回應必須是有效的 JSON 格式。`;

    const userPrompt = `請分析以下命盤數據，並提供深度的紫微斗數與易經整合分析：

${JSON.stringify(chartData, null, 2)}

請按照 JSON Schema 結構回應，確保每個分析維度都充分詳盡。`;

    const response = await model.generateContent([
      { text: systemInstruction },
      { text: userPrompt },
    ]);

    const responseText = response.response.text();

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const tokensUsed = Math.ceil(responseText.length / 4);

    // 嘗試解析 Gemini 回傳的 JSON，包含多層修復邏輯
    let analysisData: Record<string, unknown>;
    try {
      analysisData = JSON.parse(responseText);
    } catch {
      // 第一次修復：移除控制字元後重試
      const sanitized = responseText.replace(/[\x00-\x1F\x7F]/g, (ch: string) => {
        if (ch === '\n' || ch === '\r' || ch === '\t') return ch;
        return '';
      });
      try {
        analysisData = JSON.parse(sanitized);
      } catch {
        // 第二次修復：嘗試提取 JSON 物件（處理 Gemini 在 JSON 前後加入額外文字的情況）
        const jsonMatch = sanitized.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            analysisData = JSON.parse(jsonMatch[0]);
          } catch {
            // 所有修復都失敗，將原始文字作為分析結果回傳
            analysisData = { raw_analysis: responseText };
          }
        } else {
          analysisData = { raw_analysis: responseText };
        }
      }
    }

    // 評估風險等級
    const analysisText = JSON.stringify(analysisData).toLowerCase();
    let warningLevel: 'low' | 'medium' | 'high' = 'low';
    if (analysisText.includes('化忌') || analysisText.includes('陷地') || analysisText.includes('煞星')) {
      warningLevel = 'high';
    } else if (analysisText.includes('平地') || analysisText.includes('挑戰')) {
      warningLevel = 'medium';
    }

    const riskMessages = {
      high: '命盤中存在多個風險因素，建議重點關注化忌與煞星的影響。',
      medium: '命盤中存在中等風險因素，需要適當調整策略。',
      low: '命盤整體風險較低，可按計畫推進。',
    };

    const fullResponse = {
      ...analysisData,
      metadata: {
        analysis_timestamp: new Date().toISOString(),
        model_used: 'gemini-2.5-flash',
        tokens_used: tokensUsed,
        cache_hit: false,
        response_time_ms: responseTime,
        warning_level: warningLevel,
        risk_assessment: riskMessages[warningLevel],
      },
    };

    return res.status(200).json(fullResponse);
  } catch (error) {
    console.error('Gemini 分析失敗:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: `分析失敗: ${message}` });
  }
}
