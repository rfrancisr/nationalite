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
    return <div className="p-8 text-center text-gray-600">Category not found.</div>
  }

  const categoryQuestions = questions.filter((q) => q.category_id === category.id)
  const progressMap = new Map(progress.map((p) => [p.question_id, p]))

  const masteredCount = categoryQuestions.filter(
    (q) => progressMap.get(q.id)?.status === 'mastered'
  ).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link to="/questions" className="text-base text-indigo-600 hover:underline font-medium">← All questions</Link>

      <div className="flex items-center gap-4">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-base text-gray-600">
            {masteredCount} / {categoryQuestions.length} mastered
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${categoryQuestions.length ? (masteredCount / categoryQuestions.length) * 100 : 0}%` }}
        />
      </div>

      <Link
        to="/flashcards"
        state={{ categoryId: category.id }}
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-base font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                aria-expanded={isExpanded}
                aria-label={`Question ${q.number}: ${q.question}`}
              >
                <span className="text-sm text-gray-600 w-8 shrink-0 font-medium">#{q.number}</span>
                <span className="flex-1 text-base text-gray-800">{q.question}</span>
                <StatusBadge status={status} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Accepted answer{q.answers.length > 1 ? 's' : ''}
                  </p>
                  <ul className="space-y-2">
                    {q.answers.map((a) => (
                      <li key={a} className="text-base text-gray-800 flex items-start gap-2">
                        <span className="text-green-600 mt-0.5 font-bold">✓</span> {a}
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
