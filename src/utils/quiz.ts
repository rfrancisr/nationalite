import type { Question } from '@/types'
import { QUIZ_SIZE } from './constants'
import { DISTRACTORS } from './distractors'

type AnswerCategory = 'number' | 'name' | 'other'

const NON_NAME_STARTS = new Set(['the', 'a', 'an'])

function categorize(answer: string): AnswerCategory {
  const a = answer.trim()
  if (/^\d+$/.test(a)) return 'number'
  const words = a.split(/\s+/)
  const isProperName =
    words.length >= 2 &&
    words.every((w) => /^[A-Z]/.test(w)) &&
    !NON_NAME_STARTS.has(words[0].toLowerCase())
  return isProperName ? 'name' : 'other'
}

export function pickQuizQuestions(questions: Question[], size = QUIZ_SIZE): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(size, shuffled.length))
}

export function buildOptions(question: Question, allQuestions: Question[]): string[] {
  const correct = question.answers[Math.floor(Math.random() * question.answers.length)]

  // Use curated distractors for this question number when available
  const curated = (DISTRACTORS[question.number] ?? [])
    .filter((d) => !question.answers.some((a) => a.trim().toLowerCase() === d.trim().toLowerCase()))
    .sort(() => Math.random() - 0.5)

  if (curated.length >= 3) {
    return [correct, ...curated.slice(0, 3)].sort(() => Math.random() - 0.5)
  }

  // Fallback: pick type-matched answers from the rest of the question bank
  const correctCategory = categorize(correct)
  const pool = allQuestions
    .filter((q) => q.id !== question.id)
    .flatMap((q) => q.answers)
    .filter((a, i, arr) => a !== correct && arr.indexOf(a) === i)

  const sameType = [...pool.filter((a) => categorize(a) === correctCategory)].sort(() => Math.random() - 0.5)
  const fallback = [...pool.filter((a) => categorize(a) !== correctCategory)].sort(() => Math.random() - 0.5)
  const poolDistractors = [...sameType, ...fallback].slice(0, 3 - curated.length)

  return [correct, ...curated, ...poolDistractors].sort(() => Math.random() - 0.5)
}

export function isCorrect(chosen: string, question: Question): boolean {
  const normalized = chosen.trim().toLowerCase()
  return question.answers.some((a) => a.trim().toLowerCase() === normalized)
}
