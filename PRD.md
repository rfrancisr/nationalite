# Product Requirements Document
## US Citizenship Test Prep Web App

**Date:** 2026-04-18  
**Status:** Draft

---

## 1. Overview

A web application to help a user study for and pass the US naturalization civics test. The USCIS civics test consists of 128 official questions; the examiner asks up to 10, and the applicant must answer 6 correctly. This app simulates the official 20-question practice quiz format (pass = 12/20 correct), organizes all 128 questions into thematic categories, and provides flashcards with spaced repetition to maximize retention.

---

## 2. Goals

| # | Goal |
|---|------|
| G1 | Allow the user to browse and review all 128 official civics questions, organized by category |
| G2 | Provide a flashcard mode with spaced-repetition scheduling |
| G3 | Offer timed practice quizzes of 20 random questions (pass threshold: 12/20) |
| G4 | Track and visualize progress over time via a dashboard |
| G5 | Persist all data in the cloud so progress is available across devices |

---

## 3. Users

Single user (the applicant). No multi-user or admin roles required for v1.

---

## 4. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Backend / DB | Supabase (Postgres + Auth + Realtime) |
| State | Zustand (client state) + React Query (server state) |
| Deployment | Vercel |

---

## 5. Data Model

### 5.0 Question Source

All 128 official civics questions and their accepted answers must be parsed from the PDF file located in the `questions/` folder at the root of the repository. The PDF is the authoritative source; do not hardcode question data elsewhere. A one-time seed script (`scripts/seed-questions.ts`) should:

1. Read the PDF from `questions/` (the folder may contain one `.pdf` file).
2. Parse each question number, question text, and accepted answer(s).
3. Map each question to its category (see §5.2).
4. Upsert all rows into the `questions` table in Supabase.

If the PDF is updated, re-running the seed script should update the database without duplicating rows (upsert on `number`).

---

### 5.1 Questions (seeded, read-only)

```
questions
  id           uuid PK
  number       int (1–128)
  category_id  uuid FK
  question     text
  answers      text[]   -- one or more accepted answers
  hint         text?
```

### 5.2 Categories (seeded)

Eight official USCIS categories:

1. Principles of American Democracy
2. System of Government
3. Rights and Responsibilities
4. American History — Colonial Period & Independence
5. American History — 1800s
6. American History — Recent & World War II
7. American History — Other
8. Integrated Civics (Geography, Symbols, Holidays)

```
categories
  id    uuid PK
  name  text
  slug  text
  icon  text   -- emoji or lucide icon name
```

### 5.3 User Progress

```
user_progress
  id              uuid PK
  user_id         uuid FK
  question_id     uuid FK
  status          enum('new','learning','mastered')
  ease_factor     float   -- SM-2 spaced repetition
  interval_days   int
  next_review_at  timestamptz
  review_count    int
  correct_count   int
  updated_at      timestamptz
```

### 5.4 Quiz Sessions

```
quiz_sessions
  id           uuid PK
  user_id      uuid FK
  started_at   timestamptz
  finished_at  timestamptz?
  score        int?       -- correct answers out of 20
  passed       bool?
  answers      jsonb      -- array of {question_id, chosen_answer, correct}
```

---

## 6. Feature Specifications

### 6.1 Authentication

- Supabase Auth with Magic Link (email) — no password to remember.
- On first login, seed `user_progress` rows for all 128 questions with `status = 'new'`.

---

### 6.2 Home / Dashboard

**Route:** `/`

Displays a summary card for each section:

- **Overall progress ring** — % of questions with `status = 'mastered'`
- **Category breakdown** — mini progress bar per category (mastered / total)
- **Quiz history** — last 5 quiz scores, sparkline chart
- **Daily streak** — days in a row the user reviewed at least one flashcard
- **Due for review today** — count of cards whose `next_review_at <= now()`
- **Quick action buttons:** Start Flashcards · Take a Quiz

---

### 6.3 Browse Questions

**Route:** `/questions`

- List of all 128 questions, grouped by category accordion.
- Each row shows: question number, question text, status badge (New / Learning / Mastered).
- Clicking a row expands to show the accepted answer(s) and a "Mark as Mastered" toggle.
- Filter bar: filter by category, filter by status.
- Search: full-text search across question text.

---

### 6.4 Flashcard Mode

**Route:** `/flashcards`

**Session flow:**
1. User chooses a deck: *All cards*, *Due today*, or a specific category.
2. Cards are ordered by spaced-repetition schedule (overdue first).
3. Each card shows the **question** face-up. User taps/clicks to flip.
4. Revealed answer side shows the accepted answer(s).
5. User self-rates: `Again` · `Hard` · `Good` · `Easy`.
6. Rating updates `ease_factor`, `interval_days`, and `next_review_at` using the **SM-2 algorithm**.
7. Session ends when queue is empty; summary screen shows cards reviewed, time spent, new mastery count.

**SM-2 rules (simplified):**
- `Again` → interval = 1 day, ease -= 0.2 (min 1.3)
- `Hard` → interval × 1.2, ease -= 0.15
- `Good` → interval × ease_factor
- `Easy` → interval × ease_factor × 1.3, ease += 0.1

Card status thresholds:
- `new` → `learning` after first review
- `learning` → `mastered` after interval ≥ 21 days

---

### 6.5 Quiz Mode

**Route:** `/quiz`

**Rules:**
- 20 questions drawn at random from all 128 (no repeat within a session).
- One question shown at a time; no going back.
- For each question, user types a free-text answer **or** selects from 4 options (3 distractors generated from same category).
- Correct/incorrect feedback shown immediately after submission.
- Progress bar at top (e.g., "Question 7 of 20").
- **Pass threshold: 12 correct out of 20.**

