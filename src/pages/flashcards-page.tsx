import { useState, useMemo, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCategories } from '@/hooks/use-categories'
import { useQuestions } from '@/hooks/use-questions'
import { useUserProgress } from '@/hooks/use-user-progress'
import { useApplyRating } from '@/hooks/use-apply-rating'
import Flashcard from '@/components/flashcard'
import RatingButtons from '@/components/rating-buttons'
import { buildOptions, isCorrect } from '@/utils/quiz'
import type { SM2Rating, UserProgress, Question } from '@/types'

type DeckId = 'all' | 'due' | 'missed' | 'studied' | string // string = category id
type CardPhase = 'flashcard' | 'mc' | 'recall'

interface SessionCard {
  question: Question
  progress: UserProgress
}

export default function FlashcardsPage() {
  const location = useLocation()
  const { missedIds, studiedIds, categoryId, preselectedDeck, mixed } = useMemo(() => {
    const state = location.state as {
      missedIds?: string[]
      studiedIds?: string[]
      categoryId?: string
      preselectedDeck?: DeckId
      mixed?: boolean
    } | null
    return {
      missedIds: state?.missedIds ?? null,
      studiedIds: state?.studiedIds ?? null,
      categoryId: state?.categoryId ?? null,
      preselectedDeck: state?.preselectedDeck ?? null,
      mixed: state?.mixed ?? false,
    }
  }, [location.state])

  const { data: categories = [] } = useCategories()
  const { data: questions = [] } = useQuestions()
  const { data: progress = [] } = useUserProgress()
  const { mutateAsync: applyRating, isPending } = useApplyRating()

  const [deckId, setDeckId] = useState<DeckId | null>(null)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [cardPhase, setCardPhase] = useState<CardPhase>('flashcard')
  const [reviewedCount, setReviewedCount] = useState(0)
  const [done, setDone] = useState(false)
  const [startTime] = useState(Date.now)

  useEffect(() => {
    if (missedIds && missedIds.length > 0) {
      setDeckId('missed')
      setIndex(0); setFlipped(false); setCardPhase('flashcard'); setDone(false)
    } else if (studiedIds && studiedIds.length > 0) {
      setDeckId('studied')
      setIndex(0); setFlipped(false); setCardPhase('flashcard'); setDone(false)
    } else if (preselectedDeck) {
      setDeckId(preselectedDeck)
      setIndex(0); setFlipped(false); setCardPhase('flashcard'); setDone(false)
    } else if (categoryId) {
      setDeckId(categoryId)
      setIndex(0); setFlipped(false); setCardPhase('flashcard'); setDone(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    } else if (deckId === 'missed') {
      filtered = questions.filter((q) => missedIds?.includes(q.id))
    } else if (deckId === 'studied') {
      filtered = questions.filter((q) => studiedIds?.includes(q.id))
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
  }, [deckId, questions, progressMap, missedIds, studiedIds])

  function advanceCard() {
    if (index + 1 >= deck.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setFlipped(false)
      setCardPhase('flashcard')
    }
  }

  async function handleRate(rating: SM2Rating) {
    const card = deck[index]
    await applyRating({ progress: card.progress, rating })
    setReviewedCount((c) => c + 1)
    advanceCard()
  }

  function handleFlashcardContinue() {
    if (mixed) {
      setCardPhase('mc')
    }
    // in non-mixed mode, user rates directly — no continue button shown
  }

  function handleMcContinue() {
    setCardPhase('recall')
  }

  // ── Deck selection ──────────────────────────────────────────────────────────
  if (!deckId) {
    const dueCount = questions.filter((q) => {
      const p = progressMap.get(q.id)
      return !p || new Date(p.next_review_at) <= new Date()
    }).length

    return (
      <div className="max-w-lg mx-auto px-4 py-12 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Choose a deck</h1>
        <div className="space-y-3">
          <DeckButton
            label="All Cards"
            description={`${questions.length} questions`}
            onClick={() => { setDeckId('all'); setIndex(0); setFlipped(false); setCardPhase('flashcard'); setDone(false) }}
          />
          <DeckButton
            label="Due Today"
            description={`${dueCount} cards overdue`}
            onClick={() => { setDeckId('due'); setIndex(0); setFlipped(false); setCardPhase('flashcard'); setDone(false) }}
          />
          {categories.map((cat) => {
            const count = questions.filter((q) => q.category_id === cat.id).length
            return (
              <DeckButton
                key={cat.id}
                label={cat.name}
                description={`${count} questions`}
                icon={cat.icon}
                onClick={() => { setDeckId(cat.id); setIndex(0); setFlipped(false); setCardPhase('flashcard'); setDone(false) }}
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
        <h1 className="text-3xl font-bold text-gray-900">Session complete!</h1>
        <p className="text-xl text-gray-700">{reviewedCount} cards reviewed</p>
        <p className="text-base text-gray-600">
          Time: {minutes}m {seconds}s
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => { setDeckId(null); setIndex(0); setReviewedCount(0); setCardPhase('flashcard'); setDone(false) }}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Study again
          </button>
          <Link
            to="/"
            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
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
    return <div className="p-8 text-center text-gray-600">No cards in this deck.</div>
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between text-base text-gray-700">
        <button
          onClick={() => setDeckId(null)}
          className="py-2 pr-3 font-medium hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
        >
          ← Change deck
        </button>
        <div className="flex items-center gap-3">
          {mixed && (
            <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
              {cardPhase === 'flashcard' ? 'Step 1: Read' : cardPhase === 'mc' ? 'Step 2: Choose' : 'Step 3: Recall'}
            </span>
          )}
          <span
            className="font-semibold"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Card ${index + 1} of ${deck.length}`}
          >
            {index + 1} / {deck.length}
          </span>
        </div>
      </div>

      {cardPhase === 'flashcard' && (
        <>
          <Flashcard
            question={currentCard.question.question}
            answers={currentCard.question.answers}
            flipped={flipped}
            onFlip={() => setFlipped((f) => !f)}
          />
          {mixed ? (
            <button
              onClick={handleFlashcardContinue}
              disabled={!flipped}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Continue →
            </button>
          ) : (
            <RatingButtons onRate={handleRate} disabled={!flipped || isPending} />
          )}
        </>
      )}

      {cardPhase === 'mc' && (
        <MultipleChoicePhase
          question={currentCard.question}
          allQuestions={questions}
          onContinue={handleMcContinue}
        />
      )}

      {cardPhase === 'recall' && (
        <FreeRecallPhase
          question={currentCard.question}
          onContinue={(rating) => handleRate(rating)}
          isPending={isPending}
        />
      )}
    </div>
  )
}

// ── Multiple Choice Phase ────────────────────────────────────────────────────

function MultipleChoicePhase({
  question,
  allQuestions,
  onContinue,
}: {
  question: Question
  allQuestions: Question[]
  onContinue: () => void
}) {
  const options = useMemo(() => buildOptions(question, allQuestions), [question, allQuestions])
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    if (selected) return
    setSelected(opt)
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <p className="text-xl font-semibold text-gray-900">{question.question}</p>
      </div>
      <div className="space-y-3">
        {options.map((opt) => {
          const correct = isCorrect(opt, question)
          const isSelected = opt === selected
          let style = 'bg-white border-gray-200 text-gray-900'
          if (selected) {
            if (correct) style = 'bg-green-50 border-green-500 text-green-800'
            else if (isSelected) style = 'bg-red-50 border-red-400 text-red-800'
            else style = 'bg-white border-gray-200 text-gray-400'
          }
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
              className={`w-full text-left px-5 py-4 border-2 rounded-xl text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${style}`}
            >
              {opt}
              {selected && correct && <span className="ml-2">✓</span>}
              {selected && isSelected && !correct && <span className="ml-2">✗</span>}
            </button>
          )
        })}
      </div>
      {selected && (
        <button
          onClick={onContinue}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Continue →
        </button>
      )}
    </div>
  )
}

// ── Free Recall Phase ────────────────────────────────────────────────────────

function FreeRecallPhase({
  question,
  onContinue,
  isPending,
}: {
  question: Question
  onContinue: (rating: SM2Rating) => void
  isPending: boolean
}) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const correct = checked ? isCorrect(value, question) : null

  function handleCheck() {
    if (value.trim()) setChecked(true)
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <p className="text-xl font-semibold text-gray-900">{question.question}</p>
      </div>

      <div className="space-y-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !checked && handleCheck()}
          disabled={checked}
          placeholder="Type your answer…"
          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 disabled:bg-gray-50"
          aria-label="Type the answer"
          autoFocus
        />

        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!value.trim()}
            className="w-full py-4 bg-gray-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Check answer
          </button>
        ) : (
          <div className="space-y-4">
            {correct ? (
              <div className="flex items-center gap-3 px-5 py-4 bg-green-50 border-2 border-green-400 rounded-xl">
                <span className="text-2xl">✓</span>
                <p className="text-lg font-semibold text-green-800">Correct!</p>
              </div>
            ) : (
              <div className="px-5 py-4 bg-red-50 border-2 border-red-400 rounded-xl space-y-1">
                <p className="text-lg font-semibold text-red-800">Not quite</p>
                <p className="text-base text-gray-700">
                  Accepted: <span className="font-medium">{question.answers[0]}</span>
                </p>
              </div>
            )}

            <p className="text-base text-gray-600 text-center font-medium">How well did you know it?</p>
            <RatingButtons onRate={onContinue} disabled={isPending} />
          </div>
        )}
      </div>
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
      className="w-full flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-sm transition-all text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {icon && <span className="text-3xl">{icon}</span>}
      <div>
        <p className="text-lg font-semibold text-gray-900">{label}</p>
        <p className="text-base text-gray-600">{description}</p>
      </div>
    </button>
  )
}
