# Testing ziwei-calculator

## Overview
Ziwei-calculator is a Zi Wei Dou Shu (紫微斗數) chart engine with a React/Vite frontend and Vercel Serverless Functions backend.

## Local Dev Setup
```bash
pnpm install
pnpm run dev  # Starts Vite dev server on http://localhost:3000
```

## Key Test Flows

### 1. Chart Generation (Core Feature)
- Open `http://localhost:3000`
- Click "測試案例" button to auto-fill test data (1991/11/24 19:30 male)
- Verify: Chart grid renders with 12 palaces and stars
- Verify: Debug panel shows `calendarValidation: true` (辛未年十月十九戌時)
- Also test with manual input to verify the form works independently

### 2. AI Analysis (`/api/analyze`)
- The AI analysis button ("開始 AI 分析") appears below the generated chart
- In **dev mode**: `/api/analyze` does not exist (no Vite proxy configured), so clicking the button will show an error — this is expected
- In **production (Vercel)**: The button calls the Vercel Serverless Function at `/api/analyze` which proxies to Gemini AI
- To fully test AI analysis, deploy to Vercel with `GEMINI_API_KEY` environment variable set

## Build & Type Check
```bash
pnpm run build   # Vite production build → dist/public/
pnpm run check   # TypeScript type checking (tsc --noEmit)
```

## Architecture Notes
- All Zi Wei Dou Shu calculation logic is **pure client-side** in `client/src/lib/` (engine.ts, calendar.ts, palace.ts, fiveElements.ts, stars.ts)
- The only backend logic is `/api/analyze.ts` (Gemini AI proxy)
- `vercel.json` handles SPA routing and API rewrites
- The old `server/` directory (Express) might still exist but is not used

## Devin Secrets Needed
- `GEMINI_API_KEY` — Only needed for testing AI analysis on Vercel (not needed for local chart generation testing)
