/**
 * 紫微斗數與易經知識庫
 * 靜態知識庫預快取，用於 Gemini 上下文快取優化
 */

/**
 * 紫微斗數星曜知識庫
 */
export const ZIWEI_STARS_KNOWLEDGE = {
  main_stars: {
    紫微: {
      description: '紫微星是紫微斗數中最尊貴的星曜，代表帝王之氣，具有領導力、權力欲強、氣質高貴等特點。',
      characteristics: ['領導力強', '權力欲強', '氣質高貴', '責任感重'],
      palace_meanings: {
        命宮: '命主具有領導才能，適合從事管理工作',
        事業宮: '事業上能獲得成就，適合管理層職位',
        財帛宮: '財運不錯，但需謹慎投資',
        夫妻宮: '配偶可能較為強勢，需要相互尊重',
      },
    },
    天機: {
      description: '天機星代表智慧、聰慧、靈活變通，是紫微斗數中的智星。',
      characteristics: ['聰慧靈活', '善於變通', '思維敏捷', '適應力強'],
      palace_meanings: {
        命宮: '命主聰慧靈活，適合從事需要思考的工作',
        事業宮: '事業上需要靈活變通，適合從事變化性工作',
        財帛宮: '財運需要靠智慧獲得，投資需謹慎',
        夫妻宮: '配偶聰慧，但需要相互理解',
      },
    },
    太陽: {
      description: '太陽星代表光明、熱情、積極進取，是紫微斗數中的陽星。',
      characteristics: ['光明磊落', '熱情積極', '進取心強', '樂觀開朗'],
      palace_meanings: {
        命宮: '命主性格開朗，適合從事需要熱情的工作',
        事業宮: '事業上能獲得成就，適合領導職位',
        財帛宮: '財運較好，但需要積極進取',
        夫妻宮: '配偶性格開朗，感情生活較為和諧',
      },
    },
    武曲: {
      description: '武曲星代表剛毅、果決、執行力強，是紫微斗數中的武星。',
      characteristics: ['剛毅果決', '執行力強', '不怕困難', '堅持不懈'],
      palace_meanings: {
        命宮: '命主性格剛毅，適合從事需要決斷力的工作',
        事業宮: '事業上能獲得成就，適合執行層職位',
        財帛宮: '財運較好，適合從事商業活動',
        夫妻宮: '配偶性格剛毅，需要相互理解',
      },
    },
    天同: {
      description: '天同星代表溫和、善良、享樂，是紫微斗數中的福星。',
      characteristics: ['溫和善良', '享樂心強', '人緣好', '樂觀開朗'],
      palace_meanings: {
        命宮: '命主性格溫和，人緣較好',
        事業宮: '事業上需要人際關係，適合服務性工作',
        財帛宮: '財運需要靠人緣獲得',
        夫妻宮: '配偶溫和善良，感情生活較為和諧',
      },
    },
    廉貞: {
      description: '廉貞星代表廉潔、清廉、有操守，是紫微斗數中的廉星。',
      characteristics: ['廉潔清廉', '有操守', '原則性強', '不易妥協'],
      palace_meanings: {
        命宮: '命主性格廉潔，原則性強',
        事業宮: '事業上需要堅持原則，適合公務員工作',
        財帛宮: '財運需要靠廉潔獲得',
        夫妻宮: '配偶廉潔，感情生活較為穩定',
      },
    },
    天府: {
      description: '天府星代表福氣、福祿、厚重，是紫微斗數中的福星。',
      characteristics: ['福氣厚重', '福祿雙全', '穩重踏實', '財運不錯'],
      palace_meanings: {
        命宮: '命主福氣厚重，人生較為順利',
        事業宮: '事業上能獲得成就，適合穩定性工作',
        財帛宮: '財運較好，適合積累財富',
        夫妻宮: '配偶福氣厚重，感情生活較為和諧',
      },
    },
    太陰: {
      description: '太陰星代表柔和、細膩、敏感，是紫微斗數中的陰星。',
      characteristics: ['柔和細膩', '敏感多情', '直覺敏銳', '善於體察'],
      palace_meanings: {
        命宮: '命主性格柔和，善於體察他人',
        事業宮: '事業上需要細心，適合文藝類工作',
        財帛宮: '財運需要靠細心獲得',
        夫妻宮: '配偶柔和細膩，感情生活較為溫馨',
      },
    },
    貪狼: {
      description: '貪狼星代表貪心、欲望、進取，是紫微斗數中的貪星。',
      characteristics: ['貪心欲強', '進取心強', '不甘平庸', '野心勃勃'],
      palace_meanings: {
        命宮: '命主欲望強，進取心強',
        事業宮: '事業上能獲得成就，但需要謹慎',
        財帛宮: '財運較好，但需要謹慎投資',
        夫妻宮: '配偶欲望強，感情生活需要平衡',
      },
    },
    巨門: {
      description: '巨門星代表言語、溝通、表達，是紫微斗數中的言星。',
      characteristics: ['言語能力強', '善於表達', '溝通能力強', '口才好'],
      palace_meanings: {
        命宮: '命主言語能力強，善於表達',
        事業宮: '事業上需要溝通，適合銷售、教育工作',
        財帛宮: '財運需要靠言語獲得',
        夫妻宮: '配偶言語能力強，感情生活需要溝通',
      },
    },
    天相: {
      description: '天相星代表輔助、協調、和諧，是紫微斗數中的輔星。',
      characteristics: ['輔助性強', '協調能力強', '和諧包容', '善於合作'],
      palace_meanings: {
        命宮: '命主協調能力強，善於合作',
        事業宮: '事業上需要合作，適合團隊工作',
        財帛宮: '財運需要靠合作獲得',
        夫妻宮: '配偶協調能力強，感情生活較為和諧',
      },
    },
    天梁: {
      description: '天梁星代表長壽、穩定、保護，是紫微斗數中的壽星。',
      characteristics: ['穩定踏實', '保護欲強', '責任感重', '長壽健康'],
      palace_meanings: {
        命宮: '命主穩定踏實，責任感重',
        事業宮: '事業上能獲得成就，適合穩定性工作',
        財帛宮: '財運較好，適合長期投資',
        夫妻宮: '配偶穩定踏實，感情生活較為穩定',
      },
    },
    七殺: {
      description: '七殺星代表殺伐、果決、衝動，是紫微斗數中的殺星。',
      characteristics: ['果決衝動', '殺伐氣重', '不怕挑戰', '勇敢進取'],
      palace_meanings: {
        命宮: '命主性格果決，不怕挑戰',
        事業宮: '事業上能獲得成就，但需要謹慎',
        財帛宮: '財運需要謹慎，避免冒險',
        夫妻宮: '配偶果決衝動，感情生活需要平衡',
      },
    },
    破軍: {
      description: '破軍星代表破壞、創新、變革，是紫微斗數中的破星。',
      characteristics: ['破壞力強', '創新精神', '變革意識', '不守規則'],
      palace_meanings: {
        命宮: '命主創新精神強，不守規則',
        事業宮: '事業上需要創新，適合創業',
        財帛宮: '財運需要創新獲得，適合創業',
        夫妻宮: '配偶創新精神強，感情生活需要新鮮感',
      },
    },
  },
  lucky_stars: {
    左輔: '左輔星代表輔助、幫助，能增強命主的運勢。',
    右弼: '右弼星代表輔助、幫助，能增強命主的運勢。',
    文昌: '文昌星代表文化、學問、聰慧，能增強命主的文化修養。',
    文曲: '文曲星代表文化、藝術、創意，能增強命主的藝術才華。',
    祿存: '祿存星代表祿位、福祿，能增強命主的財運。',
    天馬: '天馬星代表行動、變化、流動，能增強命主的行動力。',
  },
  unlucky_stars: {
    擎羊: '擎羊星代表衝動、急躁，會增加命主的困難。',
    陀羅: '陀羅星代表糾纏、困擾，會增加命主的煩惱。',
    火星: '火星星代表衝突、爭執，會增加命主的衝突。',
    鈴星: '鈴星星代表警惕、危險，會增加命主的警惕。',
    地空: '地空星代表空虛、失落，會增加命主的失落感。',
    地劫: '地劫星代表劫難、困難，會增加命主的困難。',
  },
};

