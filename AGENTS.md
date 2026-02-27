# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

Epoch is a React + TypeScript single-page time-tracking app built with Vite. Users manage weekly time blocks with clock-in/out support. All data is persisted to `localStorage` — there is no backend or API.

## Commands

- `npm run dev` — Start Vite dev server on http://localhost:5173
- `npm run build` — Production build to `dist/`
- `npm run lint` — ESLint (currently configured for `.js/.jsx` only; `.tsx` files are not linted)
- `npm run preview` — Serve the production build locally
- `npx tsc --noEmit` — Type-check (no dedicated script in package.json)

There is no test framework configured. No test runner or test files exist.

## Architecture

### Data flow

All state lives in `TimeTracker` (the sole top-level component) via `useState`. There is no Context, Redux, or router. `TimeTracker` owns the week data and clock state, passes slices down as props, and handles all mutations through callbacks to the storage layer.

### Storage layer (`src/utils/storage.ts`)

localStorage is the only persistence mechanism. Two keys are used:
- `epoch_time_data` — All time block data, keyed by week-start date string (YYYY-MM-DD via `toLocaleDateString('en-CA')`)
- `epoch_clock_state` — Current clock-in/out state (`ClockState`)

CRUD functions (`addTimeBlock`, `removeTimeBlock`, `updateTimeBlock`, `clockIn`, `clockOut`) read-modify-write localStorage directly and return the updated `WeekData` so the caller can `setState`.

### Types (`src/types/index.ts`)

`TimeBlock` is the core entity. A block with `isActive: true` and no `endTime` represents an open clock-in session. `WeekData` is `{ [dayIndex: number]: TimeBlock[] }` — indexed 0–6 for Mon–Sun.

### Components

- **TimeTracker** — Orchestrator: week navigation, day rendering, form toggling, clock-in/out delegation.
- **TimeBlock** — Display-only component for a single block; edit/remove via callbacks.
- **TimeBlockForm** — Modal form for add/edit; validates start < end.
- **ClockInOut** — Renders clock-in/out button only for today's column.

### Styling

Plain CSS files co-located with each component (`ComponentName.css`). No CSS modules or preprocessors.

### Date handling (`src/utils/dateUtils.ts`)

Weeks start on Monday. Time durations are calculated in minutes using dummy date strings (`2000-01-01T{time}`). The `isToday` and `isFutureDate` helpers reset to start-of-day for comparison.

## Notable quirks

- The package is named `chronos` in `package.json` but branded as "Epoch" in the UI and README.
- ESLint config targets `.js/.jsx` files but the source is `.tsx` — linting effectively doesn't run on source files.
- Block IDs are generated with `Date.now() + Math.random().toString(36)` — not UUIDs.
- The 40-hour weekly target is hardcoded in `TimeTracker.tsx`.
