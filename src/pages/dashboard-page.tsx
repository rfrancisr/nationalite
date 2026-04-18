import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/use-categories'
import { useQuestions } from '@/hooks/use-questions'
import { useUserProgress } from '@/hooks/use-user-progress'
import { useQuizSessions } from '@/hooks/use-quiz-sessions'
import { calcStreak, countDueToday } from '@/utils/dashboard'
import { getYesterdaysMissedIds, getStudiedTodayIds } from '@/utils/daily-plan'
import { weakestCategory } from '@/utils/quiz-analysis'
import { TOTAL_QUESTIONS, QUIZ_SIZE, PASS_THRESHOLD } from '@/utils/constants'
import type { QuizSession } from '@/types'

export default function DashboardPage() {
  const { data: categories = [] } = useCategories()
  const { data: questions = [] } = useQuestions()
  const { data: progress = [] } = useUserProgress()
  const { data: sessions = [] } = useQuizSessions()

  const masteredCount = useMemo(() => progress.filter((p) => p.status === 'mastered').length, [progress])
  const masteryPct = masteredCount / TOTAL_QUESTIONS
  const dueToday = useMemo(() => countDueToday(progress, questions.map((q) => q.id)), [progress, questions])
  const streak = useMemo(() => calcStreak(progress, sessions), [progress, sessions])
  const yesterdayMissedIds = useMemo(() => getYesterdaysMissedIds(sessions), [sessions])
  const studiedTodayIds = useMemo(() => getStudiedTodayIds(progress), [progress])
  const focusCategory = useMemo(() => weakestCategory(sessions, questions, categories), [sessions, questions, categories])

  const categoryStats = useMemo(() =>
    categories.map((cat) => {
      const catQuestions = questions.filter((q) => q.category_id === cat.id)
      const catMastered = progress.filter(
        (p) => p.status === 'mastered' && catQuestions.some((q) => q.id === p.question_id),
      ).length
      return { cat, total: catQuestions.length, mastered: catMastered }
    }),
    [categories, questions, progress],
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Progress ring + quick stats */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative shrink-0">
          <ProgressRing pct={masteryPct} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-indigo-600">{Math.round(masteryPct * 100)}%</span>
            <span className="text-sm text-gray-600">mastered</span>
          </div>
        </div>
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <p className="text-xl font-semibold text-gray-900">
            {masteredCount} mastered
          </p>
          <p className="text-base text-gray-600">{masteredCount} of {TOTAL_QUESTIONS} questions</p>
          <div className="flex gap-8 justify-center sm:justify-start pt-2">
            <Stat label="Due today" value={dueToday} />
            <Stat label="Streak" value={`${streak}d`} />
          </div>
        </div>
      </div>

      {/* Today's Plan */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Today's Plan</h2>
        <div className="space-y-3">
          <SessionCard
            emoji="☀️"
            title="Morning Warm-up"
            subtitle="5 min"
            description={
              yesterdayMissedIds.length > 0
                ? `${yesterdayMissedIds.length} missed yesterday`
                : 'Nothing missed yesterday'
            }
            disabled={yesterdayMissedIds.length === 0}
            to="/flashcards"
            state={{ missedIds: yesterdayMissedIds, mixed: true }}
          />
          <SessionCard
            emoji="🌤️"
            title="Midday Review"
            subtitle="10 min"
            description={dueToday > 0 ? `${dueToday} cards due today` : 'All caught up!'}
            disabled={dueToday === 0}
            to="/flashcards"
            state={{ preselectedDeck: 'due' }}
          />
          <SessionCard
            emoji="🌙"
            title="Evening Recap"
            subtitle="5 min"
            description={
              studiedTodayIds.length > 0
                ? `${studiedTodayIds.length} studied today`
                : 'Study some cards first'
            }
            disabled={studiedTodayIds.length === 0}
            to="/flashcards"
            state={{ studiedIds: studiedTodayIds, mixed: true }}
          />
        </div>
      </section>

      {/* Focus Area */}
      {focusCategory && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Focus Area</h2>
          <Link
            to="/flashcards"
            state={{ categoryId: focusCategory.id }}
            className="flex items-center gap-4 p-5 bg-amber-50 border border-amber-200 rounded-xl hover:border-amber-400 hover:shadow-sm transition-all group focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            <span className="text-3xl shrink-0">{focusCategory.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-gray-900 group-hover:text-amber-700">
                {focusCategory.name}
              </p>
              <p className="text-base text-amber-700">Most missed in recent quizzes — review now</p>
            </div>
            <span className="text-amber-400 text-xl shrink-0">→</span>
          </Link>
        </section>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/flashcards"
          className="flex flex-col items-center justify-center gap-3 py-6 px-4 bg-indigo-600 text-white rounded-2xl font-semibold text-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span className="text-4xl" aria-hidden="true">🃏</span>
          <span>Flashcards</span>
        </Link>
        <Link
          to="/quiz"
          className="flex flex-col items-center justify-center gap-3 py-6 px-4 bg-white border-2 border-gray-200 text-gray-800 rounded-2xl font-semibold text-lg hover:border-indigo-400 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span className="text-4xl" aria-hidden="true">📝</span>
          <span>Take a Quiz</span>
        </Link>
      </div>

      {/* Recent quizzes */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Recent Quizzes</h2>
        {sessions.length === 0 ? (
          <p className="text-base text-gray-600">No quizzes yet — take your first one!</p>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
            <QuizSparkline sessions={sessions} />
            <div className="flex gap-3 flex-wrap">
              {[...sessions].reverse().map((s) => (
                <div
                  key={s.id}
                  className={`flex flex-col items-center px-4 py-2 rounded-xl font-medium ${
                    s.passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  <span className="text-xl font-bold">{s.score}</span>
                  <span className="text-sm opacity-70">/{QUIZ_SIZE}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Category breakdown */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">By Category</h2>
        <div className="space-y-2">
          {categoryStats.map(({ cat, total, mastered }) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 transition-colors group focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="text-2xl shrink-0">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-base font-medium text-gray-800 truncate group-hover:text-indigo-600">
                    {cat.name}
                  </span>
                  <span className="text-sm text-gray-600 shrink-0 ml-2">{mastered}/{total}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: total > 0 ? `${(mastered / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 15.9155
  const circ = 100
  const dash = circ * Math.min(pct, 1)
  return (
    <svg viewBox="0 0 36 36" width={120} height={120} className="-rotate-90" aria-hidden="true">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
      <circle
        cx="18" cy="18" r={r}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="3"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div aria-label={`${label}: ${value}`}>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  )
}

function SessionCard({
  emoji,
  title,
  subtitle,
  description,
  disabled,
  to,
  state,
}: {
  emoji: string
  title: string
  subtitle: string
  description: string
  disabled: boolean
  to: string
  state: Record<string, unknown>
}) {
  const base =
    'flex items-center gap-4 p-5 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
  const active = 'bg-white border-gray-200 hover:border-indigo-400 hover:shadow-sm'
  const inactive = 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed pointer-events-none'

  return (
    <Link
      to={to}
      state={state}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      className={`${base} ${disabled ? inactive : active}`}
    >
      <span className="text-3xl shrink-0" aria-hidden="true">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-lg font-semibold text-gray-900">{title}</p>
          <span className="text-sm text-gray-500 shrink-0">{subtitle}</span>
        </div>
        <p className="text-base text-gray-600">{description}</p>
      </div>
      {!disabled && <span className="text-gray-400 text-xl shrink-0">→</span>}
    </Link>
  )
}

function QuizSparkline({ sessions }: { sessions: QuizSession[] }) {
  const sorted = [...sessions].reverse()
  const W = 300
  const H = 50
  const PAD = 8
  const xStep = sorted.length > 1 ? (W - 2 * PAD) / (sorted.length - 1) : 0
  const yScale = (score: number) => PAD + (1 - score / QUIZ_SIZE) * (H - 2 * PAD)
  const thresholdY = yScale(PASS_THRESHOLD)

  const points = sorted
    .map((s, i) => `${PAD + i * xStep},${yScale(s.score ?? 0)}`)
    .join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12" aria-hidden="true">
      <line x1={PAD} y1={thresholdY} x2={W - PAD} y2={thresholdY}
        stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 3" />
      {sorted.length > 1 && (
        <polyline points={points} fill="none" stroke="#a5b4fc" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      )}
      {sorted.map((s, i) => (
        <circle key={s.id}
          cx={PAD + i * xStep}
          cy={yScale(s.score ?? 0)}
          r="4"
          fill={s.passed ? '#22c55e' : '#ef4444'}
        />
      ))}
    </svg>
  )
}
