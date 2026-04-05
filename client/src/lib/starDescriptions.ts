/**
 * 星曜詳細解說數據庫
 * 根據《紫微斗數全書》編譯的星曜特性與解釋
 */

export interface StarDescription {
  name: string;
  category: 'main' | 'luck' | 'unluck';
  brightness: string;
  description: string;
  characteristics: string[];
  relationships: string[];
  fortuneAnalysis: string;
}

export const STAR_DESCRIPTIONS: Record<string, StarDescription> = {
  紫微: {
    name: '紫微',
    category: 'main',
    brightness: '帝星',
    description: '紫微為北斗帝星，象徵權力、尊貴、領導力。入命主人聰慧、有領導才能、氣質高雅。',
    characteristics: [
      '聰慧智慧',
      '領導能力強',
      '氣質高雅',
      '自尊心強',
      '喜歡被尊重',
      '有責任感',
    ],
    relationships: [
      '與天府相對，互為表裡',
      '與貪狼相對，形成帝貪格',
      '與廉貞同宮，主權力鬥爭',
    ],
    fortuneAnalysis: '紫微在命宮主人一生貴氣，事業有成，但需要謹慎權力的運用。廟旺時吉利，陷時需要借助他人之力。',
  },
  天機: {
    name: '天機',
    category: 'main',
    brightness: '智星',
    description: '天機主智慧、變化、靈活。入命主人聰慧靈活、善於應變、思維敏捷。',
    characteristics: [
      '聰慧靈活',
      '善於應變',
      '思維敏捷',
      '多才多藝',
      '喜歡變化',
      '容易心浮氣躁',
    ],
    relationships: [
      '與太陰相對，主陰陽平衡',
      '與巨門同宮，主口舌是非',
      '與天梁同宮，主智慧與仁慈結合',
    ],
    fortuneAnalysis: '天機在命宮主人聰慧靈活，適合從事需要思考的工作。但需要穩定心性，避免過度變化。',
  },
  太陽: {
    name: '太陽',
    category: 'main',
    brightness: '光明星',
    description: '太陽主光明、熱情、積極。入命主人性格開朗、熱情洋溢、充滿朝氣。',
    characteristics: [
      '性格開朗',
      '熱情洋溢',
      '充滿朝氣',
      '樂於助人',
      '領導力強',
      '有時過於急躁',
    ],
    relationships: [
      '與太陰相對，形成日月同宮',
      '與廉貞同宮，主熱情與理性結合',
      '與天梁同宮，主光明與仁慈',
    ],
    fortuneAnalysis: '太陽在命宮主人一生光明磊落，事業有成。廟旺時吉利，陷時需要借助他人之力。',
  },
  武曲: {
    name: '武曲',
    category: 'main',
    brightness: '財星',
    description: '武曲主財富、果斷、執行力。入命主人財運亨通、做事果斷、執行力強。',
    characteristics: [
      '財運亨通',
      '做事果斷',
      '執行力強',
      '有魄力',
      '重視物質',
      '有時過於固執',
    ],
    relationships: [
      '與天府相對，形成武府格',
      '與貪狼同宮，主財富與慾望',
      '與七殺同宮，主權力與財富',
    ],
    fortuneAnalysis: '武曲在命宮主人財運亨通，適合從事商業或金融工作。廟旺時吉利，陷時需要謹慎理財。',
  },
  天同: {
    name: '天同',
    category: 'main',
    brightness: '福星',
    description: '天同主福氣、溫和、享樂。入命主人福氣深厚、性格溫和、生活舒適。',
    characteristics: [
      '福氣深厚',
      '性格溫和',
      '生活舒適',
      '樂天知命',
      '善於享受',
      '有時過於懶散',
    ],
    relationships: [
      '與廉貞相對，形成同廉格',
      '與太陽同宮，主福氣與光明',
      '與天梁同宮，主福氣與仁慈',
    ],
    fortuneAnalysis: '天同在命宮主人福氣深厚，生活舒適。但需要避免過度懶散，應該把握機會。',
  },
  廉貞: {
    name: '廉貞',
    category: 'main',
    brightness: '將星',
    description: '廉貞主廉潔、執著、鬥志。入命主人廉潔自好、執著堅定、鬥志旺盛。',
    characteristics: [
      '廉潔自好',
      '執著堅定',
      '鬥志旺盛',
      '有原則',
      '不易妥協',
      '有時過於固執',
    ],
    relationships: [
      '與天府相對，形成廉府格',
      '與貪狼同宮，主廉潔與慾望的鬥爭',
      '與七殺同宮，主廉潔與權力',
    ],
    fortuneAnalysis: '廉貞在命宮主人廉潔自好，事業有成。但需要避免過度固執，應該學會變通。',
  },
  天府: {
    name: '天府',
    category: 'main',
    brightness: '財星',
    description: '天府為南斗主星，象徵財富、穩定、保護。入命主人財運穩定、性格穩重、有保護力。',
    characteristics: [
      '財運穩定',
      '性格穩重',
      '有保護力',
      '善於理財',
      '有責任感',
      '有時過於保守',
    ],
    relationships: [
      '與紫微相對，互為表裡',
      '與武曲同宮，主財富與穩定',
      '與七殺同宮，主權力與財富',
    ],
    fortuneAnalysis: '天府在命宮主人財運穩定，適合從事財務或管理工作。廟旺時吉利，陷時需要謹慎理財。',
  },
  太陰: {
    name: '太陰',
    category: 'main',
    brightness: '柔星',
    description: '太陰主柔和、內斂、家庭。入命主人性格柔和、內斂深沉、重視家庭。',
    characteristics: [
      '性格柔和',
      '內斂深沉',
      '重視家庭',
      '善於理家',
      '感受力強',
      '有時過於敏感',
    ],
    relationships: [
      '與太陽相對，形成日月同宮',
      '與天機相對，主陰陽平衡',
      '與巨門同宮，主柔和與口才',
    ],
    fortuneAnalysis: '太陰在命宮主人性格柔和，適合從事文化或家庭相關工作。廟旺時吉利，陷時需要增強自信。',
  },
  貪狼: {
    name: '貪狼',
    category: 'main',
    brightness: '桃花星',
    description: '貪狼主慾望、多才、桃花。入命主人多才多藝、慾望強烈、人緣好。',
    characteristics: [
      '多才多藝',
      '慾望強烈',
      '人緣好',
      '能言善辯',
      '喜歡新鮮事物',
      '有時過於貪心',
    ],
    relationships: [
      '與紫微相對，形成帝貪格',
      '與廉貞同宮，主慾望與廉潔的鬥爭',
      '與天相同宮，主慾望與和諧',
    ],
    fortuneAnalysis: '貪狼在命宮主人多才多藝，人緣好。但需要避免過度貪心，應該學會知足。',
  },
  巨門: {
    name: '巨門',
    category: 'main',
    brightness: '暗星',
    description: '巨門主口才、是非、暗昧。入命主人口才好、善於言辭、但容易卷入是非。',
    characteristics: [
      '口才好',
      '善於言辭',
      '容易卷入是非',
      '思維深沉',
      '善於分析',
      '有時過於多言',
    ],
    relationships: [
      '與天機相對，主智慧與口才',
      '與太陰同宮，主柔和與口才',
      '與天相同宮，主口才與和諧',
    ],
    fortuneAnalysis: '巨門在命宮主人口才好，適合從事言論或溝通相關工作。但需要謹慎言行，避免是非。',
  },
  天相: {
    name: '天相',
    category: 'main',
    brightness: '輔星',
    description: '天相主和諧、輔助、人脈。入命主人性格和諧、善於輔助他人、人脈廣闊。',
    characteristics: [
      '性格和諧',
      '善於輔助他人',
      '人脈廣闊',
      '有親和力',
      '善於合作',
      '有時過於依賴他人',
    ],
    relationships: [
      '與廉貞同宮，主和諧與廉潔',
      '與貪狼同宮，主和諧與慾望',
      '與七殺同宮，主和諧與權力',
    ],
    fortuneAnalysis: '天相在命宮主人人脈廣闊，善於合作。適合從事需要人脈的工作。',
  },
  天梁: {
    name: '天梁',
    category: 'main',
    brightness: '壽星',
    description: '天梁主長壽、仁慈、智慧。入命主人長壽健康、仁慈善良、智慧高深。',
    characteristics: [
      '長壽健康',
      '仁慈善良',
      '智慧高深',
      '有耐心',
      '善於教導',
      '有時過於保守',
    ],
    relationships: [
      '與天機同宮，主智慧與仁慈',
      '與太陽同宮，主光明與仁慈',
      '與天同同宮，主福氣與仁慈',
    ],
    fortuneAnalysis: '天梁在命宮主人長壽健康，適合從事教育或社會服務工作。',
  },
  七殺: {
    name: '七殺',
    category: 'main',
    brightness: '將星',
    description: '七殺主權力、鬥志、衝動。入命主人權力慾強、鬥志旺盛、性格衝動。',
    characteristics: [
      '權力慾強',
      '鬥志旺盛',
      '性格衝動',
      '有魄力',
      '敢於冒險',
      '有時過於激進',
    ],
    relationships: [
      '與武曲同宮，主權力與財富',
      '與天府同宮，主權力與財富',
      '與廉貞同宮，主權力與廉潔',
    ],
    fortuneAnalysis: '七殺在命宮主人權力慾強，適合從事領導或軍事相關工作。但需要控制衝動。',
  },
  破軍: {
    name: '破軍',
    category: 'main',
    brightness: '戰星',
    description: '破軍主破壞、變革、重生。入命主人具有破壞性、喜歡變革、經歷波折後重生。',
    characteristics: [
      '具有破壞性',
      '喜歡變革',
      '經歷波折',
      '有重生力',
      '敢於創新',
      '有時過於激進',
    ],
    relationships: [
      '與貪狼相對，形成破貪格',
      '與廉貞同宮，主破壞與廉潔',
      '與天相同宮，主破壞與和諧',
    ],
    fortuneAnalysis: '破軍在命宮主人經歷波折，但有重生力。適合從事創新或改革相關工作。',
  },
  左輔: {
    name: '左輔',
    category: 'luck',
    brightness: '吉星',
    description: '左輔為吉星，主輔助、幫助、貴人。入命主人得貴人相助，事業順利。',
    characteristics: ['得貴人相助', '事業順利', '有人脈', '善於合作'],
    relationships: ['與右弼相對，形成左右護衛'],
    fortuneAnalysis: '左輔在命宮主人得貴人相助，事業順利。',
  },
  右弼: {
    name: '右弼',
    category: 'luck',
    brightness: '吉星',
    description: '右弼為吉星，主輔助、幫助、貴人。入命主人得貴人相助，事業順利。',
    characteristics: ['得貴人相助', '事業順利', '有人脈', '善於合作'],
    relationships: ['與左輔相對，形成左右護衛'],
    fortuneAnalysis: '右弼在命宮主人得貴人相助，事業順利。',
  },
  文昌: {
    name: '文昌',
    category: 'luck',
    brightness: '吉星',
    description: '文昌為吉星，主文化、學問、聰慧。入命主人聰慧好學，文化修養高。',
    characteristics: ['聰慧好學', '文化修養高', '善於表達', '有文采'],
    relationships: ['與文曲相對，形成文曲文昌'],
    fortuneAnalysis: '文昌在命宮主人聰慧好學，適合從事文化或教育工作。',
  },
  文曲: {
    name: '文曲',
    category: 'luck',
    brightness: '吉星',
    description: '文曲為吉星，主文化、藝術、才華。入命主人才華橫溢，藝術修養高。',
    characteristics: ['才華橫溢', '藝術修養高', '善於創作', '有靈感'],
    relationships: ['與文昌相對，形成文曲文昌'],
    fortuneAnalysis: '文曲在命宮主人才華橫溢，適合從事藝術或創意工作。',
  },
  祿存: {
    name: '祿存',
    category: 'luck',
    brightness: '吉星',
    description: '祿存為吉星，主財富、福氣、穩定。入命主人財運亨通，生活穩定。',
    characteristics: ['財運亨通', '生活穩定', '福氣深厚', '善於理財'],
    relationships: ['與天馬相對，形成祿馬交馳'],
    fortuneAnalysis: '祿存在命宮主人財運亨通，生活穩定。',
  },
  天馬: {
    name: '天馬',
    category: 'luck',
    brightness: '吉星',
    description: '天馬為吉星，主奔波、遠行、機遇。入命主人容易遠行，機遇多。',
    characteristics: ['容易遠行', '機遇多', '活力強', '善於把握機會'],
    relationships: ['與祿存相對，形成祿馬交馳'],
    fortuneAnalysis: '天馬在命宮主人容易遠行，機遇多。',
  },
  擎羊: {
    name: '擎羊',
    category: 'unluck',
    brightness: '煞星',
    description: '擎羊為煞星，主衝動、急躁、傷害。入命主人性格急躁，容易衝動傷人。',
    characteristics: ['性格急躁', '容易衝動', '容易傷人', '有時魯莽'],
    relationships: ['與陀羅相對，形成羊陀夾'],
    fortuneAnalysis: '擎羊在命宮主人性格急躁，需要控制脾氣。',
  },
  陀羅: {
    name: '陀羅',
    category: 'unluck',
    brightness: '煞星',
    description: '陀羅為煞星，主遲滯、阻礙、纏繞。入命主人做事遲滯，容易被纏繞。',
    characteristics: ['做事遲滯', '容易被纏繞', '有時懶散', '進展緩慢'],
    relationships: ['與擎羊相對，形成羊陀夾'],
    fortuneAnalysis: '陀羅在命宮主人做事遲滯，需要加強行動力。',
  },
  地空: {
    name: '地空',
    category: 'unluck',
    brightness: '煞星',
    description: '地空為煞星，主虛耗、空亡、損失。入命主人容易虛耗，損失錢財。',
    characteristics: ['容易虛耗', '損失錢財', '有時不切實際', '空想多'],
    relationships: ['與地劫相對，形成空劫夾'],
    fortuneAnalysis: '地空在命宮主人容易虛耗，需要謹慎理財。',
  },
  地劫: {
    name: '地劫',
    category: 'unluck',
    brightness: '煞星',
    description: '地劫為煞星，主劫奪、損失、災難。入命主人容易遭遇損失，需要謹慎。',
    characteristics: ['容易遭遇損失', '需要謹慎', '有時運氣不佳', '容易遭劫'],
    relationships: ['與地空相對，形成空劫夾'],
    fortuneAnalysis: '地劫在命宮主人容易遭遇損失，需要謹慎行動。',
  },
};

/**
 * 根據星曜名稱獲取詳細解說
 */
export function getStarDescription(starName: string): StarDescription | undefined {
  return STAR_DESCRIPTIONS[starName];
}

/**
 * 獲取所有星曜的簡短描述
 */
export function getStarBriefDescription(starName: string): string {
  const desc = STAR_DESCRIPTIONS[starName];
  return desc ? desc.description : '暫無描述';
}

/**
 * 獲取星曜的特性列表
 */
export function getStarCharacteristics(starName: string): string[] {
  const desc = STAR_DESCRIPTIONS[starName];
  return desc ? desc.characteristics : [];
}
