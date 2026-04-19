import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuestions } from '@/hooks/use-questions'
import { useCategories } from '@/hooks/use-categories'
import { useSaveQuizSession } from '@/hooks/use-save-quiz-session'
import {
  pickQuizQuestions,
  buildOptions,
  isCorrect,
  getRequiredAnswerCount,
  isCorrectMultiSelect,
} from '@/utils/quiz'
import { quizCategoryBreakdown } from '@/utils/quiz-analysis'
import { QUIZ_SIZE, PASS_THRESHOLD } from '@/utils/constants'
import type { Question, QuizAnswer } from '@/types'

type Phase = 'idle' | 'question' | 'feedback' | 'done'

export default function QuizPage() {
  const navigate = useNavigate()
  const { data: allQuestions = [] } = useQuestions()
  const { data: categories = [] } = useCategories()
  const { mutate: saveSession } = useSaveQuizSession()

  const [phase, setPhase] = useState<Phase>('idle')
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [chosenAnswers, setChosenAnswers] = useState<string[]>([])
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [startedAt, setStartedAt] = useState('')

  const optionsMap = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const q of quizQuestions) {
      const required = getRequiredAnswerCount(q)
      map.set(q.id, buildOptions(q, allQuestions, required))
    }
    return map
  }, [quizQuestions, allQuestions])

  function startQuiz() {
    const picked = pickQuizQuestions(allQuestions)
    setQuizQuestions(picked)
    setCurrentIndex(0)
    setAnswers([])
    setChosenAnswers([])
    setStartedAt(new Date().toISOString())
    setPhase('question')
  }

  function handleSubmit(selected: string[]) {
    const current = quizQuestions[currentIndex]
    const required = getRequiredAnswerCount(current)
    const correct = required > 1
      ? isCorrectMultiSelect(selected, current, required)
      : isCorrect(selected[0], current)
    const newAnswer: QuizAnswer = { question_id: current.id, chosen_answers: selected, correct }
    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)
    setChosenAnswers(selected)
    setPhase('feedback')

    if (currentIndex + 1 >= quizQuestions.length) {
      saveSession({ startedAt, answers: newAnswers })
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= quizQuestions.length) {
      setPhase('done')
    } else {
      setCurrentIndex((i) => i + 1)
      setChosenAnswers([])
      setPhase('question')
    }
  }

  // Keyboard shortcuts: 1-4 (single-answer only), Enter to advance
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (phase === 'question') {
        const current = quizQuestions[currentIndex]
        if (!current) return
        const required = getRequiredAnswerCount(current)
        if (required === 1) {
          const options = optionsMap.get(current.id) ?? []
          const idx = parseInt(e.key, 10) - 1
          if (idx >= 0 && idx < options.length) {
            handleSubmit([options[idx]])
          }
        }
      } else if (phase === 'feedback' && e.key === 'Enter') {
        handleNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIndex, quizQuestions, optionsMap])

  // ── Idle ─────────────────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-6">
        <div className="text-5xl">📝</div>
        <h1 className="text-3xl font-bold text-gray-900">Practice Quiz</h1>
        <p className="text-gray-700">
          {QUIZ_SIZE} random questions · pass with {PASS_THRESHOLD}/{QUIZ_SIZE} correct
        </p>
        <button
          onClick={startQuiz}
          disabled={allQuestions.length === 0}
          className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Start quiz
        </button>
      </div>
    )
  }

  // ── Done ─────────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const score = answers.filter((a) => a.correct).length
    const passed = score >= PASS_THRESHOLD
    const missedIds = quizQuestions
      .filter((q) => answers.find((a) => a.question_id === q.id && !a.correct))
      .map((q) => q.id)
    const categoryBreakdown = quizCategoryBreakdown(answers, quizQuestions, categories)
    const topMissedCat = categoryBreakdown[0]?.category ?? null

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Score banner */}
        <div
          className={`rounded-2xl p-8 text-center ${
            passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="text-5xl mb-3">{passed ? '🎉' : '📚'}</div>
          <div className={`text-5xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {score} / {quizQuestions.length}
          </div>
          <div className={`text-2xl font-semibold mt-2 ${passed ? 'text-green-700' : 'text-red-700'}`}>
            {passed ? 'Passed!' : 'Not yet — keep studying'}
          </div>
        </div>

        {/* Category breakdown */}
        {categoryBreakdown.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Where you struggled</h2>
            <div className="space-y-2">
              {categoryBreakdown.map(({ category, missed, total }, i) => (
                <div
                  key={category.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${
                    i === 0
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <span className="text-2xl shrink-0">{category.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-base font-semibold text-gray-900 truncate">
                        {category.name}
                      </span>
                      <span className={`text-sm font-medium shrink-0 ml-2 ${i === 0 ? 'text-red-700' : 'text-gray-600'}`}>
                        {missed}/{total} wrong
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${i === 0 ? 'bg-red-400' : 'bg-amber-400'}`}
                        style={{ width: `${(missed / total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {topMissedCat && (
              <p className="text-base text-gray-600">
                Your Morning Warm-up tomorrow will include these questions.
              </p>
            )}
          </section>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={startQuiz}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try again
          </button>
          {topMissedCat && (
            <button
              onClick={() => navigate('/flashcards', { state: { categoryId: topMissedCat.id } })}
              className="px-8 py-4 bg-amber-500 text-white rounded-xl font-semibold text-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Review {topMissedCat.icon} {topMissedCat.name}
            </button>
          )}
          {missedIds.length > 0 && !topMissedCat && (
            <button
              onClick={() => navigate('/flashcards', { state: { missedIds } })}
              className="px-8 py-4 bg-amber-500 text-white rounded-xl font-semibold text-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Study {missedIds.length} missed
            </button>
          )}
        </div>

        {/* Answer review */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Answer review</h2>
          {quizQuestions.map((q, i) => {
            const a = answers.find((ans) => ans.question_id === q.id)
            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border ${
                  a?.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <p className="font-medium text-gray-800 mb-1">
                  {i + 1}. {q.question}
                </p>
                {!a?.correct && a?.chosen_answers && (
                  <p className="text-red-700">Your answer: {a.chosen_answers.join(' + ')}</p>
                )}
                <p className={`font-medium ${a?.correct ? 'text-green-700' : 'text-gray-700'}`}>
                  Correct: {q.answers[0]}
                  {q.answers.length > 1 && getRequiredAnswerCount(q) > 1
                    ? ` (and ${getRequiredAnswerCount(q) - 1} more from the list)`
                    : ''}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Question / Feedback ──────────────────────────────────────────────────────
  const current = quizQuestions[currentIndex]
  const options = optionsMap.get(current.id) ?? []
  const required = getRequiredAnswerCount(current)
  const isMulti = required > 1
  const isLast = currentIndex + 1 >= quizQuestions.length
  const correctCount = answers.filter((a) => a.correct).length

  function toggleOption(option: string) {
    setChosenAnswers((prev) => {
      if (prev.includes(option)) return prev.filter((o) => o !== option)
      if (prev.length >= required) return prev
      return [...prev, option]
    })
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <div
          className="flex justify-between text-base text-gray-700 font-medium"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>Question {currentIndex + 1} of {quizQuestions.length}</span>
          <span>{correctCount} correct</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${(currentIndex / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <p className="text-lg font-medium text-gray-900">{current.question}</p>
      </div>

      {phase === 'question' && (
        <p className="text-sm text-gray-500 text-center">
          {isMulti
            ? `Select ${required} answers (${chosenAnswers.length}/${required} chosen)`
            : `Press 1–${options.length} to answer`}
        </p>
      )}

      <div className="space-y-3" role="group" aria-label="Answer options">
        {options.map((option, i) => {
          const isSelected = chosenAnswers.includes(option)
          const isOptionCorrect = isCorrect(option, current)

          if (isMulti) {
            let cls = 'w-full text-left p-4 rounded-xl border font-medium transition-colors text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 flex items-center gap-3 '
            if (phase === 'feedback') {
              if (isOptionCorrect && isSelected) {
                cls += 'border-green-400 bg-green-50 text-green-800'
              } else if (isOptionCorrect && !isSelected) {
                cls += 'border-green-300 bg-green-50 text-green-700'
              } else if (!isOptionCorrect && isSelected) {
                cls += 'border-red-400 bg-red-50 text-red-800'
              } else {
                cls += 'border-gray-200 bg-white text-gray-400'
              }
            } else {
              cls += isSelected
                ? 'border-indigo-500 bg-indigo-50 text-indigo-800 cursor-pointer'
                : 'border-gray-200 bg-white text-gray-800 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
            }
            return (
              <button
                key={option}
                onClick={() => phase === 'question' && toggleOption(option)}
                disabled={phase === 'feedback'}
                aria-label={`Option ${i + 1}: ${option}`}
                aria-pressed={isSelected}
                className={cls}
              >
                <span
                  className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                    phase === 'feedback'
                      ? isOptionCorrect
                        ? 'border-green-500 bg-green-500'
                        : isSelected
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                      : isSelected
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  }`}
                >
                  {(isSelected || (phase === 'feedback' && isOptionCorrect)) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {option}
              </button>
            )
          }

          // Single-answer: original button style
          let cls = 'w-full text-left p-3 rounded-xl border font-medium transition-colors text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 '
          if (phase === 'feedback') {
            if (isOptionCorrect) {
              cls += 'border-green-400 bg-green-50 text-green-800'
            } else if (option === chosenAnswers[0]) {
              cls += 'border-red-400 bg-red-50 text-red-800'
            } else {
              cls += 'border-gray-200 bg-white text-gray-400'
            }
          } else {
            cls += 'border-gray-200 bg-white text-gray-800 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
          }
          return (
            <button
              key={option}
              onClick={() => phase === 'question' && handleSubmit([option])}
              disabled={phase === 'feedback'}
              aria-label={`Option ${i + 1}: ${option}`}
              className={cls}
            >
              <span className="text-gray-400 font-normal mr-2">{i + 1}.</span>
              {option}
            </button>
          )
        })}
      </div>

      {phase === 'question' && isMulti && (
        <button
          onClick={() => chosenAnswers.length === required && handleSubmit(chosenAnswers)}
          disabled={chosenAnswers.length !== required}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-base hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers ({chosenAnswers.length}/{required} selected)
        </button>
      )}

      {phase === 'feedback' && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-base hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isLast ? 'See results' : 'Next question'}{' '}
          <span className="text-indigo-200 font-normal text-base ml-1">(Enter)</span>
        </button>
      )}
    </div>
  )
}
