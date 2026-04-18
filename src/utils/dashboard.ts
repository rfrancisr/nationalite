import type { UserProgress, QuizSession } from '@/types'

export function countDueToday(progress: UserProgress[]): number {
  const now = new Date()
  return progress.filter((p) => new Date(p.next_review_at) <= now).length
}

export function calcStreak(
  progress: UserProgress[],
  sessions: QuizSession[],
  today = new Date(),
): number {
  const dates = new Set<string>()

  for (const p of progress) {
    if (p.review_count > 0) dates.add(p.updated_at.slice(0, 10))
  }
  for (const s of sessions) {
    if (s.finished_at) dates.add(s.finished_at.slice(0, 10))
  }

  // Use UTC noon to avoid DST boundary issues
  const cursor = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  if (!dates.has(cursor.toISOString().slice(0, 10))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  let streak = 0
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak++
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }
  return streak
}