/**
 * 十二宮位知識庫
 */
export const TWELVE_PALACES_KNOWLEDGE = {
  命宮: '代表個人的性格、氣質、人生底層架構',
  兄弟宮: '代表與兄弟姊妹的關係',
  夫妻宮: '代表與配偶的關係、感情生活',
  子女宮: '代表與子女的關係',
  財帛宮: '代表財運、財富',
  疾厄宮: '代表健康、疾病',
  遷移宮: '代表出行、人際關係',
  交友宮: '代表朋友、人際關係',
  事業宮: '代表事業、職業',
  田宅宮: '代表房產、不動產',
  福德宮: '代表福氣、精神生活',
  父母宮: '代表與父母的關係',
};

/**
 * 四化知識庫
 */
export const FOUR_TRANSFORMATIONS_KNOWLEDGE = {
  祿化: '代表好運、福祿、順利',
  權化: '代表權力、控制、影響力',
  科化: '代表科名、聲譽、文化',
  忌化: '代表困難、阻礙、不利',
};

/**
 * 五行局知識庫
 */
export const FIVE_ELEMENTS_BUREAU_KNOWLEDGE = {
  水五局: '代表聰慧、靈活、適應力強',
  木五局: '代表仁愛、善良、進取心強',
  火五局: '代表熱情、積極、進取心強',
  土五局: '代表穩重、踏實、責任感重',
  金五局: '代表堅毅、果決、執行力強',
};

