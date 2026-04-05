# 紫微斗數排盤引擎 — 設計理念

## 方案一：「玄墨書院」— 東方古典水墨風
<response>
<probability>0.08</probability>
<text>
**Design Movement**: 宋代書院美學 × 現代極簡主義
**Core Principles**: 
1. 以水墨灰階為主調，金色為點綴，呈現古籍質感
2. 字體採用仿宋體搭配細明體，模擬古籍排版
3. 宮格以毛筆線條感的細邊框呈現，非現代圓角
4. 資訊密度高但呼吸感足，留白如宣紙空白處

**Color Philosophy**: 宣紙米白(#F5F0E8)為底，玄色(#1A1A2E)為主文，硃砂紅(#C0392B)標示凶星，金箔色(#D4A017)標示吉星，青花藍(#2E4057)為宮格邊框

**Layout Paradigm**: 命盤佔據頁面中心，左側為輸入面板，右側為解讀說明，採不對稱三欄式

**Signature Elements**: 
1. 宮格邊框使用雙線（外粗內細）模擬古籍格線
2. 星曜名稱使用繁體楷書字體，廟旺利陷以顏色深淺表示
3. 中宮設計如古籍封面，有裝飾性邊框

**Interaction Philosophy**: 滑鼠懸停時宮格微微發光，如燈籠照亮；點擊宮格展開詳細解讀

**Animation**: 命盤生成時如翻開古籍，從中宮向外展開；星曜出現時有淡入效果

**Typography System**: 標題使用 Noto Serif TC 粗體，宮格內容使用 Noto Serif TC 常規，說明文字使用 Noto Sans TC
</text>
</response>

## 方案二：「星象儀」— 天文科學風
<response>
<probability>0.07</probability>
<text>
**Design Movement**: 天文儀器美學 × 賽博朋克暗色調
**Core Principles**: 
1. 深宇宙黑為底，星光藍白為主色調
2. 宮格如星象儀刻度盤，精密感強
3. 數據可視化優先，每個計算步驟都可見
4. 偵錯模式與正式模式可切換

**Color Philosophy**: 深空黑(#0A0E1A)為底，星光白(#E8F4FD)為主文，天藍(#4FC3F7)為高亮，金星黃(#FFD54F)為特殊標記，紅矮星紅(#EF5350)為凶星

**Layout Paradigm**: 全螢幕沉浸式，命盤置中如星象儀，四周有軌道感的裝飾圓環

**Signature Elements**: 
1. 宮格邊框有細微的發光效果
2. 星曜名稱旁有亮度指示條（廟旺利陷）
3. 計算過程在右側面板實時顯示

**Interaction Philosophy**: 懸停時顯示星曜詳細資訊的浮動卡片；點擊宮格時有漣漪效果

**Animation**: 頁面載入時有星空旋轉動畫；命盤生成時星曜逐一出現如星星點亮

**Typography System**: 標題使用 Space Grotesk，宮格內容使用 Noto Serif TC，數字使用 JetBrains Mono
</text>
</response>

## 方案三：「紫微正典」— 傳統命理典籍風（選定）
<response>
<probability>0.09</probability>
<text>
**Design Movement**: 明清典籍排版 × 現代資訊設計
**Core Principles**: 
1. 深硃砂紅為主色，象徵命理的莊重與神秘
2. 命盤採用傳統方格排列，但加入現代排版的呼吸感
3. 資訊層次清晰：主星 > 輔星 > 四化 > 廟旺
4. 偵錯模式在底部展開，不干擾主視覺

**Color Philosophy**: 
- 背景：深墨色(#1C1410)
- 主文：暖米白(#F2E8D5)
- 宮格背景：深棕(#2A1F14)
- 主星：金色(#E8C56A)
- 吉星：天青(#7BC8D4)
- 凶星：硃砂紅(#C94040)
- 四化標籤：各有專屬色

**Layout Paradigm**: 
- 頁面頂部：輸入區（橫向排列，緊湊）
- 頁面中央：4x4 命盤（佔最大面積）
- 頁面底部：偵錯資訊（可摺疊）
- 右側浮動：宮位詳解面板

**Signature Elements**: 
1. 宮格邊框使用金色細線，中宮有特殊裝飾框
2. 廟旺利陷以顏色標示：廟(金)、旺(青)、利(白)、陷(灰暗)
3. 四化標籤為小型彩色徽章

**Interaction Philosophy**: 點擊宮格展開右側詳解；懸停時宮格邊框發光

**Animation**: 命盤生成時從中宮向外波紋展開；星曜淡入

**Typography System**: 
- 標題：Noto Serif TC 粗體
- 宮格主星：Noto Serif TC 中等
- 輔助資訊：Noto Sans TC 細體
- 數字/代碼：JetBrains Mono
</text>
</response>

---

## 選定方案：「紫微正典」

採用方案三「紫微正典」風格，以深墨色底搭配金色主星、傳統方格命盤佈局，呈現莊重典雅的命理典籍美感，同時保持現代資訊設計的可讀性。
