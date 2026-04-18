import type { Question } from '@/types'
import { QUIZ_SIZE } from './constants'

export function pickQuizQuestions(questions: Question[], size = QUIZ_SIZE): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(size, shuffled.length))
}

export function buildOptions(question: Question, allQuestions: Question[]): string[] {
  const correct = question.answers[0]
  const pool = allQuestions
    .filter((q) => q.id !== question.id)
    .flatMap((q) => q.answers)
    .filter((a, i, arr) => a !== correct && arr.indexOf(a) === i)

  const distractors = [...pool].sort(() => Math.random() - 0.5).slice(0, 3)
  return [correct, ...distractors].sort(() => Math.random() - 0.5)
}

export function isCorrect(chosen: string, question: Question): boolean {
  const normalized = chosen.trim().toLowerCase()
  return question.answers.some((a) => a.trim().toLowerCase() === normalized)
}
