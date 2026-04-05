import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

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
        // 🚨 移除了 JSON 限制，讓它自由發揮純文字
        temperature: 0.7,
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const systemInstruction = `你是資深的紫微斗數與易經命理分析官。
你的職責是基於用戶提供的命盤數據進行深度分析，並整合《紫微斗數全書》與《周易》的古籍智慧。
1. 基於用戶提供的命盤數據進行深度分析
2. 整合《紫微斗數全書》與《周易》的古籍智慧
3. 提供具體、可行的建議

分析維度：
- 性格特質與人生底層架構
- 事業前景與財富運勢
- 感情婚姻與人際關係
- 與父母與兄弟姊妹的關係
- 健康情況與該如何處理
- 2026-2030 年流年運勢預測

【嚴格排版規定 - 非常重要】：
1. 絕對不要輸出 JSON 格式！不要有任何 {} 或 "" 等程式碼符號。
2. 絕對不要使用 Markdown 符號（如 #, *, -, \` 等）。
3. 請使用「純中文長篇文章」的形式撰寫。
4. 段落標題請務必使用全形中括號【】，例如：【性格特質與底層架構】、【事業前景與財富運勢】、【感情婚姻與人際關係】、【父母與手足關係】、【2026-2030 流年運勢】。
5. 每個段落之間請空一行，保持版面乾淨易讀。`;

    const userPrompt = `請分析以下命盤數據，給出一份排版整齊、優美的中文命理分析報告：\n${JSON.stringify(chartData)}`;

    const response = await model.generateContent([
      { text: systemInstruction },
      { text: userPrompt },
    ]);

    const responseText = response.response.text();

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const tokensUsed = Math.ceil(responseText.length / 4);

    // 評估風險等級 (直接從純文字中判斷)
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

    // 將「純文字報告」與「系統資訊」包裝後回傳給前端
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