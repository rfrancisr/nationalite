import { useState } from 'react'
import { useCategories } from '@/hooks/use-categories'
import { useQuestions } from '@/hooks/use-questions'
import { useUserProgress, useUpdateStatus } from '@/hooks/use-user-progress'
import StatusBadge from '@/components/ui/status-badge'
import type { CardStatus } from '@/types'

export default function QuestionsPage() {
  const { data: categories = [], isLoading: catsLoading } = useCategories()
  const { data: questions = [], isLoading: qsLoading } = useQuestions()
  const { data: progress = [], isLoading: progLoading } = useUserProgress()
  const { mutate: updateStatus } = useUpdateStatus()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (catsLoading || qsLoading || progLoading) {
    return <div className="p-8 text-center text-gray-600">Loading questions…</div>
  }

  const progressMap = new Map(progress.map((p) => [p.question_id, p]))

  const filtered = questions.filter((q) => {
    if (search && !q.question.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter && q.category_id !== categoryFilter) return false
    if (statusFilter) {
      const status = progressMap.get(q.id)?.status ?? 'new'
      if (status !== statusFilter) return false
    }
    return true
  })

  const grouped = categories.map((cat) => ({
    category: cat,
    questions: filtered.filter((q) => q.category_id === cat.id),
  })).filter((g) => g.questions.length > 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Browse Questions</h1>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions…"
          className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          aria-label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          aria-label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="learning">Learning</option>
          <option value="mastered">Mastered</option>
        </select>
      </div>

      {/* Grouped accordions */}
      {grouped.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No questions match your filters.</p>
      ) : (
        grouped.map(({ category, questions: qs }) => (
          <section key={category.id}>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {category.icon} {category.name}
              <span className="ml-2 text-base font-normal text-gray-600">({qs.length})</span>
            </h2>
            <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
              {qs.map((q) => {
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
                      <div className="px-4 pb-4 pt-2 bg-gray-50 space-y-3">
                        <div>
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
                        {status !== 'mastered' && (
                          <button
                            onClick={() => updateStatus({ questionId: q.id, status: 'mastered' })}
                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium text-base hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                          >
                            Mark as Mastered
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
