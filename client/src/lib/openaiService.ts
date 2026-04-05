/**
 * OpenAI API 調用服務
 * 用於與 ChatGPT 進行通信
 */

/**
 * 調用 OpenAI ChatGPT API
 * @param prompt 完整的 prompt 字符串
 * @param apiKey OpenAI API Key
 * @returns ChatGPT 的回覆
 */
export async function callOpenAIChatGPT(
  prompt: string,
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 6000, // 允許充分詳盡的回覆，無字數限制
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API 錯誤: ${errorData.error?.message || '未知錯誤'}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('無法從 OpenAI 獲取回覆');
    }

    return content;
  } catch (error) {
    console.error('OpenAI API 調用失敗:', error);
    throw error;
  }
}
