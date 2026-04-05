/**
 * 輸入表單元件 (Input Form Component)
 * 設計風格：紫微正典 — 深墨色底搭配金色主星
 *
 * 收集出生年月日時與性別，觸發排盤計算
 */

import React, { useState } from 'react';
import type { ChartInput } from '../lib/engine';

interface InputFormProps {
  onSubmit: (input: ChartInput) => void;
  isLoading?: boolean;
}

const HOURS = [
  { label: '子時 (23:00-00:59)', value: 23 },
  { label: '丑時 (01:00-02:59)', value: 1 },
  { label: '寅時 (03:00-04:59)', value: 3 },
  { label: '卯時 (05:00-06:59)', value: 5 },
  { label: '辰時 (07:00-08:59)', value: 7 },
  { label: '巳時 (09:00-10:59)', value: 9 },
  { label: '午時 (11:00-12:59)', value: 11 },
  { label: '未時 (13:00-14:59)', value: 13 },
  { label: '申時 (15:00-16:59)', value: 15 },
  { label: '酉時 (17:00-18:59)', value: 17 },
  { label: '戌時 (19:00-20:59)', value: 19 },
  { label: '亥時 (21:00-22:59)', value: 21 },
];

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [year, setYear] = useState<number | ''>('');
  const [month, setMonth] = useState<number | ''>('');
  const [day, setDay] = useState<number | ''>('');
  const [hour, setHour] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (year === '' || month === '' || day === '' || hour === '') {
      alert('請填入完整的生辰資料');
      return;
    }
    onSubmit({ year, month, day, hour, minute: 0, gender });
  };

  const handleQuickTest = () => {
    setYear(1991);
    setMonth(11);
    setDay(24);
    setHour(19);
    setGender('male');
    onSubmit({ year: 1991, month: 11, day: 24, hour: 19, minute: 0, gender: 'male' });
  };

  const inputClass = `
    w-full px-2 py-1.5 text-sm rounded-sm
    bg-[var(--input)] border border-[var(--border)]
    text-[var(--foreground)]
    focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]
    transition-colors font-['Noto_Sans_TC']
  `;

  const labelClass = "text-xs text-[var(--muted-foreground)] mb-1 block font-['Noto_Sans_TC']";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {/* 年 */}
        <div>
          <label className={labelClass}>出生年（西元）</label>
          <input
            type="number"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            min={1900}
            max={2100}
            className={inputClass}
          />
        </div>
        {/* 月 */}
        <div>
          <label className={labelClass}>出生月</label>
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className={inputClass}
          >
            <option value="">-- 選擇月份 --</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m} 月</option>
            ))}
          </select>
        </div>
        {/* 日 */}
        <div>
          <label className={labelClass}>出生日</label>
          <select
            value={day}
            onChange={e => setDay(Number(e.target.value))}
            className={inputClass}
          >
            <option value="">-- 選擇日期 --</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d} 日</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* 時辰 */}
        <div>
          <label className={labelClass}>出生時辰</label>
          <select
            value={hour}
            onChange={e => setHour(Number(e.target.value))}
            className={inputClass}
          >
            <option value="">-- 選擇時辰 --</option>
            {HOURS.map(h => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </div>
        {/* 性別 */}
        <div>
          <label className={labelClass}>性別</label>
          <div className="flex gap-3 mt-2">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
                className="accent-[var(--gold)]"
              />
              <span className="text-sm text-[var(--foreground)] font-['Noto_Sans_TC']">男命</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
                className="accent-[var(--gold)]"
              />
              <span className="text-sm text-[var(--foreground)] font-['Noto_Sans_TC']">女命</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 text-sm font-semibold rounded-sm transition-all
            bg-[var(--gold)] text-[var(--background)]
            hover:bg-[var(--gold-light)] active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            font-['Noto_Serif_TC'] tracking-wider"
        >
          {isLoading ? '排盤中...' : '立即排盤'}
        </button>
        <button
          type="button"
          onClick={handleQuickTest}
          className="px-3 py-2 text-xs rounded-sm transition-all
            border border-[var(--border)] text-[var(--muted-foreground)]
            hover:border-[var(--gold)] hover:text-[var(--gold)]
            font-['Noto_Sans_TC']"
          title="載入測試案例：1991/11/24 19:30 男"
        >
          測試案例
        </button>
      </div>
    </form>
  );
}
