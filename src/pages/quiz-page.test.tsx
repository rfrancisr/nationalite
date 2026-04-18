import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import QuizPage from './quiz-page'
import type { Question } from '@/types'

const mockQuestions: Question[] = [
  { id: 'q1', number: 1, category_id: 'cat1', question: 'What is the supreme law?', answers: ['the Constitution'] },
  { id: 'q2', number: 2, category_id: 'cat1', question: 'What does the Constitution do?', answers: ['sets up the government'] },
]

const mockSave = vi.fn()
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})
vi.mock('@/hooks/use-questions', () => ({
  useQuestions: () => ({ data: mockQuestions }),
}))
vi.mock('@/hooks/use-save-quiz-session', () => ({
  useSaveQuizSession: () => ({ mutate: mockSave }),
}))
vi.mock('@/utils/quiz', async () => {
  const actual = await vi.importActual<typeof import('@/utils/quiz')>('@/utils/quiz')
  return {
    ...actual,
    pickQuizQuestions: (questions: Question[]) => questions,
    buildOptions: (q: Question) => [q.answers[0], 'Wrong A', 'Wrong B', 'Wrong C'],
  }
})

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('QuizPage', () => {
  beforeEach(() => mockSave.mockReset())

  it('shows idle screen with start button', () => {
    wrap(<QuizPage />)
    expect(screen.getByText(/practice quiz/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument()
  })

  it('shows quiz size and pass threshold', () => {
    wrap(<QuizPage />)
    expect(screen.getByText(/20.*questions/i)).toBeInTheDocument()
    expect(screen.getByText(/12/)).toBeInTheDocument()
  })

  it('shows first question after start', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    expect(screen.getByText(/What is the supreme law/i)).toBeInTheDocument()
  })

  it('shows progress bar and counter', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    expect(screen.getByText(/question 1/i)).toBeInTheDocument()
  })

  it('shows 4 answer options', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    expect(screen.getByText('the Constitution')).toBeInTheDocument()
    expect(screen.getByText('Wrong A')).toBeInTheDocument()
    expect(screen.getByText('Wrong B')).toBeInTheDocument()
    expect(screen.getByText('Wrong C')).toBeInTheDocument()
  })

  it('shows feedback and next button after choosing an option', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    fireEvent.click(screen.getByText('the Constitution'))
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument()
  })

  it('highlights correct answer in green during feedback', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    fireEvent.click(screen.getByText('Wrong A'))
    const correctBtn = screen.getByText('the Constitution').closest('button')
    expect(correctBtn?.className).toMatch(/green/)
  })

  it('advances to next question after clicking next', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    fireEvent.click(screen.getByText('the Constitution'))
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))
    expect(screen.getByText(/What does the Constitution do/i)).toBeInTheDocument()
  })

  it('shows results screen after last question', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    fireEvent.click(screen.getByText('the Constitution'))
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))
    fireEvent.click(screen.getByText('sets up the government'))
    fireEvent.click(screen.getByRole('button', { name: /see results/i }))

    expect(screen.getByText(/2\s*\/\s*2/)).toBeInTheDocument()
  })

  it('saves quiz session when quiz ends', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    fireEvent.click(screen.getByText('the Constitution'))
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))
    fireEvent.click(screen.getByText('sets up the government'))
    fireEvent.click(screen.getByRole('button', { name: /see results/i }))

    expect(mockSave).toHaveBeenCalledOnce()
  })

  it('shows try again button on results screen', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    fireEvent.click(screen.getByText('the Constitution'))
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))
    fireEvent.click(screen.getByText('sets up the government'))
    fireEvent.click(screen.getByRole('button', { name: /see results/i }))

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('shows study missed button when at least one answer is wrong', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    fireEvent.click(screen.getByText('Wrong A'))
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))
    fireEvent.click(screen.getByText('sets up the government'))
    fireEvent.click(screen.getByRole('button', { name: /see results/i }))

    expect(screen.getByRole('button', { name: /study 1 missed/i })).toBeInTheDocument()
  })

  it('does not show study missed button when all answers are correct', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    fireEvent.click(screen.getByText('the Constitution'))
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))
    fireEvent.click(screen.getByText('sets up the government'))
    fireEvent.click(screen.getByRole('button', { name: /see results/i }))

    expect(screen.queryByRole('button', { name: /study.*missed/i })).not.toBeInTheDocument()
  })

  it('navigates to /flashcards with missedIds when study missed is clicked', () => {
    wrap(<QuizPage />)
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    fireEvent.click(screen.getByText('Wrong A'))
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))
    fireEvent.click(screen.getByText('sets up the government'))
    fireEvent.click(screen.getByRole('button', { name: /see results/i }))

    fireEvent.click(screen.getByRole('button', { name: /study 1 missed/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/flashcards', { state: { missedIds: ['q1'] } })
  })
})
