import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCategories } from '@/hooks/use-categories'
import { useQuestions } from '@/hooks/use-questions'
import { useUserProgress } from '@/hooks/use-user-progress'
import StatusBadge from '@/components/ui/status-badge'
import type { CardStatus } from '@/types'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: categories = [] } = useCategories()
  const { data: questions = [] } = useQuestions()
  const { data: progress = [] } = useUserProgress()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const category = categories.find((c) => c.slug === slug)
  if (!category) {
    return <div className="p-8 text-center text-gray-500">Category not found.</div>
  }

  const categoryQuestions = questions.filter((q) => q.category_id === category.id)
  const progressMap = new Map(progress.map((p) => [p.question_id, p]))

  const masteredCount = categoryQuestions.filter(
    (q) => progressMap.get(q.id)?.status === 'mastered'
  ).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link to="/questions" className="text-sm text-indigo-600 hover:underline">← All questions</Link>

      <div className="flex items-center gap-3">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-sm text-gray-500">
            {masteredCount} / {categoryQuestions.length} mastered
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${categoryQuestions.length ? (masteredCount / categoryQuestions.length) * 100 : 0}%` }}
        />
      </div>

      <Link
        to="/flashcards"
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        Study this category
      </Link>

      <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
        {categoryQuestions.map((q) => {
          const status = (progressMap.get(q.id)?.status ?? 'new') as CardStatus
          const isExpanded = expandedId === q.id

          return (
            <div key={q.id}>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                aria-expanded={isExpanded}
              >
                <span className="text-xs text-gray-400 w-6 shrink-0">#{q.number}</span>
                <span className="flex-1 text-sm text-gray-800">{q.question}</span>
                <StatusBadge status={status} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 bg-gray-50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Accepted answer{q.answers.length > 1 ? 's' : ''}
                  </p>
                  <ul className="space-y-1">
                    {q.answers.map((a) => (
                      <li key={a} className="text-sm text-gray-800 flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">✓</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