/**
 * 星曜強度知識庫
 */
export const STAR_STRENGTH_KNOWLEDGE = {
  廟: '星曜在廟地，力量最強，發揮最好',
  旺: '星曜在旺地，力量較強，發揮較好',
  利: '星曜在利地，力量中等，發揮一般',
  陷: '星曜在陷地，力量最弱，發揮最差',
};

/**
 * 易經卦象知識庫（簡化版）
 */
export const YIJING_KNOWLEDGE = {
  introduction: '《周易》是中國古代的經典著作，包含 64 卦象，每卦都有特定的含義和應用。',
  basic_concepts: {
    陰陽: '陰陽是易經的基本概念，代表相對的兩種力量',
    五行: '五行（金、木、水、火、土）是易經的另一個基本概念',
    八卦: '八卦是易經的基本符號，代表八種自然現象',
  },
  application_in_ziwei: '易經與紫微斗數可以結合使用，提供更深層的命理分析',
};

/**
 * 知識庫快取管理
 */
export class KnowledgeBaseCache {
  private cache: Map<string, any> = new Map();
  private initialized: boolean = false;

  /**
   * 初始化快取
   */
  initialize(): void {
    if (this.initialized) return;

    this.cache.set('ziwei_stars', ZIWEI_STARS_KNOWLEDGE);
    this.cache.set('twelve_palaces', TWELVE_PALACES_KNOWLEDGE);
    this.cache.set('four_transformations', FOUR_TRANSFORMATIONS_KNOWLEDGE);
    this.cache.set('five_elements_bureau', FIVE_ELEMENTS_BUREAU_KNOWLEDGE);
    this.cache.set('star_strength', STAR_STRENGTH_KNOWLEDGE);
    this.cache.set('yijing', YIJING_KNOWLEDGE);

    this.initialized = true;
    console.log('✓ 知識庫快取已初始化');
  }

  /**
   * 獲取星曜知識
   */
  getStarKnowledge(starName: string): any {
    this.initialize();
    return this.cache.get('ziwei_stars')?.main_stars?.[starName];
  }

  /**
   * 獲取宮位知識
   */
  getPalaceKnowledge(palaceName: string): string {
    this.initialize();
    return this.cache.get('twelve_palaces')?.[palaceName];
  }

  /**
   * 獲取四化知識
   */
  getTransformationKnowledge(transformationType: string): string {
    this.initialize();
    return this.cache.get('four_transformations')?.[transformationType];
  }

  /**
   * 獲取五行局知識
   */
  getFiveElementsBureauKnowledge(bureau: string): string {
    this.initialize();
    return this.cache.get('five_elements_bureau')?.[bureau];
  }

  /**
   * 獲取星曜強度知識
   */
  getStarStrengthKnowledge(strength: string): string {
    this.initialize();
    return this.cache.get('star_strength')?.[strength];
  }

  /**
   * 獲取易經知識
   */
  getYijingKnowledge(): any {
    this.initialize();
    return this.cache.get('yijing');
  }

  /**
   * 獲取完整知識庫（用於 Gemini 上下文快取）
   */
  getFullKnowledgeBase(): string {
    this.initialize();
    const fullKB = {
      ziwei_stars: this.cache.get('ziwei_stars'),
      twelve_palaces: this.cache.get('twelve_palaces'),
      four_transformations: this.cache.get('four_transformations'),
      five_elements_bureau: this.cache.get('five_elements_bureau'),
      star_strength: this.cache.get('star_strength'),
      yijing: this.cache.get('yijing'),
    };
    return JSON.stringify(fullKB, null, 2);
  }

  /**
   * 清空快取
   */
  clear(): void {
    this.cache.clear();
    this.initialized = false;
  }
}

/**
 * 導出單例實例
 */
export const knowledgeBaseCache = new KnowledgeBaseCache();
