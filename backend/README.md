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

### Test account

`prisma:seed` creates (or upserts) a ready-to-use account with onboarding already complete, so you land straight in the app:

```
email:    test@gmail.com
password: Test123456789
```

Defined in `prisma/seed.ts` (`TEST_ACCOUNT`) — re-running the seed keeps it in sync, and it's created the same way in any environment you seed (local, staging, etc.).

## Structure

- `src/modules/*` — one folder per domain (`auth`, `users`, `nutrition`, `bank` are fully built; `feed` now includes real post creation with image upload; `dietitians`, `vendors`, `payments` are schema + thin routes, scaffolded for the next build pass)
- `prisma/schema.prisma` — full data model across all domains
- `prisma/seed.ts` + `prisma/seed-data/` — Nigerian food/nutrition dataset and Dr Foods Bank grocery catalog

## Key flows implemented end-to-end

- **Auth**: signup/login (email or phone), JWT access token + rotating refresh token (httpOnly cookie)
- **Nutrition → Grocery**: `POST /nutrition/plans/generate` calls Claude (grounded in the seeded Nigerian food dataset) to build a 7-day meal plan, auto-derives a costed shopping list, and `POST /nutrition/shopping-lists/:id/send-to-cart` pushes it into the Dr Foods Bank cart. `POST /bank/checkout` creates an order; `POST /bank/payments/:id/mock-confirm` simulates payment success (no live Paystack key needed for local testing — see `src/modules/payments/paystack.service.ts` for the real integration point).
- **Social feed — post creation**: `POST /feed/upload` (multipart, `image` field) stores a photo on local disk (`backend/uploads/feed/`, gitignored) and returns an absolute URL under `APP_URL`, served statically at `/uploads`. `POST /feed/posts` then creates the post with that URL, an optional caption, and an optional `foodItemId` tag. No external object storage (S3/Cloudinary) is wired up yet — swap `upload.middleware.ts`'s disk storage for a cloud adapter when you need multi-instance/production-scale hosting.

## Environment variables

See `.env.example`. `ANTHROPIC_API_KEY` is required for meal plan generation; `PAYSTACK_SECRET_KEY` is only needed once you swap the mock payment confirm for live Paystack.
