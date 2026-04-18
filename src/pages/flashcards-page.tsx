import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/use-categories'
import { useQuestions } from '@/hooks/use-questions'
import { useUserProgress } from '@/hooks/use-user-progress'
import { useApplyRating } from '@/hooks/use-apply-rating'
import Flashcard from '@/components/flashcard'
import RatingButtons from '@/components/rating-buttons'
import type { SM2Rating, UserProgress, Question } from '@/types'

type DeckId = 'all' | 'due' | string // string = category id

interface SessionCard {
  question: Question
  progress: UserProgress
}

export default function FlashcardsPage() {
  const { data: categories = [] } = useCategories()
  const { data: questions = [] } = useQuestions()
  const { data: progress = [] } = useUserProgress()
  const { mutateAsync: applyRating, isPending } = useApplyRating()

  const [deckId, setDeckId] = useState<DeckId | null>(null)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [done, setDone] = useState(false)
  const [startTime] = useState(Date.now)

  const progressMap = useMemo(
    () => new Map(progress.map((p) => [p.question_id, p])),
    [progress],
  )

  const deck = useMemo((): SessionCard[] => {
    if (!deckId) return []

    const now = new Date()
    let filtered = questions

    if (deckId === 'due') {
      filtered = questions.filter((q) => {
        const p = progressMap.get(q.id)
        return !p || new Date(p.next_review_at) <= now
      })
    } else if (deckId !== 'all') {
      filtered = questions.filter((q) => q.category_id === deckId)
    }

    const cards: SessionCard[] = filtered.map((q) => ({
      question: q,
      progress: progressMap.get(q.id) ?? {
        id: '',
        user_id: '',
        question_id: q.id,
        status: 'new' as const,
        ease_factor: 2.5,
        interval_days: 1,
        next_review_at: now.toISOString(),
        review_count: 0,
        correct_count: 0,
        updated_at: now.toISOString(),
      },
    }))

    // overdue first
    return cards.sort(
      (a, b) =>
        new Date(a.progress.next_review_at).getTime() -
        new Date(b.progress.next_review_at).getTime(),
    )
  }, [deckId, questions, progressMap])

  async function handleRate(rating: SM2Rating) {
    const card = deck[index]
    await applyRating({ progress: card.progress, rating })
    setReviewedCount((c) => c + 1)

    if (index + 1 >= deck.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setFlipped(false)
    }
  }

  // ── Deck selection ──────────────────────────────────────────────────────────
  if (!deckId) {
    const dueCount = questions.filter((q) => {
      const p = progressMap.get(q.id)
      return !p || new Date(p.next_review_at) <= new Date()
    }).length

    return (
      <div className="max-w-lg mx-auto px-4 py-12 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Choose a deck</h1>
        <div className="space-y-3">
          <DeckButton
            label="All Cards"
            description={`${questions.length} questions`}
            onClick={() => { setDeckId('all'); setIndex(0); setFlipped(false); setDone(false) }}
          />
          <DeckButton
            label="Due Today"
            description={`${dueCount} cards overdue`}
            onClick={() => { setDeckId('due'); setIndex(0); setFlipped(false); setDone(false) }}
          />
          {categories.map((cat) => {
            const count = questions.filter((q) => q.category_id === cat.id).length
            return (
              <DeckButton
                key={cat.id}
                label={cat.name}
                description={`${count} questions`}
                icon={cat.icon}
                onClick={() => { setDeckId(cat.id); setIndex(0); setFlipped(false); setDone(false) }}
              />
            )
          })}
        </div>
      </div>
    )
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  if (done) {
    const elapsed = Math.round((Date.now() - startTime) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-6">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900">Session complete!</h1>
        <p className="text-gray-600">{reviewedCount} cards reviewed</p>
        <p className="text-gray-500 text-sm">
          Time: {minutes}m {seconds}s
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <button
            onClick={() => { setDeckId(null); setIndex(0); setReviewedCount(0); setDone(false) }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Study again
          </button>
          <Link
            to="/"
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    )
  }

  // ── Session ──────────────────────────────────────────────────────────────────
  const currentCard = deck[index]
  if (!currentCard) {
    return <div className="p-8 text-center text-gray-500">No cards in this deck.</div>
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <button onClick={() => setDeckId(null)} className="hover:text-indigo-600 transition-colors">
          ← Change deck
        </button>
        <span>
          {index + 1} / {deck.length}
        </span>
      </div>

      <Flashcard
        question={currentCard.question.question}
        answers={currentCard.question.answers}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
      />

      <RatingButtons onRate={handleRate} disabled={!flipped || isPending} />
    </div>
  )
}

function DeckButton({
  label,
  description,
  icon,
  onClick,
}: {
  label: string
  description: string
  icon?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-sm transition-all text-left"
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </button>
  )
}
