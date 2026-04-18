import { describe, it, expect } from 'vitest'
import { calcStreak, countDueToday } from './dashboard'
import type { UserProgress, QuizSession } from '@/types'

function makeProgress(id: string, updatedAt: string, reviewCount = 1, nextReviewAt = ''): UserProgress {
  return {
    id, user_id: 'u1', question_id: `q${id}`,
    status: 'learning', ease_factor: 2.5, interval_days: 1,
    next_review_at: nextReviewAt, review_count: reviewCount, correct_count: 0,
    updated_at: updatedAt,
  }
}

function makeSession(id: string, finishedAt: string): QuizSession {
  return { id, user_id: 'u1', started_at: finishedAt, finished_at: finishedAt, score: 15, passed: true, answers: [] }
}

describe('countDueToday', () => {
  it('returns 0 for empty input', () => {
    expect(countDueToday([], [])).toBe(0)
  })

  it('counts cards with next_review_at in the past', () => {
    const past = new Date(Date.now() - 86_400_000).toISOString()
    const future = new Date(Date.now() + 86_400_000).toISOString()
    const progress = [
      makeProgress('1', '', 1, past),
      makeProgress('2', '', 1, past),
      makeProgress('3', '', 1, future),
    ]
    expect(countDueToday(progress, ['q1', 'q2', 'q3'])).toBe(2)
  })

  it('returns 0 when all cards are in the future', () => {
    const future = new Date(Date.now() + 86_400_000).toISOString()
    expect(countDueToday([makeProgress('1', '', 1, future)], ['q1'])).toBe(0)
  })

  it('counts questions with no progress record as due', () => {
    const future = new Date(Date.now() + 86_400_000).toISOString()
    const progress = [makeProgress('1', '', 1, future)]
    // q1 has a future review, q2 has no record — q2 should count as due
    expect(countDueToday(progress, ['q1', 'q2'])).toBe(1)
  })

  it('counts both overdue and new (no record) questions', () => {
    const past = new Date(Date.now() - 86_400_000).toISOString()
    const progress = [makeProgress('1', '', 1, past)]
    // q1 is overdue, q2 has no record
    expect(countDueToday(progress, ['q1', 'q2'])).toBe(2)
  })
})

describe('calcStreak', () => {
  it('returns 0 with no data', () => {
    expect(calcStreak([], [], new Date('2024-01-10'))).toBe(0)
  })

  it('returns 1 for activity today only', () => {
    const progress = [makeProgress('1', '2024-01-10T10:00:00Z')]
    expect(calcStreak(progress, [], new Date('2024-01-10'))).toBe(1)
  })

  it('returns 2 for activity today and yesterday', () => {
    const progress = [
      makeProgress('1', '2024-01-10T10:00:00Z'),
      makeProgress('2', '2024-01-09T10:00:00Z'),
    ]
    expect(calcStreak(progress, [], new Date('2024-01-10'))).toBe(2)
  })

  it('does not count a gap day', () => {
    const progress = [
      makeProgress('1', '2024-01-10T10:00:00Z'),
      makeProgress('2', '2024-01-08T10:00:00Z'), // Jan 9 skipped
    ]
    expect(calcStreak(progress, [], new Date('2024-01-10'))).toBe(1)
  })

  it('counts streak starting from yesterday when today has no activity', () => {
    const progress = [
      makeProgress('1', '2024-01-09T10:00:00Z'),
      makeProgress('2', '2024-01-08T10:00:00Z'),
    ]
    expect(calcStreak(progress, [], new Date('2024-01-10'))).toBe(2)
  })

  it('includes quiz session dates in streak calculation', () => {
    const sessions = [makeSession('s1', '2024-01-10T10:00:00Z')]
    expect(calcStreak([], sessions, new Date('2024-01-10'))).toBe(1)
  })

  it('ignores progress with review_count of 0', () => {
    const progress = [makeProgress('1', '2024-01-10T10:00:00Z', 0)]
    expect(calcStreak(progress, [], new Date('2024-01-10'))).toBe(0)
  })
})
