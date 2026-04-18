import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from './dashboard-page'
import type { Category, Question, UserProgress, QuizSession } from '@/types'

const mockCategories: Category[] = [
  { id: 'cat1', name: 'Principles of American Democracy', slug: 'principles', icon: '🏛️' },
]

const mockQuestions: Question[] = [
  { id: 'q1', number: 1, category_id: 'cat1', question: 'Q1?', answers: ['A1'] },
  { id: 'q2', number: 2, category_id: 'cat1', question: 'Q2?', answers: ['A2'] },
]

const past = new Date(Date.now() - 86_400_000).toISOString()
const future = new Date(Date.now() + 86_400_000).toISOString()

const mockProgress: UserProgress[] = [
  { id: 'up1', user_id: 'u1', question_id: 'q1', status: 'mastered', ease_factor: 2.5, interval_days: 21, next_review_at: past, review_count: 5, correct_count: 5, updated_at: past },
  { id: 'up2', user_id: 'u1', question_id: 'q2', status: 'new', ease_factor: 2.5, interval_days: 1, next_review_at: future, review_count: 0, correct_count: 0, updated_at: past },
]

const mockSessions: QuizSession[] = [
  { id: 's1', user_id: 'u1', started_at: past, finished_at: past, score: 15, passed: true, answers: [] },
  { id: 's2', user_id: 'u1', started_at: past, finished_at: past, score: 9, passed: false, answers: [] },
]

vi.mock('@/hooks/use-categories', () => ({
  useCategories: () => ({ data: mockCategories }),
}))
vi.mock('@/hooks/use-questions', () => ({
  useQuestions: () => ({ data: mockQuestions }),
}))
vi.mock('@/hooks/use-user-progress', () => ({
  useUserProgress: () => ({ data: mockProgress }),
}))
vi.mock('@/hooks/use-quiz-sessions', () => ({
  useQuizSessions: () => ({ data: mockSessions }),
}))

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('DashboardPage', () => {
  it('shows page heading', () => {
    wrap(<DashboardPage />)
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('shows mastered count', () => {
    wrap(<DashboardPage />)
    expect(screen.getByText(/1.*mastered/i)).toBeInTheDocument()
  })

  it('shows due today count', () => {
    wrap(<DashboardPage />)
    // up1 has past next_review_at → 1 due; use aria-label to avoid ambiguity with session cards
    const statEl = screen.getByLabelText(/due today/i)
    expect(statEl.textContent).toMatch(/1/)
  })

  it('shows streak stat label', () => {
    wrap(<DashboardPage />)
    expect(screen.getByText(/streak/i)).toBeInTheDocument()
  })

  it('shows category breakdown', () => {
    wrap(<DashboardPage />)
    expect(screen.getByText('Principles of American Democracy')).toBeInTheDocument()
  })

  it('shows recent quiz scores', () => {
    wrap(<DashboardPage />)
    expect(screen.getByText(/15/)).toBeInTheDocument()
    expect(screen.getByText(/9/)).toBeInTheDocument()
  })

  it('shows start flashcards action link', () => {
    wrap(<DashboardPage />)
    expect(screen.getByRole('link', { name: /flashcard/i })).toBeInTheDocument()
  })

  it('shows take a quiz action link', () => {
    wrap(<DashboardPage />)
    expect(screen.getByRole('link', { name: /quiz/i })).toBeInTheDocument()
  })
})