**End screen:**
- Score (X / 20), pass/fail banner.
- Full answer review — every question with user's answer vs. correct answer.
- "Study missed questions" button → opens flashcard session pre-loaded with missed questions.
- "Try again" button.

Quiz session is saved to `quiz_sessions` in Supabase.

---

### 6.6 Category Detail

**Route:** `/categories/:slug`

- Category name, description, and question count.
- Progress ring for this category.
- List of all questions in the category (same row design as Browse).
- "Study this category" button → flashcard session filtered to category.

---

## 7. UI Design

| Token | Value |
|-------|-------|
| Primary color | Indigo-600 |
| Success | Green-500 |
| Warning | Amber-500 |
| Danger | Red-500 |
| Font | Inter (Google Fonts) |
| Border radius | 12px cards, 8px buttons |
| Motion | Framer Motion card flip (flashcards), fade transitions |

**Layout:**
- Responsive: mobile-first, 1-column on small screens, sidebar nav on md+.
- Bottom tab bar on mobile (Home · Browse · Flashcards · Quiz).
- Sidebar nav on desktop.

---

## 8. Engineering Principles

All contributors (human and AI) must follow these rules throughout the project:

### 8.1 KISS — Keep It Simple
- Prefer the simplest solution that meets the requirement. Do not over-engineer.
- No premature abstractions: if a pattern appears fewer than three times, keep it inline.
- Avoid adding features, configuration options, or flexibility that no current requirement asks for.
- If two approaches work equally well, pick the one a new developer can understand in under 60 seconds.

### 8.2 DRY — Don't Repeat Yourself
- Every piece of knowledge (a constant, a type, a calculation, a UI pattern) must have a single authoritative location.
- Extract a shared component, hook, utility, or constant the moment the same logic appears in two places.
- Shared types live in `src/types/`, shared utilities in `src/utils/`, shared UI primitives in `src/components/ui/`.

### 8.3 TDD — Test-Driven Development

All features must be built following the **Red → Green → Refactor** cycle:

1. **Red** — write a failing test that describes the desired behavior before writing any implementation code.
2. **Green** — write the minimum code needed to make the test pass. Nothing more.
3. **Refactor** — clean up the implementation (applying KISS and DRY) while keeping all tests green.

**Rules:**
- No feature code is merged unless it has passing tests covering its core logic.
- Every bug fix must begin with a test that reproduces the bug; only then write the fix.
- All tests must pass (`npm test -- --run`) before any `git commit`.
- The CI pipeline (GitHub Actions) must run the full test suite on every push; a failing pipeline blocks the milestone.

**Testing layers:**

| Layer | Tool | What to test |
|-------|------|-------------|
| Unit | Vitest | SM-2 algorithm, score calculation, question parser, utility functions |
| Component | Vitest + React Testing Library | Flashcard flip, quiz flow, progress bar rendering |
| Integration | Vitest + Supabase local emulator | Seed script, `user_progress` upsert, quiz session save |
| E2E (optional, M6) | Playwright | Full quiz pass/fail flow, flashcard session |

Test files live alongside source files: `src/utils/sm2.test.ts`, `src/components/Flashcard.test.tsx`, etc.

---

### 8.4 Additional Rules
- **Single responsibility:** each file, component, and function does one thing.
- **No dead code:** remove code that is no longer used rather than commenting it out.
- **Consistent naming:** `camelCase` for variables/functions, `PascalCase` for components/types, `kebab-case` for file names.
- **No magic numbers:** every numeric constant must be named (e.g., `PASS_THRESHOLD = 12`, `QUIZ_SIZE = 20`, `TOTAL_QUESTIONS = 128`).

---

## 9. Git Workflow

**Remote:** `https://github.com/rfrancisr/nationalite.git`  
**Default branch:** `main`

### Rules
1. **Commit after every meaningful change** — do not accumulate unrelated edits in a single commit.
2. **Push immediately after committing** — every commit must be pushed to `origin main` before moving to the next task.
3. **Commit message format:** `<type>: <short description>` where type is one of `feat`, `fix`, `refactor`, `style`, `chore`, `docs`.  
   Examples: `feat: add flashcard SM-2 scheduling`, `fix: quiz score off-by-one`, `chore: seed 128 questions from PDF`.
4. **Never force-push** to `main`.
5. **One logical change per commit** — a commit should be reviewable in isolation.

---

## 10. Non-Functional Requirements

| # | Requirement |
|---|-------------|
| NF1 | First load under 2 s on a 4G connection (Vite code-splitting per route) |
| NF2 | Flashcard flip animation under 300 ms |
| NF3 | Offline-capable for already-loaded question data (service worker cache) |
| NF4 | WCAG 2.1 AA accessibility (focus rings, aria-labels, sufficient contrast) |
| NF5 | Supabase row-level security: users can only read/write their own `user_progress` and `quiz_sessions` |

---

## 11. Out of Scope (v1)

- Multiple user accounts / family sharing
- Audio pronunciation / text-to-speech
- PDF/print export
- Push notifications
- Social features (leaderboard, sharing)
- N-100 (English reading/writing) section

---

## 12. Milestones

| Milestone | Deliverable |
|-----------|-------------|
| M1 | Supabase project + schema + 128 questions seeded |
| M2 | Auth + Browse Questions page |
| M3 | Flashcard mode with SM-2 |
| M4 | Quiz mode with scoring |
| M5 | Dashboard with progress charts |
| M6 | Polish, accessibility audit, deploy to Vercel |

---

## 13. Success Criteria

- User can review all 128 questions by category.
- User can complete a 20-question quiz and see pass/fail result.
- Spaced repetition correctly schedules cards; after 4 weeks of daily use, ≥ 80 questions reach "mastered."
- Progress persists across browser sessions and devices via Supabase.
