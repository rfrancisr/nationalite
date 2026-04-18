import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import FlashcardsPage from './flashcards-page'
import type { Category, Question, UserProgress } from '@/types'

const mockCategories: Category[] = [
  { id: 'cat1', name: 'Principles of American Democracy', slug: 'principles', icon: '🏛️' },
]

const mockQuestions: Question[] = [
  { id: 'q1', number: 1, category_id: 'cat1', question: 'What is the supreme law?', answers: ['the Constitution'] },
  { id: 'q2', number: 2, category_id: 'cat1', question: 'What does the Constitution do?', answers: ['sets up the government'] },
]

const now = new Date().toISOString()
const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

const mockProgress: UserProgress[] = [
  { id: 'up1', user_id: 'u1', question_id: 'q1', status: 'learning', ease_factor: 2.5, interval_days: 3, next_review_at: pastDate, review_count: 1, correct_count: 1, updated_at: now },
  { id: 'up2', user_id: 'u1', question_id: 'q2', status: 'new', ease_factor: 2.5, interval_days: 1, next_review_at: pastDate, review_count: 0, correct_count: 0, updated_at: now },
]

const mockApplyRating = vi.fn()

vi.mock('@/hooks/use-categories', () => ({
  useCategories: () => ({ data: mockCategories, isLoading: false }),
}))
vi.mock('@/hooks/use-questions', () => ({
  useQuestions: () => ({ data: mockQuestions, isLoading: false }),
}))
vi.mock('@/hooks/use-user-progress', () => ({
  useUserProgress: () => ({ data: mockProgress, isLoading: false }),
}))
vi.mock('@/hooks/use-apply-rating', () => ({
  useApplyRating: () => ({ mutateAsync: mockApplyRating, isPending: false }),
}))

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('FlashcardsPage', () => {
  beforeEach(() => mockApplyRating.mockResolvedValue(undefined))

  it('shows deck selection screen initially', () => {
    wrap(<FlashcardsPage />)
    expect(screen.getByText(/choose a deck/i)).toBeInTheDocument()
  })

  it('shows All Cards, Due Today, and category deck options', () => {
    wrap(<FlashcardsPage />)
    expect(screen.getByText(/all cards/i)).toBeInTheDocument()
    expect(screen.getByText(/due today/i)).toBeInTheDocument()
    expect(screen.getByText('Principles of American Democracy')).toBeInTheDocument()
  })

  it('starts session and shows first card after selecting All Cards', () => {
    wrap(<FlashcardsPage />)
    fireEvent.click(screen.getByText(/all cards/i))
    expect(screen.getByText(/What is the supreme law/i)).toBeInTheDocument()
  })

  it('shows progress indicator during session', () => {
    wrap(<FlashcardsPage />)
    fireEvent.click(screen.getByText(/all cards/i))
    expect(screen.getByText(/1\s*\/\s*2/)).toBeInTheDocument()
  })

  it('reveals answer and rating buttons after flipping card', () => {
    wrap(<FlashcardsPage />)
    fireEvent.click(screen.getByText(/all cards/i))
    fireEvent.click(screen.getByRole('button', { name: /card question/i }))
    expect(screen.getByText('the Constitution')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /again/i })).toBeInTheDocument()
  })

  it('rating buttons are disabled until card is flipped', () => {
    wrap(<FlashcardsPage />)
    fireEvent.click(screen.getByText(/all cards/i))
    expect(screen.getByRole('button', { name: /again/i })).toBeDisabled()
  })

  it('advances to next card after rating', async () => {
    wrap(<FlashcardsPage />)
    fireEvent.click(screen.getByText(/all cards/i))
    fireEvent.click(screen.getByRole('button', { name: /card question/i }))
    fireEvent.click(screen.getByRole('button', { name: /good/i }))
    await screen.findByText(/What does the Constitution do/i)
    expect(screen.getByText(/2\s*\/\s*2/)).toBeInTheDocument()
  })

  it('shows summary screen after all cards are rated', async () => {
    wrap(<FlashcardsPage />)
    fireEvent.click(screen.getByText(/all cards/i))

    for (let i = 0; i < 2; i++) {
      fireEvent.click(screen.getByRole('button', { name: /card question/i }))
      fireEvent.click(screen.getByRole('button', { name: /good/i }))
      if (i < 1) await screen.findByText(/What does the Constitution do/i)
    }

    await screen.findByText(/session complete/i)
    expect(screen.getByText(/2 cards reviewed/i)).toBeInTheDocument()
  })
})
