# Dr Foods

A food lifestyle platform for Nigerian households — AI-powered nutrition planning, verified dietitian consultations, raw food & grocery delivery via **Dr Foods Bank**, and a social food discovery feed.

A product of Entechnologue World. Launch market: Lagos, Nigeria.

## Repo structure

```
backend/    Express + TypeScript + Prisma + PostgreSQL API
frontend/   Next.js (App Router) PWA
```

## Getting started

### Backend

```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY, etc.
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev             # http://localhost:4000
```

### Frontend

```bash
cd frontend
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
npm run dev              # http://localhost:3000
```

See `backend/README.md` and `frontend/README.md` for details on each app.

## Current status

Foundation build: project structure, auth, and database schema for every product pillar (nutrition, Dr Foods Bank, dietitian marketplace, social feed, vendor storefronts, payments, admin) plus a full design system in both apps. The **Nutrition → Grocery** flow (health profile → AI meal plan → shopping list → cart → checkout → order tracking with preservation guide) is built end-to-end. Dietitian marketplace, social feed, vendor storefronts, live payments, video consultations, SMS OTP, and the admin dashboard are scaffolded (schema + thin routes/pages) for the next build pass.
