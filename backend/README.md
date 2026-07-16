# Dr Foods — Backend

Express + TypeScript + Prisma (PostgreSQL) API.

## Setup

```bash
cp .env.example .env   # fill in DATABASE_URL, JWT secrets, ANTHROPIC_API_KEY
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev              # http://localhost:4000
```

> **Note:** `prisma generate` / `migrate dev` download a platform-specific engine binary from Prisma's CDN on first run. If you're running this inside a network-restricted sandbox, run these two commands from a normal terminal with full internet access first — everything after that works offline against your local Postgres.

## Structure

- `src/modules/*` — one folder per domain (`auth`, `users`, `nutrition`, `bank` are fully built; `dietitians`, `feed`, `vendors`, `payments` are schema + thin routes, scaffolded for the next build pass)
- `prisma/schema.prisma` — full data model across all domains
- `prisma/seed.ts` + `prisma/seed-data/` — Nigerian food/nutrition dataset and Dr Foods Bank grocery catalog

## Key flows implemented end-to-end

- **Auth**: signup/login (email or phone), JWT access token + rotating refresh token (httpOnly cookie)
- **Nutrition → Grocery**: `POST /nutrition/plans/generate` calls Claude (grounded in the seeded Nigerian food dataset) to build a 7-day meal plan, auto-derives a costed shopping list, and `POST /nutrition/shopping-lists/:id/send-to-cart` pushes it into the Dr Foods Bank cart. `POST /bank/checkout` creates an order; `POST /bank/payments/:id/mock-confirm` simulates payment success (no live Paystack key needed for local testing — see `src/modules/payments/paystack.service.ts` for the real integration point).

## Environment variables

See `.env.example`. `ANTHROPIC_API_KEY` is required for meal plan generation; `PAYSTACK_SECRET_KEY` is only needed once you swap the mock payment confirm for live Paystack.
