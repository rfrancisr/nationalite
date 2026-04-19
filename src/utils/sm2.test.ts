import { describe, it, expect } from 'vitest'
import { applyRating } from './sm2'
import { SM2_MIN_EASE, SM2_INITIAL_EASE, MASTERED_INTERVAL_DAYS } from './constants'

const base = {
  ease_factor: SM2_INITIAL_EASE,
  interval_days: 1,
  status: 'learning' as const,
}

describe('applyRating', () => {
  it('Again resets interval to 1 and decreases ease', () => {
    const result = applyRating(base, 'again')
    expect(result.interval_days).toBe(1)
    expect(result.ease_factor).toBeCloseTo(SM2_INITIAL_EASE - 0.2)
  })

  it('Again never drops ease below SM2_MIN_EASE', () => {
    const low = { ...base, ease_factor: SM2_MIN_EASE }
    const result = applyRating(low, 'again')
    expect(result.ease_factor).toBe(SM2_MIN_EASE)
  })

  it('Hard multiplies interval by 1.2 and decreases ease', () => {
    const card = { ...base, interval_days: 5 }
    const result = applyRating(card, 'hard')
    expect(result.interval_days).toBe(Math.round(5 * 1.2))
    expect(result.ease_factor).toBeCloseTo(SM2_INITIAL_EASE - 0.15)
  })

  it('Good multiplies interval by ease_factor', () => {
    const card = { ...base, interval_days: 4, ease_factor: 2.5 }
    const result = applyRating(card, 'good')
    expect(result.interval_days).toBe(Math.round(4 * 2.5))
    expect(result.ease_factor).toBeCloseTo(2.5)
  })

  it('Easy multiplies interval by ease * 1.3 and increases ease', () => {
    const card = { ...base, interval_days: 4, ease_factor: 2.5 }
    const result = applyRating(card, 'easy')
    expect(result.interval_days).toBe(Math.round(4 * 2.5 * 1.3))
    expect(result.ease_factor).toBeCloseTo(2.5 + 0.1)
  })

  it('status becomes mastered when interval >= MASTERED_INTERVAL_DAYS', () => {
    const card = { ...base, interval_days: MASTERED_INTERVAL_DAYS - 1, ease_factor: 2.5 }
    const result = applyRating(card, 'good')
    expect(result.status).toBe('mastered')
  })

  it('status stays learning when interval < MASTERED_INTERVAL_DAYS', () => {
    const card = { ...base, interval_days: 3, ease_factor: 2.0 }
    const result = applyRating(card, 'good')
    expect(result.status).toBe('learning')
  })

  it('Good on a struggling card restores ease to SM2_INITIAL_EASE', () => {
    const card = { ...base, ease_factor: SM2_INITIAL_EASE - 0.4 }
    const result = applyRating(card, 'good')
    expect(result.ease_factor).toBe(SM2_INITIAL_EASE)
  })

  it('Easy on a struggling card restores ease to at least SM2_INITIAL_EASE', () => {
    const card = { ...base, ease_factor: SM2_INITIAL_EASE - 0.4 }
    const result = applyRating(card, 'easy')
    expect(result.ease_factor).toBeGreaterThanOrEqual(SM2_INITIAL_EASE)
  })

  it('status becomes learning from new on first rating', () => {
    const card = { ...base, status: 'new' as const }
    const result = applyRating(card, 'good')
    expect(result.status).toBe('learning')
  })

  it('next_review_at is in the future for good and easy', () => {
    expect(new Date(applyRating(base, 'good').next_review_at).getTime()).toBeGreaterThan(Date.now())
    expect(new Date(applyRating(base, 'easy').next_review_at).getTime()).toBeGreaterThan(Date.now())
  })

  it('next_review_at is now for again and hard so they appear first in the next session', () => {
    const before = Date.now()
    expect(new Date(applyRating(base, 'again').next_review_at).getTime()).toBeLessThanOrEqual(before + 50)
    expect(new Date(applyRating(base, 'hard').next_review_at).getTime()).toBeLessThanOrEqual(before + 50)
  })
})
