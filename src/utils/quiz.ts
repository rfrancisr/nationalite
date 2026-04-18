import type { Question } from '@/types'
import { QUIZ_SIZE } from './constants'

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
  const correct = question.answers[0]
  const correctCategory = categorize(correct)

  const pool = allQuestions
    .filter((q) => q.id !== question.id)
    .flatMap((q) => q.answers)
    .filter((a, i, arr) => a !== correct && arr.indexOf(a) === i)

  const sameType = pool.filter((a) => categorize(a) === correctCategory)
  const fallback = pool.filter((a) => categorize(a) !== correctCategory)

  const shuffledSame = [...sameType].sort(() => Math.random() - 0.5)
  const shuffledFallback = [...fallback].sort(() => Math.random() - 0.5)

  // Fill from same-type first, fall back to other types only if needed
  const distractors = [...shuffledSame, ...shuffledFallback].slice(0, 3)
  return [correct, ...distractors].sort(() => Math.random() - 0.5)
}

export function isCorrect(chosen: string, question: Question): boolean {
  const normalized = chosen.trim().toLowerCase()
  return question.answers.some((a) => a.trim().toLowerCase() === normalized)
}
