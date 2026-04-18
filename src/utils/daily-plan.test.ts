import { describe, it, expect } from 'vitest'
import { getYesterdaysMissedIds, getStudiedTodayIds } from './daily-plan'
import type { QuizSession, UserProgress } from '@/types'

const today = new Date('2024-06-15T12:00:00Z')
const todayStr = '2024-06-15'
const yesterdayStr = '2024-06-14'

function makeSession(date: string, answers: { question_id: string; correct: boolean }[]): QuizSession {
  return {
    id: `session-${date}`,
    user_id: 'user1',
    started_at: `${date}T08:00:00Z`,
    finished_at: `${date}T08:10:00Z`,
    score: answers.filter((a) => a.correct).length,
    passed: false,
    answers: answers.map((a) => ({ ...a, chosen_answer: 'test' })),
  }
}

function makeProgress(questionId: string, updatedAt: string, reviewCount = 1): UserProgress {
  return {
    id: `prog-${questionId}`,
    user_id: 'user1',
    question_id: questionId,
    status: 'learning',
    ease_factor: 2.5,
    interval_days: 1,
    next_review_at: `${updatedAt}T12:00:00Z`,
    review_count: reviewCount,
    correct_count: 0,
    updated_at: `${updatedAt}T10:00:00Z`,
  }
}

describe('getYesterdaysMissedIds', () => {
  it('returns empty array when no sessions', () => {
    expect(getYesterdaysMissedIds([], today)).toEqual([])
  })

  it('returns missed question IDs from yesterday', () => {
    const sessions = [
      makeSession(yesterdayStr, [
        { question_id: 'q1', correct: false },
        { question_id: 'q2', correct: true },
        { question_id: 'q3', correct: false },
      ]),
    ]
    const result = getYesterdaysMissedIds(sessions, today)
    expect(result).toContain('q1')
    expect(result).toContain('q3')
    expect(result).not.toContain('q2')
  })

  it('ignores sessions from other days', () => {
    const sessions = [
      makeSession('2024-06-13', [{ question_id: 'q1', correct: false }]),
      makeSession(todayStr, [{ question_id: 'q2', correct: false }]),
    ]
    expect(getYesterdaysMissedIds(sessions, today)).toEqual([])
  })

  it('deduplicates when same question missed in multiple sessions', () => {
    const sessions = [
      makeSession(yesterdayStr, [{ question_id: 'q1', correct: false }]),
      makeSession(yesterdayStr, [{ question_id: 'q1', correct: false }]),
    ]
    const result = getYesterdaysMissedIds(sessions, today)
    expect(result).toEqual(['q1'])
  })
})

describe('getStudiedTodayIds', () => {
  it('returns empty array when no progress', () => {
    expect(getStudiedTodayIds([], today)).toEqual([])
  })

  it('returns question IDs reviewed today', () => {
    const progress = [
      makeProgress('q1', todayStr, 1),
      makeProgress('q2', yesterdayStr, 1),
      makeProgress('q3', todayStr, 3),
    ]
    const result = getStudiedTodayIds(progress, today)
    expect(result).toContain('q1')
    expect(result).toContain('q3')
    expect(result).not.toContain('q2')
  })

  it('excludes cards with review_count = 0', () => {
    const progress = [makeProgress('q1', todayStr, 0)]
    expect(getStudiedTodayIds(progress, today)).toEqual([])
  })
})
