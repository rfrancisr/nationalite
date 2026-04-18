import type { QuizAnswer, QuizSession, Question, Category } from '@/types'

export interface CategoryMissEntry {
  category: Category
  missed: number
  total: number
}

export function quizCategoryBreakdown(
  answers: QuizAnswer[],
  quizQuestions: Question[],
  categories: Category[],
): CategoryMissEntry[] {
  const catMap = new Map(categories.map((c) => [c.id, c]))
  const qMap = new Map(quizQuestions.map((q) => [q.id, q]))

  const stats = new Map<string, { missed: number; total: number }>()

  for (const a of answers) {
    const q = qMap.get(a.question_id)
    if (!q) continue
    const entry = stats.get(q.category_id) ?? { missed: 0, total: 0 }
    entry.total++
    if (!a.correct) entry.missed++
    stats.set(q.category_id, entry)
  }

  return [...stats.entries()]
    .filter(([, s]) => s.missed > 0)
    .sort(([, a], [, b]) => b.missed - a.missed)
    .map(([catId, s]) => ({ category: catMap.get(catId)!, missed: s.missed, total: s.total }))
    .filter((e) => e.category != null)
}

export function weakestCategory(
  sessions: QuizSession[],
  allQuestions: Question[],
  categories: Category[],
): Category | null {
  const qMap = new Map(allQuestions.map((q) => [q.id, q]))
  const misses = new Map<string, number>()

  for (const s of sessions) {
    for (const a of s.answers) {
      if (!a.correct) {
        const q = qMap.get(a.question_id)
        if (q) misses.set(q.category_id, (misses.get(q.category_id) ?? 0) + 1)
      }
    }
  }

  if (misses.size === 0) return null

  const catMap = new Map(categories.map((c) => [c.id, c]))
  const [topId] = [...misses.entries()].sort(([, a], [, b]) => b - a)[0]
  return catMap.get(topId) ?? null
}
