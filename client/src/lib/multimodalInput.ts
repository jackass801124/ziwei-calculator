/**
 * 多模態輸入與 OCR 支援系統
 * 支援圖像上傳、命盤截圖識別、文字提取等功能
 */

/**
 * 圖像識別結果
 */
export interface ImageRecognitionResult {
  stars: Array<{
    name: string;
    palace: string;
    strength?: string;
  }>;
  transformations: Array<{
    star: string;
    type: string;
  }>;
  palaces: Array<{
    name: string;
    dizhi: string;
    stars: string[];
  }>;
  confidence: number;
  raw_text: string;
}

/**
 * 多模態輸入管理器
 */
export class MultimodalInputManager {
  /**
   * 驗證圖像文件
   */
  static validateImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 20 * 1024 * 1024;  // 20 MB

    if (!validTypes.includes(file.type)) {
      console.error('❌ 不支援的圖像格式');
      return false;
    }

    if (file.size > maxSize) {
      console.error('❌ 圖像文件過大');
      return false;
    }

    return true;
  }

  /**
   * 將圖像轉換為 Base64
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 調整圖像大小以優化 API 呼叫
   */
  static async resizeImage(
    file: File,
    maxWidth: number = 1024,
    maxHeight: number = 1024
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }

          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, file.type, 0.9);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 提取圖像中的文字（OCR）
   * 注：實際實現需要調用 Tesseract.js 或其他 OCR 庫
   */
  static async extractTextFromImage(imageBase64: string): Promise<string> {
    // 這是一個占位符實現
    // 實際應用中應使用 Tesseract.js 或 Google Vision API
    console.log('📸 提取圖像中的文字...');

    // 模擬 OCR 結果
    return `
    命宮：紫微 天相
    兄弟宮：武曲 天府
    夫妻宮：文昌 地劫
    子女宮：破軍 擎羊
    財帛宮：天同 七殺 祿存
    疾厄宮：廉貞 陀羅
    遷移宮：天梁 天馬
    交友宮：空
    事業宮：紫微 天相
    田宅宮：空
    福德宮：巨門 祿 地空
    父母宮：天機 貪狼 文曲 科
    `;
  }

  /**
   * 解析 OCR 文字結果為結構化數據
   */
  static parseOCRText(text: string): Partial<ImageRecognitionResult> {
    const result: Partial<ImageRecognitionResult> = {
      stars: [],
      transformations: [],
      palaces: [],
      raw_text: text,
      confidence: 0.7,  // 默認置信度
    };

    // 匹配宮位和星曜
    const palacePattern = /(\w+宮)：([\w\s、]+)/g;
    let match;

    while ((match = palacePattern.exec(text)) !== null) {
      const palaceName = match[1];
      const starsText = match[2];
      const stars = starsText.split('、').map(s => s.trim()).filter(s => s);

      result.palaces?.push({
        name: palaceName,
        dizhi: '',  // 需要進一步解析
        stars,
      });

      stars.forEach(star => {
        result.stars?.push({
          name: star,
          palace: palaceName,
        });
      });
    }

    return result;
  }

  /**
   * 驗證識別結果的合理性
   */
  static validateRecognitionResult(result: ImageRecognitionResult): boolean {
    // 檢查是否識別到了星曜
    if (result.stars.length === 0) {
      console.warn('⚠️ 未識別到任何星曜');
      return false;
    }

    // 檢查是否識別到了宮位
    if (result.palaces.length === 0) {
      console.warn('⚠️ 未識別到任何宮位');
      return false;
    }

    // 檢查置信度
    if (result.confidence < 0.5) {
      console.warn('⚠️ 識別置信度過低');
      return false;
    }

    return true;
  }

  /**
   * 將識別結果轉換為命盤數據結構
   */
  static convertToChartData(result: ImageRecognitionResult): any {
    const starsByDizhi: Record<string, any[]> = {};

    result.stars.forEach(star => {
      // 需要從宮位名稱轉換為地支
      const dizhi = this.convertPalaceNameToDizhi(star.palace);
      if (!starsByDizhi[dizhi]) {
        starsByDizhi[dizhi] = [];
      }
      starsByDizhi[dizhi].push({
        name: star.name,
        strength: star.strength || '平',
      });
    });

    return {
      starsByDizhi,
      recognitionConfidence: result.confidence,
      sourceType: 'image_ocr',
    };
  }

  /**
   * 將宮位名稱轉換為地支
   */
  private static convertPalaceNameToDizhi(palaceName: string): string {
    const mapping: Record<string, string> = {
      命宮: '丑',
      兄弟宮: '寅',
      夫妻宮: '卯',
      子女宮: '辰',
      財帛宮: '巳',
      疾厄宮: '午',
      遷移宮: '未',
      交友宮: '申',
      事業宮: '酉',
      田宅宮: '戌',
      福德宮: '亥',
      父母宮: '子',
    };

    return mapping[palaceName] || '丑';
  }

  /**
   * 支援拖拽上傳
   */
  static setupDragAndDrop(
    element: HTMLElement,
    onFilesSelected: (files: File[]) => void
  ): void {
    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      element.classList.add('drag-over');
    });

    element.addEventListener('dragleave', () => {
      element.classList.remove('drag-over');
    });

    element.addEventListener('drop', (e) => {
      e.preventDefault();
      element.classList.remove('drag-over');

      const files = Array.from(e.dataTransfer?.files || []);
      const imageFiles = files.filter(f => f.type.startsWith('image/'));

      if (imageFiles.length > 0) {
        onFilesSelected(imageFiles as File[]);
      }
    });
  }

  /**
   * 預覽圖像
   */
  static createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

/**
 * 圖像識別服務（與 Gemini 集成）
 */
export class ImageRecognitionService {
  /**
   * 識別命盤圖像
   */
  static async recognizeChartImage(
    imageBase64: string,
    geminiProvider: any
  ): Promise<ImageRecognitionResult> {
    try {
      const result = await geminiProvider.analyzeChartImage(imageBase64);

      return {
        stars: result.stars || [],
        transformations: result.transformations || [],
        palaces: result.palaces || [],
        confidence: result.confidence || 0.8,
        raw_text: result.raw_text || '',
      };
    } catch (error) {
      console.error('❌ 圖像識別失敗:', error);
      throw error;
    }
  }

  /**
   * 批量識別多張圖像
   */
  static async recognizeMultipleImages(
    imageBase64Array: string[],
    geminiProvider: any
  ): Promise<ImageRecognitionResult[]> {
    const results = await Promise.all(
      imageBase64Array.map(img => this.recognizeChartImage(img, geminiProvider))
    );
    return results;
  }
}
