import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import QuestionsPage from './questions-page'
import type { Category, Question, UserProgress } from '@/types'

vi.mock('@/hooks/use-categories', () => ({
  useCategories: () => ({
    data: [
      { id: 'cat1', name: 'Principles of American Democracy', slug: 'principles', icon: '🏛️' },
      { id: 'cat2', name: 'System of Government', slug: 'government', icon: '⚖️' },
    ] satisfies Category[],
    isLoading: false,
  }),
}))

vi.mock('@/hooks/use-questions', () => ({
  useQuestions: () => ({
    data: [
      { id: 'q1', number: 1, category_id: 'cat1', question: 'What is the supreme law of the land?', answers: ['the Constitution'] },
      { id: 'q2', number: 2, category_id: 'cat1', question: 'What does the Constitution do?', answers: ['sets up the government', 'protects basic rights'] },
      { id: 'q3', number: 43, category_id: 'cat2', question: 'Who is in charge of the executive branch?', answers: ['the President'] },
    ] satisfies Question[],
    isLoading: false,
  }),
}))

vi.mock('@/hooks/use-user-progress', () => ({
  useUserProgress: () => ({
    data: [
      { id: 'up1', user_id: 'u1', question_id: 'q1', status: 'mastered', ease_factor: 2.5, interval_days: 21, next_review_at: '', review_count: 5, correct_count: 5, updated_at: '' },
      { id: 'up2', user_id: 'u1', question_id: 'q2', status: 'learning', ease_factor: 2.5, interval_days: 3, next_review_at: '', review_count: 2, correct_count: 1, updated_at: '' },
      { id: 'up3', user_id: 'u1', question_id: 'q3', status: 'new', ease_factor: 2.5, interval_days: 1, next_review_at: '', review_count: 0, correct_count: 0, updated_at: '' },
    ] satisfies UserProgress[],
    isLoading: false,
  }),
  useUpdateStatus: () => ({ mutate: vi.fn() }),
}))

describe('QuestionsPage', () => {
  it('renders the page heading', () => {
    render(<QuestionsPage />)
    expect(screen.getByText(/browse questions/i)).toBeInTheDocument()
  })

  it('shows all category headings', () => {
    render(<QuestionsPage />)
    expect(screen.getByText('Principles of American Democracy')).toBeInTheDocument()
    expect(screen.getByText('System of Government')).toBeInTheDocument()
  })

  it('shows question numbers and text', () => {
    render(<QuestionsPage />)
    expect(screen.getByText(/What is the supreme law/)).toBeInTheDocument()
    expect(screen.getByText(/Who is in charge/)).toBeInTheDocument()
  })

  it('shows status badges for questions', () => {
    render(<QuestionsPage />)
    // getAllByText because the status filter <select> also contains these labels
    expect(screen.getAllByText('Mastered').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Learning').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('New').length).toBeGreaterThanOrEqual(1)
  })

  it('filters by search text', () => {
    render(<QuestionsPage />)
    const search = screen.getByPlaceholderText(/search/i)
    fireEvent.change(search, { target: { value: 'supreme' } })
    expect(screen.getByText(/What is the supreme law/)).toBeInTheDocument()
    expect(screen.queryByText(/Who is in charge/)).not.toBeInTheDocument()
  })

  it('filters by category', () => {
    render(<QuestionsPage />)
    const select = screen.getByRole('combobox', { name: /category/i })
    fireEvent.change(select, { target: { value: 'cat2' } })
    expect(screen.queryByText(/What is the supreme law/)).not.toBeInTheDocument()
    expect(screen.getByText(/Who is in charge/)).toBeInTheDocument()
  })

  it('filters by status', () => {
    render(<QuestionsPage />)
    const select = screen.getByRole('combobox', { name: /status/i })
    fireEvent.change(select, { target: { value: 'mastered' } })
    expect(screen.getByText(/What is the supreme law/)).toBeInTheDocument()
    expect(screen.queryByText(/What does the Constitution do/)).not.toBeInTheDocument()
  })

  it('expands a question row to show answers on click', () => {
    render(<QuestionsPage />)
    const row = screen.getByText(/What is the supreme law/)
    expect(screen.queryByText('the Constitution')).not.toBeInTheDocument()
    fireEvent.click(row)
    expect(screen.getByText('the Constitution')).toBeInTheDocument()
  })
})
