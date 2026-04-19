import { describe, it, expect } from 'vitest'
import { quizCategoryBreakdown, weakestCategory } from './quiz-analysis'
import type { Question, QuizAnswer, QuizSession, Category } from '@/types'

const cats: Category[] = [
  { id: 'cat1', name: 'Principles', slug: 'principles', icon: '🏛️' },
  { id: 'cat2', name: 'History', slug: 'history', icon: '📜' },
  { id: 'cat3', name: 'Geography', slug: 'geography', icon: '🗺️' },
]

const questions: Question[] = [
  { id: 'q1', number: 1, category_id: 'cat1', question: 'Q1?', answers: ['A1'] },
  { id: 'q2', number: 2, category_id: 'cat1', question: 'Q2?', answers: ['A2'] },
  { id: 'q3', number: 3, category_id: 'cat2', question: 'Q3?', answers: ['A3'] },
  { id: 'q4', number: 4, category_id: 'cat2', question: 'Q4?', answers: ['A4'] },
  { id: 'q5', number: 5, category_id: 'cat3', question: 'Q5?', answers: ['A5'] },
]

describe('quizCategoryBreakdown', () => {
  it('returns empty array for no answers', () => {
    expect(quizCategoryBreakdown([], [], cats)).toEqual([])
  })

  it('counts misses per category and sorts by miss count descending', () => {
    const quizQs = [questions[0], questions[1], questions[2], questions[3], questions[4]]
    const answers: QuizAnswer[] = [
      { question_id: 'q1', chosen_answers: ['wrong'], correct: false },
      { question_id: 'q2', chosen_answers: ['wrong'], correct: false },
      { question_id: 'q3', chosen_answers: ['wrong'], correct: false },
      { question_id: 'q4', chosen_answers: ['A4'], correct: true },
      { question_id: 'q5', chosen_answers: ['A5'], correct: true },
    ]
    const result = quizCategoryBreakdown(answers, quizQs, cats)
    expect(result[0].category.id).toBe('cat1') // 2 missed
    expect(result[0].missed).toBe(2)
    expect(result[0].total).toBe(2)
    expect(result[1].category.id).toBe('cat2') // 1 missed
    expect(result[1].missed).toBe(1)
    expect(result[1].total).toBe(2)
  })

  it('excludes categories with zero misses', () => {
    const quizQs = [questions[0], questions[2]]
    const answers: QuizAnswer[] = [
      { question_id: 'q1', chosen_answers: ['A1'], correct: true },
      { question_id: 'q3', chosen_answers: ['wrong'], correct: false },
    ]
    const result = quizCategoryBreakdown(answers, quizQs, cats)
    expect(result).toHaveLength(1)
    expect(result[0].category.id).toBe('cat2')
  })

  it('returns empty when all answers are correct', () => {
    const quizQs = [questions[0]]
    const answers: QuizAnswer[] = [
      { question_id: 'q1', chosen_answers: ['A1'], correct: true },
    ]
    expect(quizCategoryBreakdown(answers, quizQs, cats)).toEqual([])
  })
})

describe('weakestCategory', () => {
  it('returns null when no sessions', () => {
    expect(weakestCategory([], questions, cats)).toBeNull()
  })

  it('returns category with most total misses across sessions', () => {
    const sessions: QuizSession[] = [
      {
        id: 's1', user_id: 'u1', started_at: '2024-06-14T08:00:00Z',
        finished_at: '2024-06-14T08:10:00Z', score: 3, passed: false,
        answers: [
          { question_id: 'q1', chosen_answers: ['wrong'], correct: false },
          { question_id: 'q2', chosen_answers: ['wrong'], correct: false },
          { question_id: 'q3', chosen_answers: ['wrong'], correct: false },
        ],
      },
      {
        id: 's2', user_id: 'u1', started_at: '2024-06-15T08:00:00Z',
        finished_at: '2024-06-15T08:10:00Z', score: 4, passed: false,
        answers: [
          { question_id: 'q1', chosen_answers: ['wrong'], correct: false },
          { question_id: 'q3', chosen_answers: ['A3'], correct: true },
        ],
      },
    ]
    // cat1: 3 misses (q1×2, q2×1), cat2: 1 miss (q3×1)
    const result = weakestCategory(sessions, questions, cats)
    expect(result?.id).toBe('cat1')
  })

  it('returns null when all answers are correct', () => {
    const sessions: QuizSession[] = [
      {
        id: 's1', user_id: 'u1', started_at: '2024-06-14T08:00:00Z',
        answers: [{ question_id: 'q1', chosen_answers: ['A1'], correct: true }],
      },
    ]
    expect(weakestCategory(sessions, questions, cats)).toBeNull()
  })
})
