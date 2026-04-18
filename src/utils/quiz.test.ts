import { describe, it, expect } from 'vitest'
import { pickQuizQuestions, buildOptions, isCorrect } from './quiz'
import type { Question } from '@/types'

function makeQuestion(id: string, answers: string[], category_id = 'cat1'): Question {
  return { id, number: Number(id), category_id, question: `Question ${id}?`, answers }
}

const bank = Array.from({ length: 30 }, (_, i) => makeQuestion(String(i + 1), [`Answer ${i + 1}`]))

describe('pickQuizQuestions', () => {
  it('returns exactly the requested number of questions', () => {
    expect(pickQuizQuestions(bank, 20)).toHaveLength(20)
  })

  it('returns no duplicates', () => {
    const picked = pickQuizQuestions(bank, 20)
    expect(new Set(picked.map((q) => q.id)).size).toBe(20)
  })

  it('clamps to available questions when size exceeds bank', () => {
    const small = bank.slice(0, 5)
    expect(pickQuizQuestions(small, 20)).toHaveLength(5)
  })
})

describe('buildOptions', () => {
  it('returns 4 options', () => {
    expect(buildOptions(bank[0], bank)).toHaveLength(4)
  })

  it('includes the correct answer', () => {
    const options = buildOptions(bank[0], bank)
    expect(options).toContain(bank[0].answers[0])
  })

  it('returns no duplicate options', () => {
    const options = buildOptions(bank[0], bank)
    expect(new Set(options).size).toBe(4)
  })
})

describe('isCorrect', () => {
  it('returns true for exact match', () => {
    expect(isCorrect('The President', makeQuestion('1', ['The President']))).toBe(true)
  })

  it('returns true for case-insensitive match', () => {
    expect(isCorrect('the president', makeQuestion('1', ['The President']))).toBe(true)
  })

  it('returns true when any accepted answer matches', () => {
    expect(isCorrect('Answer B', makeQuestion('1', ['Answer A', 'Answer B']))).toBe(true)
  })

  it('returns false for wrong answer', () => {
    expect(isCorrect('The Senate', makeQuestion('1', ['The President']))).toBe(false)
  })

  it('trims whitespace before comparing', () => {
    expect(isCorrect('  The President  ', makeQuestion('1', ['The President']))).toBe(true)
  })
})
