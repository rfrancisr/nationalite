import { describe, it, expect } from 'vitest'
import { parseQuestions, mapToCategory, CATEGORY_MAP } from './parse-pdf'
import type { ParsedQuestion } from '@/types'

// ─── parseQuestions ───────────────────────────────────────────────────────────

describe('parseQuestions', () => {
  it('extracts question number, text and single answer', () => {
    const raw = `1. What is the supreme law of the land?\n▪ the Constitution`
    const result = parseQuestions(raw)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual<ParsedQuestion>({
      number: 1,
      question: 'What is the supreme law of the land?',
      answers: ['the Constitution'],
    })
  })

  it('extracts multiple accepted answers for one question', () => {
    const raw = `6. What is one right or freedom from the First Amendment?\n▪ speech\n▪ religion\n▪ assembly\n▪ press\n▪ petition the government`
    const result = parseQuestions(raw)
    expect(result[0].answers).toEqual([
      'speech',
      'religion',
      'assembly',
      'press',
      'petition the government',
    ])
  })

  it('parses two consecutive questions without mixing answers', () => {
    const raw = [
      '1. What is the supreme law of the land?',
      '▪ the Constitution',
      '2. What does the Constitution do?',
      '▪ sets up the government',
      '▪ defines the government',
      '▪ protects basic rights of Americans',
    ].join('\n')
    const result = parseQuestions(raw)
    expect(result).toHaveLength(2)
    expect(result[0].number).toBe(1)
    expect(result[0].answers).toHaveLength(1)
    expect(result[1].number).toBe(2)
    expect(result[1].answers).toHaveLength(3)
  })

  it('returns 0 questions for empty string', () => {
    expect(parseQuestions('')).toHaveLength(0)
  })

  it('trims whitespace from question text and answers', () => {
    const raw = `1.  What is the supreme law of the land?  \n▪  the Constitution  `
    const result = parseQuestions(raw)
    expect(result[0].question).toBe('What is the supreme law of the land?')
    expect(result[0].answers[0]).toBe('the Constitution')
  })
})

// ─── mapToCategory ────────────────────────────────────────────────────────────

describe('mapToCategory', () => {
  it('maps question 1 to principles-of-american-democracy', () => {
    expect(mapToCategory(1)).toBe('principles-of-american-democracy')
  })

  it('maps question 20 to system-of-government', () => {
    expect(mapToCategory(20)).toBe('system-of-government')
  })

  it('maps question 100 to rights-and-responsibilities', () => {
    expect(mapToCategory(100)).toBe('rights-and-responsibilities')
  })

  it('throws for question number out of range', () => {
    expect(() => mapToCategory(0)).toThrow()
    expect(() => mapToCategory(129)).toThrow()
  })
})

// ─── CATEGORY_MAP ─────────────────────────────────────────────────────────────

describe('CATEGORY_MAP', () => {
  it('covers all 128 question numbers', () => {
    const covered = Object.values(CATEGORY_MAP).reduce(
      (acc, nums) => acc + nums.length,
      0,
    )
    expect(covered).toBe(128)
  })

  it('has no duplicate question numbers across categories', () => {
    const all = Object.values(CATEGORY_MAP).flat()
    const unique = new Set(all)
    expect(unique.size).toBe(all.length)
  })
})
