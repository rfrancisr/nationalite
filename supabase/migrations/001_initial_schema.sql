-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── categories ────────────────────────────────────────────────────────────────
create table if not exists categories (
  id   uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null
);

-- ─── questions ─────────────────────────────────────────────────────────────────
create table if not exists questions (
  id          uuid primary key default gen_random_uuid(),
  number      int  not null unique check (number between 1 and 128),
  category_id uuid not null references categories(id),
  question    text not null,
  answers     text[] not null,
  hint        text
);

-- ─── user_progress ─────────────────────────────────────────────────────────────
create type card_status as enum ('new', 'learning', 'mastered');

create table if not exists user_progress (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  question_id    uuid not null references questions(id),
  status         card_status not null default 'new',
  ease_factor    float not null default 2.5,
  interval_days  int   not null default 1,
  next_review_at timestamptz not null default now(),
  review_count   int   not null default 0,
  correct_count  int   not null default 0,
  updated_at     timestamptz not null default now(),
  unique (user_id, question_id)
);

-- ─── quiz_sessions ──────────────────────────────────────────────────────────────
create table if not exists quiz_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  score       int  check (score between 0 and 20),
  passed      bool,
  answers     jsonb not null default '[]'
);

-- ─── Row-Level Security ─────────────────────────────────────────────────────────
alter table user_progress  enable row level security;
alter table quiz_sessions  enable row level security;

create policy "users manage own progress"
  on user_progress for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own quiz sessions"
  on quiz_sessions for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- questions and categories are public read-only
alter table questions  enable row level security;
alter table categories enable row level security;

create policy "questions are public"
  on questions for select using (true);

create policy "categories are public"
  on categories for select using (true);
