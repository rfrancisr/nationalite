import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuestions } from '@/hooks/use-questions'
import { useSaveQuizSession } from '@/hooks/use-save-quiz-session'
import { pickQuizQuestions, buildOptions, isCorrect } from '@/utils/quiz'
import { QUIZ_SIZE, PASS_THRESHOLD } from '@/utils/constants'
import type { Question, QuizAnswer } from '@/types'

type Phase = 'idle' | 'question' | 'feedback' | 'done'

export default function QuizPage() {
  const navigate = useNavigate()
  const { data: allQuestions = [] } = useQuestions()
  const { mutate: saveSession } = useSaveQuizSession()

  const [phase, setPhase] = useState<Phase>('idle')
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [chosenAnswer, setChosenAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [startedAt, setStartedAt] = useState('')

  const optionsMap = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const q of quizQuestions) {
      map.set(q.id, buildOptions(q, allQuestions))
    }
    return map
  }, [quizQuestions, allQuestions])

  function startQuiz() {
    const picked = pickQuizQuestions(allQuestions)
    setQuizQuestions(picked)
    setCurrentIndex(0)
    setAnswers([])
    setChosenAnswer(null)
    setStartedAt(new Date().toISOString())
    setPhase('question')
  }

  function handleChoose(answer: string) {
    const current = quizQuestions[currentIndex]
    const correct = isCorrect(answer, current)
    const newAnswer: QuizAnswer = { question_id: current.id, chosen_answer: answer, correct }
    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)
    setChosenAnswer(answer)
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
      setChosenAnswer(null)
      setPhase('question')
    }
  }

  // ── Idle ─────────────────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-6">
        <div className="text-5xl">📝</div>
        <h1 className="text-3xl font-bold text-gray-900">Practice Quiz</h1>
        <p className="text-gray-600">
          {QUIZ_SIZE} random questions · pass with {PASS_THRESHOLD}/{QUIZ_SIZE} correct
        </p>
        <button
          onClick={startQuiz}
          disabled={allQuestions.length === 0}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
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

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div
          className={`rounded-2xl p-6 text-center ${
            passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="text-5xl mb-2">{passed ? '🎉' : '📚'}</div>
          <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {score} / {quizQuestions.length}
          </div>
          <div className={`text-xl font-semibold mt-1 ${passed ? 'text-green-700' : 'text-red-700'}`}>
            {passed ? 'Passed!' : 'Not yet — keep studying'}
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={startQuiz}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Try again
          </button>
          {missedIds.length > 0 && (
            <button
              onClick={() => navigate('/flashcards', { state: { missedIds } })}
              className="px-5 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Study {missedIds.length} missed
            </button>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Answer review</h2>
          {quizQuestions.map((q, i) => {
            const a = answers.find((ans) => ans.question_id === q.id)
            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border ${
                  a?.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {i + 1}. {q.question}
                </p>
                {!a?.correct && (
                  <p className="text-sm text-red-700">Your answer: {a?.chosen_answer}</p>
                )}
                <p className={`text-sm font-medium ${a?.correct ? 'text-green-700' : 'text-gray-700'}`}>
                  Correct: {q.answers[0]}
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
  const isLast = currentIndex + 1 >= quizQuestions.length

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Question {currentIndex + 1} of {quizQuestions.length}</span>
          <span>{answers.filter((a) => a.correct).length} correct</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${(currentIndex / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <p className="text-lg font-medium text-gray-900">{current.question}</p>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          let cls = 'w-full text-left p-4 rounded-xl border font-medium transition-colors '
          if (phase === 'feedback') {
            if (isCorrect(option, current)) {
              cls += 'border-green-400 bg-green-50 text-green-800'
            } else if (option === chosenAnswer) {
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
              onClick={() => phase === 'question' && handleChoose(option)}
              disabled={phase === 'feedback'}
              className={cls}
            >
              {option}
            </button>
          )
        })}
      </div>

      {phase === 'feedback' && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          {isLast ? 'See results' : 'Next question'}
        </button>
      )}
    </div>
  )
}
