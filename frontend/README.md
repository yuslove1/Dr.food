# Dr Foods — Frontend

Next.js (App Router) PWA. Talks to the backend API in `../backend`.

## Setup

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL (defaults to http://localhost:4000)
npm install
npm run dev                    # http://localhost:3000
```

> Service worker / offline caching (Serwist) is disabled in dev and only active in production builds. `npm run build` runs Turbopack in webpack mode (`next build --webpack`) because Serwist's precache-injection plugin is webpack-based — see `next.config.ts`.

## Structure

- `src/app/(auth)` — login / signup
- `src/app/(main)` — authenticated app shell (bottom nav + header) wrapping `onboarding`, `nutrition`, `bank`, `feed`, `dietitians`, `profile`
- `src/components/ui` — hand-written shadcn/ui-style primitives (Radix UI + Tailwind, no CLI dependency)
- `src/lib` — API client (`api.ts`), auth context, token store, `cn`/formatting utils

## Design system

- Colors: brand green `#1B7A4A` (primary), warm terracotta `#E8793A` (accent) — see CSS variables in `src/app/globals.css`
- Type: Plus Jakarta Sans (display/headings) + Inter (body), loaded via `next/font`
- Icons: [Lucide](https://lucide.dev) for all functional UI icons
