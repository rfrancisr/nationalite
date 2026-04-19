import { describe, it, expect } from 'vitest'
import { getYesterdaysMissedIds, getStudiedTodayIds, getStrugglingIds, isMiddayAvailable, isEveningAvailable } from './daily-plan'
import { SM2_INITIAL_EASE } from './constants'
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
    answers: answers.map((a) => ({ ...a, chosen_answers: ['test'] })),
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

describe('getStrugglingIds', () => {
  it('returns empty when no progress', () => {
    expect(getStrugglingIds([])).toEqual([])
  })

  it('excludes cards at initial ease', () => {
    const progress = [makeProgress('q1', todayStr)]
    progress[0].ease_factor = SM2_INITIAL_EASE
    expect(getStrugglingIds(progress)).toEqual([])
  })

  it('returns IDs where ease_factor has dropped below initial', () => {
    const progress = [
      { ...makeProgress('q1', todayStr), ease_factor: SM2_INITIAL_EASE - 0.2 },
      { ...makeProgress('q2', todayStr), ease_factor: SM2_INITIAL_EASE },
      { ...makeProgress('q3', todayStr), ease_factor: SM2_INITIAL_EASE - 0.15 },
    ]
    const result = getStrugglingIds(progress)
    expect(result).toContain('q1')
    expect(result).toContain('q3')
    expect(result).not.toContain('q2')
  })
})

describe('isMiddayAvailable', () => {
  it('returns false before 11 AM', () => {
    expect(isMiddayAvailable(new Date('2024-06-15T10:59:00'))).toBe(false)
  })
  it('returns true at exactly 11 AM', () => {
    expect(isMiddayAvailable(new Date('2024-06-15T11:00:00'))).toBe(true)
  })
  it('returns true after 11 AM', () => {
    expect(isMiddayAvailable(new Date('2024-06-15T14:30:00'))).toBe(true)
  })
})

describe('isEveningAvailable', () => {
  it('returns false before 5 PM', () => {
    expect(isEveningAvailable(new Date('2024-06-15T16:59:00'))).toBe(false)
  })
  it('returns true at exactly 5 PM', () => {
    expect(isEveningAvailable(new Date('2024-06-15T17:00:00'))).toBe(true)
  })
  it('returns true after 5 PM', () => {
    expect(isEveningAvailable(new Date('2024-06-15T20:00:00'))).toBe(true)
  })
})
