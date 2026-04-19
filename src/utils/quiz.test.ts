import { describe, it, expect } from 'vitest'
import { pickQuizQuestions, buildOptions, isCorrect, getRequiredAnswerCount, isCorrectMultiSelect } from './quiz'
import type { Question } from '@/types'

function makeQuestion(id: string, answers: string[], category_id = 'cat1', question = `Question ${id}?`): Question {
  return { id, number: Number(id), category_id, question, answers }
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
  it('returns 4 options for a single-answer question', () => {
    expect(buildOptions(bank[0], bank)).toHaveLength(4)
  })

  it('includes one of the correct answers', () => {
    const options = buildOptions(bank[0], bank)
    expect(bank[0].answers.some((a) => options.includes(a))).toBe(true)
  })

  it('returns no duplicate options', () => {
    const options = buildOptions(bank[0], bank)
    expect(new Set(options).size).toBe(4)
  })

  it('prefers numeric distractors for a numeric correct answer (fallback path)', () => {
    // Use numbers > 128 so curated distractors don't apply
    const numericBank = [
      makeQuestion('1001', ['100']),
      makeQuestion('1002', ['9']),
      makeQuestion('1003', ['27']),
      makeQuestion('1004', ['50']),
      makeQuestion('1005', ['13']),
      makeQuestion('1006', ['George Washington']),
      makeQuestion('1007', ['freedom of speech']),
      makeQuestion('1008', ['Congress']),
    ]
    for (let i = 0; i < 20; i++) {
      const options = buildOptions(numericBank[0], numericBank)
      const distractors = options.filter((o) => o !== '100')
      expect(distractors.every((d) => /^\d+$/.test(d))).toBe(true)
    }
  })

  it('prefers name distractors for a name correct answer (fallback path)', () => {
    const nameBank = [
      makeQuestion('1001', ['George Washington']),
      makeQuestion('1002', ['Abraham Lincoln']),
      makeQuestion('1003', ['Barack Obama']),
      makeQuestion('1004', ['Benjamin Franklin']),
      makeQuestion('1005', ['Thomas Jefferson']),
      makeQuestion('1006', ['100']),
      makeQuestion('1007', ['freedom of speech']),
      makeQuestion('1008', ['Congress']),
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
      makeQuestion('1001', ['100']),
      makeQuestion('1002', ['9']),
      makeQuestion('1003', ['George Washington']),
      makeQuestion('1004', ['freedom of speech']),
      makeQuestion('1005', ['Congress']),
    ]
    const options = buildOptions(mixedBank[0], mixedBank)
    expect(options).toHaveLength(4)
    expect(options).toContain('100')
  })

  it('uses curated distractors when question number is in DISTRACTORS', () => {
    // Q21: "How many U.S. senators?" → correct: "100", curated has "50", "435", etc.
    const q21 = makeQuestion('21', ['100'])
    const options = buildOptions(q21, [q21])
    expect(options).toHaveLength(4)
    expect(options).toContain('100')
  })

  it('includes requiredCount correct answers for multi-select questions', () => {
    const q = makeQuestion('1001', ['Equality', 'Liberty', 'Natural rights', 'Social contract', 'Self-government'],
      'cat1', 'Name two important ideas.')
    const otherBank = Array.from({ length: 10 }, (_, i) =>
      makeQuestion(String(2000 + i), [`Other ${i}`])
    )
    for (let i = 0; i < 10; i++) {
      const options = buildOptions(q, [q, ...otherBank], 2)
      const correctInOptions = options.filter((o) =>
        q.answers.some((a) => a.trim().toLowerCase() === o.trim().toLowerCase())
      )
      expect(correctInOptions.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('returns requiredCount + 3 options for multi-select questions', () => {
    const q = makeQuestion('1001', ['A', 'B', 'C', 'D', 'E'], 'cat1', 'Name two things.')
    const otherBank = Array.from({ length: 10 }, (_, i) => makeQuestion(String(2000 + i), [`Other ${i}`]))
    const options = buildOptions(q, [q, ...otherBank], 2)
    expect(options).toHaveLength(5)
  })

  it('returns requiredCount + 3 options for 3-answer multi-select questions', () => {
    const q = makeQuestion('1001', ['A', 'B', 'C', 'D', 'E'], 'cat1', 'Name three things.')
    const otherBank = Array.from({ length: 10 }, (_, i) => makeQuestion(String(2000 + i), [`Other ${i}`]))
    const options = buildOptions(q, [q, ...otherBank], 3)
    expect(options).toHaveLength(6)
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

describe('getRequiredAnswerCount', () => {
  it('returns 1 for a regular question', () => {
    const q = makeQuestion('1', ['Yes'], 'cat', 'What is the Constitution?')
    expect(getRequiredAnswerCount(q)).toBe(1)
  })

  it('returns 2 for "Name two ..." questions', () => {
    const q = makeQuestion('10', ['Equality'], 'cat',
      'Name two important ideas from the Declaration of Independence and the U.S. Constitution.')
    expect(getRequiredAnswerCount(q)).toBe(2)
  })

  it('returns 2 for "What are two ..." questions', () => {
    const q = makeQuestion('48', ['Attorney General'], 'cat', 'What are two Cabinet-level positions?')
    expect(getRequiredAnswerCount(q)).toBe(2)
  })

  it('returns 3 for "Name three ..." questions', () => {
    const q = makeQuestion('65', ['Freedom of speech'], 'cat',
      'What are three rights of everyone living in the United States?')
    expect(getRequiredAnswerCount(q)).toBe(3)
  })

  it('returns 3 for "Name three national ..." questions', () => {
    const q = makeQuestion('126', ['New Year\'s Day'], 'cat', 'Name three national U.S. holidays.')
    expect(getRequiredAnswerCount(q)).toBe(3)
  })

  it('returns 3 for "Name the three ..." questions', () => {
    const q = makeQuestion('16', ['Legislative'], 'cat', 'Name the three branches of government.')
    expect(getRequiredAnswerCount(q)).toBe(3)
  })
})

describe('isCorrectMultiSelect', () => {
  const q = makeQuestion('1', ['Equality', 'Liberty', 'Natural rights', 'Social contract'])

  it('returns true when all selected answers are correct', () => {
    expect(isCorrectMultiSelect(['Equality', 'Liberty'], q, 2)).toBe(true)
  })

  it('returns true when selecting different valid answers', () => {
    expect(isCorrectMultiSelect(['Natural rights', 'Social contract'], q, 2)).toBe(true)
  })

  it('returns false when any selected answer is wrong', () => {
    expect(isCorrectMultiSelect(['Equality', 'Manifest destiny'], q, 2)).toBe(false)
  })

  it('returns false when fewer than required are selected', () => {
    expect(isCorrectMultiSelect(['Equality'], q, 2)).toBe(false)
  })

  it('returns false when more than required are selected', () => {
    expect(isCorrectMultiSelect(['Equality', 'Liberty', 'Natural rights'], q, 2)).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(isCorrectMultiSelect(['equality', 'LIBERTY'], q, 2)).toBe(true)
  })

  it('handles 3-answer questions', () => {
    expect(isCorrectMultiSelect(['Equality', 'Liberty', 'Natural rights'], q, 3)).toBe(true)
  })
})
