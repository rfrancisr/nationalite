# CLAUDE.md — US Citizenship Test Prep App

This file is the single source of truth for how Claude Code should build and maintain this project. Read it fully before making any change.

---

## Project Goal

Build a web app that helps one person study for and pass the US naturalization civics test. Full spec: [PRD.md](./PRD.md).

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Frontend | React 18 + Vite |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Backend / DB | Supabase (Postgres + Auth) |
| Client state | Zustand |
| Server state | React Query (TanStack Query v5) |
| Testing | Vitest + React Testing Library |
| E2E (M6) | Playwright |
| Deployment | Vercel |

---

## Repository

```
git remote add origin https://github.com/rfrancisr/nationalite.git
```

Default branch: `main`

---

## Project Structure

```
/
├── questions/          ← PDF source file (authoritative, do not edit)
├── scripts/
│   └── seed-questions.ts   ← parses PDF, upserts into Supabase
├── src/
│   ├── components/
│   │   └── ui/         ← shared primitive components only
│   ├── hooks/          ← shared custom hooks
│   ├── pages/          ← one file per route
│   ├── stores/         ← Zustand stores
│   ├── types/          ← shared TypeScript types
│   └── utils/          ← pure utility functions (each with a .test.ts)
├── supabase/
│   └── migrations/     ← SQL migration files
├── CLAUDE.md
└── PRD.md
```

---

## Named Constants (never use raw numbers)

```ts
// src/utils/constants.ts
export const TOTAL_QUESTIONS = 128;
export const QUIZ_SIZE       = 20;
export const PASS_THRESHOLD  = 12;
export const MASTERED_INTERVAL_DAYS = 21;
export const SM2_MIN_EASE    = 1.3;
```

---

## Question Data Source

- **Source of truth:** the single PDF in `questions/`.
- **Never hardcode** question text or answers in TypeScript/JSON.
- Run `npx tsx scripts/seed-questions.ts` to parse and upsert all 128 questions.
- Upsert on `number` field — safe to re-run after PDF updates.

---

## Database Schema (Supabase)

```sql
-- categories (seeded)
id uuid PK, name text, slug text, icon text

-- questions (seeded, read-only at runtime)
id uuid PK, number int UNIQUE, category_id uuid FK,
question text, answers text[], hint text

-- user_progress
id uuid PK, user_id uuid FK, question_id uuid FK,
status text CHECK IN ('new','learning','mastered'),
ease_factor float, interval_days int,
next_review_at timestamptz, review_count int,
correct_count int, updated_at timestamptz

-- quiz_sessions
id uuid PK, user_id uuid FK,
started_at timestamptz, finished_at timestamptz,
score int, passed bool,
answers jsonb  -- [{question_id, chosen_answer, correct}]
```

Row-level security: users access only their own `user_progress` and `quiz_sessions` rows.

---

## SM-2 Algorithm

Implemented in `src/utils/sm2.ts` (pure function, fully unit-tested).

| Rating | interval | ease_factor delta |
|--------|----------|-------------------|
| Again  | 1 day    | −0.20 (min 1.3)   |
| Hard   | × 1.2    | −0.15             |
| Good   | × ease   | 0                 |
| Easy   | × ease × 1.3 | +0.10         |

Status promotion: `new → learning` on first review; `learning → mastered` when `interval_days >= 21`.

---

## Routes

| Path | Page |
|------|------|
| `/` | Dashboard |
| `/questions` | Browse all 128 questions |
| `/categories/:slug` | Category detail |
| `/flashcards` | Flashcard session |
| `/quiz` | Quiz (20 questions, pass = 12/20) |

---

## Engineering Rules

### KISS
- Simplest solution that satisfies the requirement. No extra flexibility.
- Inline logic until it appears in 3+ places, then extract.

### DRY
- One authoritative location for every constant, type, and utility.
- Shared UI → `src/components/ui/`. Shared logic → `src/utils/`. Shared types → `src/types/`.

### General
- One responsibility per file, component, and function.
- No dead code — delete it, don't comment it out.
- Naming: `camelCase` variables/functions, `PascalCase` components/types, `kebab-case` filenames.
- No magic numbers — use constants from `src/utils/constants.ts`.

---

## Test-Driven Development (TDD)

**Mandatory cycle for every feature and bug fix:**

```
1. RED   — write a failing test describing the behavior
2. GREEN — write the minimum code to pass the test
3. REFACTOR — clean up while keeping all tests green
```

**Rules:**
- Write the test **before** the implementation, always.
- Every bug fix starts with a test that reproduces the bug.
- Run `npm test -- --run` and confirm all tests pass **before every `git commit`**.
- A commit that breaks the test suite must not be pushed.

**Testing layers:**

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | `src/utils/*.ts` — SM-2, score calc, PDF parser, constants |
| Component | Vitest + RTL | Flashcard flip, quiz progression, progress bars |
| Integration | Vitest + Supabase local | Seed script, DB upserts, RLS policies |
| E2E (M6) | Playwright | Full quiz flow, flashcard session, auth |

Test files live next to their source: `sm2.ts` → `sm2.test.ts`.

---

## Git Workflow

```
# after every meaningful change:
npm test -- --run          # all tests must pass
git add <specific files>
git commit -m "<type>: <description>"
git push origin main
```

**Commit types:** `feat` · `fix` · `refactor` · `style` · `chore` · `docs`

**Rules:**
- One logical change per commit.
- Push immediately after every commit — never accumulate.
- Never `--force` push to `main`.
- Never `--no-verify` to skip hooks.

---

## Build Order (Milestones)

| # | Milestone | Key deliverable |
|---|-----------|-----------------|
| M1 | Foundation | Vite scaffold, Supabase schema, seed script, 128 questions loaded |
| M2 | Browse | Auth (magic link) + Browse Questions page + category pages |
| M3 | Flashcards | Flashcard mode with SM-2 scheduling |
| M4 | Quiz | Quiz mode, scoring, pass/fail screen |
| M5 | Dashboard | Progress ring, category breakdown, quiz history |
| M6 | Polish | Accessibility audit, E2E tests, Vercel deploy |

Complete milestones in order. Do not start M(n+1) until all tests for M(n) are green and pushed.
