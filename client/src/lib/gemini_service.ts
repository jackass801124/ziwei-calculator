import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4000,
      },
    });
  }

  async analyzeChart(chartData: any) {
    try {
      const prompt = `請分析以下紫微斗數命盤數據，提供詳細的命理解析：\n${JSON.stringify(chartData, null, 2)}`;
      const response = await this.model.generateContent(prompt);
      const responseText = response.response.text();
      return {
        analysis: { text: responseText },
        metadata: {
          timestamp: new Date().toISOString(),
          model: 'gemini-pro',
          success: true,
        },
      };
    } catch (error) {
      return {
        analysis: { text: `分析失敗: ${error}` },
        metadata: {
          timestamp: new Date().toISOString(),
          model: 'gemini-pro',
          success: false,
        },
      };
    }
  }
}

let service: GeminiService | null = null;

export function initGeminiService(apiKey: string) {
  if (!service) {
    service = new GeminiService(apiKey);
  }
  return service;
}
