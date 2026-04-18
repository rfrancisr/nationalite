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

  it('prefers numeric distractors for a numeric correct answer', () => {
    const numericBank = [
      makeQuestion('1', ['100']),
      makeQuestion('2', ['9']),
      makeQuestion('3', ['27']),
      makeQuestion('4', ['50']),
      makeQuestion('5', ['13']),
      makeQuestion('6', ['George Washington']),
      makeQuestion('7', ['freedom of speech']),
      makeQuestion('8', ['Congress']),
    ]
    // Run multiple times since buildOptions is random
    for (let i = 0; i < 20; i++) {
      const options = buildOptions(numericBank[0], numericBank)
      const distractors = options.filter((o) => o !== '100')
      expect(distractors.every((d) => /^\d+$/.test(d))).toBe(true)
    }
  })

  it('prefers name distractors for a name correct answer', () => {
    const nameBank = [
      makeQuestion('1', ['George Washington']),
      makeQuestion('2', ['Abraham Lincoln']),
      makeQuestion('3', ['Barack Obama']),
      makeQuestion('4', ['Benjamin Franklin']),
      makeQuestion('5', ['Thomas Jefferson']),
      makeQuestion('6', ['100']),
      makeQuestion('7', ['freedom of speech']),
      makeQuestion('8', ['Congress']),
    ]
    for (let i = 0; i < 20; i++) {
      const options = buildOptions(nameBank[0], nameBank)
      const distractors = options.filter((o) => o !== 'George Washington')
      const names = ['Abraham Lincoln', 'Barack Obama', 'Benjamin Franklin', 'Thomas Jefferson']
      expect(distractors.every((d) => names.includes(d))).toBe(true)
    }
  })

  it('falls back to any distractor when not enough same-type answers exist', () => {
    const mixedBank = [
      makeQuestion('1', ['100']),
      makeQuestion('2', ['9']),   // only 1 other number
      makeQuestion('3', ['George Washington']),
      makeQuestion('4', ['freedom of speech']),
      makeQuestion('5', ['Congress']),
    ]
    const options = buildOptions(mixedBank[0], mixedBank)
    expect(options).toHaveLength(4)
    expect(options).toContain('100')
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
