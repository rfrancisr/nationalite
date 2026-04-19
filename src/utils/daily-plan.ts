import type { UserProgress, QuizSession } from '@/types'
import { SM2_INITIAL_EASE } from './constants'

export function getYesterdaysMissedIds(sessions: QuizSession[], today = new Date()): string[] {
  const yesterday = new Date(today)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  const missed = new Set<string>()
  for (const s of sessions) {
    const sessionDate = (s.finished_at ?? s.started_at).slice(0, 10)
    if (sessionDate === yesterdayStr) {
      for (const a of s.answers) {
        if (!a.correct) missed.add(a.question_id)
      }
    }
  }
  return [...missed]
}

export function getStudiedTodayIds(progress: UserProgress[], today = new Date()): string[] {
  const todayStr = today.toISOString().slice(0, 10)
  return progress
    .filter((p) => p.review_count > 0 && p.updated_at.slice(0, 10) === todayStr)
    .map((p) => p.question_id)
}

export function getStrugglingIds(progress: UserProgress[]): string[] {
  return progress
    .filter((p) => p.ease_factor < SM2_INITIAL_EASE)
    .map((p) => p.question_id)
}

export function isMiddayAvailable(now = new Date()): boolean {
  return now.getHours() >= 11
}

export function isEveningAvailable(now = new Date()): boolean {
  return now.getHours() >= 17
}
