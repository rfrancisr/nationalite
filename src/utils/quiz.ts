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

export function getRequiredAnswerCount(question: Question): number {
  const text = question.question.toLowerCase()
  if (/\bthree\b/.test(text)) return 3
  if (/\btwo\b/.test(text)) return 2
  return 1
}

export function buildOptions(question: Question, allQuestions: Question[], requiredCount = 1): string[] {
  const distractorCount = 3

  if (requiredCount > 1) {
    // Pick requiredCount distinct correct answers
    const shuffledAnswers = [...question.answers].sort(() => Math.random() - 0.5)
    const correctPicks = shuffledAnswers.slice(0, Math.min(requiredCount, shuffledAnswers.length))

    const curated = (DISTRACTORS[question.number] ?? [])
      .filter((d) => !question.answers.some((a) => a.trim().toLowerCase() === d.trim().toLowerCase()))
      .sort(() => Math.random() - 0.5)
      .slice(0, distractorCount)

    const needed = distractorCount - curated.length
    const fallbackPool = allQuestions
      .filter((q) => q.id !== question.id)
      .flatMap((q) => q.answers)
      .filter((a, i, arr) =>
        !question.answers.some((ca) => ca.trim().toLowerCase() === a.trim().toLowerCase()) &&
        !curated.includes(a) &&
        arr.indexOf(a) === i
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, needed)

    return [...correctPicks, ...curated, ...fallbackPool].sort(() => Math.random() - 0.5)
  }

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

export function isCorrectMultiSelect(chosen: string[], question: Question, requiredCount: number): boolean {
  if (chosen.length !== requiredCount) return false
  return chosen.every((c) => isCorrect(c, question))
}
