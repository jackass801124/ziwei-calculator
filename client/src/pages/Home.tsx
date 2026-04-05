/**
 * 紫微斗數排盤引擎 - 主頁面
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 整合輸入表單、命盤顯示、偵錯面板、Unit Tests
 */

import React, { useState, useCallback } from 'react';
import InputForm from '../components/InputForm';
import ZiWeiChart from '../components/ZiWeiChart';
import DebugPanel from '../components/DebugPanel';
import TestPanel from '../components/TestPanel';
import AIAnalysisPanel from '../components/AIAnalysisPanel';
import { generateChart, type ChartInput } from '../lib/engine';
import { type ChartResult } from '../lib/engine';

export default function Home() {
  const [chart, setChart] = useState<ChartResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [apiKeyError, setApiKeyError] = React.useState(!apiKey);

  React.useEffect(() => {
    if (!apiKey) {
      setApiKeyError(true);
    }
  }, [apiKey]);

  const handleSubmit = useCallback((input: ChartInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = generateChart(input);
      setChart(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '排盤計算發生錯誤');
      console.error('Chart generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* 頂部標題區 */}
      <header className="border-b border-[var(--border)] py-4 px-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="chart-title text-2xl tracking-[0.15em]">紫微斗數</h1>
            <p className="text-[0.65rem] text-[var(--muted-foreground)] mt-0.5 font-['Noto_Sans_TC']">
              排盤引擎 · 依《紫微斗數全書》演算法
            </p>
          </div>
          <div className="text-right">
            <div className="text-[0.6rem] text-[var(--muted-foreground)] font-['Noto_Sans_TC']">
              支援：主星 · 六吉 · 六煞 · 四化 · 廟旺利陷
            </div>
          </div>
        </div>
      </header>

      {/* 主內容區 */}
      <main className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          
          {/* 左側：輸入區 */}
          <aside>
            <div
              className="p-4 border border-[var(--border)] rounded-sm"
              style={{ background: 'var(--palace-bg)' }}
            >
              {/* 輸入表單標題 */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b gold-divider">
                <div className="w-0.5 h-4 bg-[var(--gold)]" />
                <h2 className="text-sm font-semibold text-[var(--gold)] font-['Noto_Serif_TC'] tracking-wider">
                  輸入生辰資料
                </h2>
              </div>

              <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

              {/* 說明文字 */}
              <div className="mt-4 pt-3 border-t border-[var(--border)]">
                <p className="text-[0.6rem] text-[var(--muted-foreground)] leading-relaxed font-['Noto_Sans_TC']">
                  本引擎依據《紫微斗數全書》演算法，所有星曜位置基於數學公式計算。
                  時辰以出生地當地時間為準，子時跨越午夜（23:00-00:59）。
                </p>
              </div>
            </div>

            {/* 圖例說明 */}
            <div
              className="mt-3 p-3 border border-[var(--border)] rounded-sm"
              style={{ background: 'var(--palace-bg)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-0.5 h-3 bg-[var(--gold)]" />
                <span className="text-xs text-[var(--gold)] font-['Noto_Serif_TC']">圖例說明</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[0.6rem] font-['Noto_Sans_TC']">
                <div className="flex items-center gap-1">
                  <span className="star-main text-xs">主星</span>
                  <span className="text-[var(--muted-foreground)]">十四主星</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="star-lucky">輔星</span>
                  <span className="text-[var(--muted-foreground)]">六吉星</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="star-unlucky">煞星</span>
                  <span className="text-[var(--muted-foreground)]">六煞星</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="sihua-badge sihua-lu">祿</span>
                  <span className="sihua-badge sihua-quan">權</span>
                  <span className="sihua-badge sihua-ke">科</span>
                  <span className="sihua-badge sihua-ji">忌</span>
                  <span className="text-[var(--muted-foreground)]">四化</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="strength-miao text-[0.6rem]">廟</span>
                  <span className="strength-wang text-[0.6rem]">旺</span>
                  <span className="strength-li text-[0.6rem]">利</span>
                  <span className="strength-xian text-[0.6rem]">陷</span>
                  <span className="text-[var(--muted-foreground)]">強弱</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[0.6rem] text-[var(--gold)] border border-[var(--gold)] px-0.5 rounded-sm">命</span>
                  <span className="text-[var(--muted-foreground)]">命宮標記</span>
                </div>
              </div>
            </div>
          </aside>

          {/* 右側：命盤區 */}
          <section>
            {error && (
              <div className="p-3 border border-red-500/50 rounded-sm bg-red-500/10 text-red-400 text-sm mb-4 font-['Noto_Sans_TC']">
                ⚠ {error}
              </div>
            )}

            {!chart && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-4xl text-[var(--gold)] opacity-30 mb-4">☯</div>
                <p className="text-[var(--muted-foreground)] text-sm font-['Noto_Serif_TC']">
                  請輸入生辰資料，點擊「立即排盤」
                </p>
                <p className="text-[var(--muted-foreground)] text-xs mt-2 font-['Noto_Sans_TC']">
                  或點擊「測試案例」載入 1991/11/24 19:30 驗證資料
                </p>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-[var(--gold)] text-sm font-['Noto_Serif_TC'] animate-pulse">
                  排盤計算中...
                </div>
              </div>
            )}

            {chart && !isLoading && (
              <>
                <ZiWeiChart chart={chart} />
                
                {/* AI 分析面板 */}
                <div className="mt-6">
                  <AIAnalysisPanel chart={chart} apiKey={apiKey} />
                </div>

                <DebugPanel chart={chart} />
                <TestPanel />
              </>
            )}
          </section>
        </div>

        {/* 底部：未排盤時的測試面板 */}
        {!chart && (
          <div className="mt-6">
            <TestPanel />
          </div>
        )}
      </main>

      {/* 頁尾 */}
      <footer className="border-t border-[var(--border)] py-3 px-4 mt-8">
        <div className="max-w-[1200px] mx-auto text-center text-[0.6rem] text-[var(--muted-foreground)] font-['Noto_Sans_TC']">
          紫微斗數排盤引擎 · 依《紫微斗數全書》演算法 · 僅供學術研究參考
        </div>
      </footer>
    </div>
  );
}
