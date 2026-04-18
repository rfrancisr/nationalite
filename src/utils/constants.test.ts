import { describe, it, expect } from 'vitest'
import {
  TOTAL_QUESTIONS,
  QUIZ_SIZE,
  PASS_THRESHOLD,
  MASTERED_INTERVAL_DAYS,
  SM2_MIN_EASE,
  SM2_INITIAL_EASE,
} from './constants'

describe('constants', () => {
  it('TOTAL_QUESTIONS is 128', () => expect(TOTAL_QUESTIONS).toBe(128))
  it('QUIZ_SIZE is 20', () => expect(QUIZ_SIZE).toBe(20))
  it('PASS_THRESHOLD is 12', () => expect(PASS_THRESHOLD).toBe(12))
  it('PASS_THRESHOLD is less than QUIZ_SIZE', () => expect(PASS_THRESHOLD).toBeLessThan(QUIZ_SIZE))
  it('MASTERED_INTERVAL_DAYS is 21', () => expect(MASTERED_INTERVAL_DAYS).toBe(21))
  it('SM2_MIN_EASE is 1.3', () => expect(SM2_MIN_EASE).toBe(1.3))
  it('SM2_INITIAL_EASE is 2.5', () => expect(SM2_INITIAL_EASE).toBe(2.5))
})
