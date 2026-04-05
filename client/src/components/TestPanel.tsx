/**
 * 測試面板元件 (Test Panel Component)
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 顯示 Unit Tests 執行結果
 */

import React, { useState } from 'react';
import { runAllTests } from '../lib/tests';

export default function TestPanel() {
  const [results, setResults] = useState<ReturnType<typeof runAllTests> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleRunTests = () => {
    const suite = runAllTests();
    setResults(suite);
    setIsOpen(true);
  };

  return (
    <div className="mt-4 max-w-[680px] mx-auto">
      <button
        onClick={handleRunTests}
        className="w-full flex items-center justify-between px-3 py-2 border border-[var(--border)] rounded-sm text-xs text-[var(--muted-foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors font-['Noto_Sans_TC']"
      >
        <span>🧪 Unit Tests（測試案例驗證）</span>
        <span>{results ? `${results.passedTests}/${results.totalTests} 通過` : '點擊執行'}</span>
      </button>

      {isOpen && results && (
        <div
          className="mt-1 p-3 border border-[var(--border)] rounded-sm text-xs font-['JetBrains_Mono'] space-y-1"
          style={{ background: 'oklch(0.10 0.01 45)' }}
        >
          {/* 摘要 */}
          <div className="flex items-center gap-3 mb-2 pb-2 border-b border-[var(--border)]">
            <span className={results.failedTests === 0 ? 'text-green-400' : 'text-yellow-400'}>
              {results.failedTests === 0 ? '✅ 全部通過' : `⚠️ ${results.failedTests} 項失敗`}
            </span>
            <span className="text-[var(--muted-foreground)]">
              {results.passedTests}/{results.totalTests} 測試通過
            </span>
          </div>

          {/* 測試結果列表 */}
          {results.results.map((r, i) => (
            <div key={i} className={`flex items-start gap-2 py-0.5 ${r.passed ? 'text-green-400' : 'text-red-400'}`}>
              <span>{r.passed ? '✓' : '✗'}</span>
              <div className="flex-1">
                <span className="text-[var(--foreground)]">{r.name}</span>
                {!r.passed && (
                  <div className="ml-2 text-[0.65rem]">
                    <span className="text-[var(--muted-foreground)]">期望：</span>
                    <span className="text-green-400">{r.expected}</span>
                    <span className="text-[var(--muted-foreground)] ml-2">實際：</span>
                    <span className="text-red-400">{r.actual}</span>
                  </div>
                )}
                {r.detail && (
                  <div className="ml-2 text-[0.6rem] text-[var(--muted-foreground)]">{r.detail}</div>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors"
          >
            收起
          </button>
        </div>
      )}
    </div>
  );
}
