import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from './profile-page'
import type { UserProgress } from '@/types'

const mockSignOut = vi.fn()

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: (sel: (s: { user: { id: string; email: string } | null; signOut: () => void }) => unknown) =>
    sel({ user: { id: 'u1', email: 'alice@example.com' }, signOut: mockSignOut }),
}))

const mockProgress: UserProgress[] = [
  { id: 'up1', user_id: 'u1', question_id: 'q1', status: 'mastered', ease_factor: 2.5, interval_days: 21, next_review_at: '', review_count: 5, correct_count: 5, updated_at: '' },
  { id: 'up2', user_id: 'u1', question_id: 'q2', status: 'learning', ease_factor: 2.5, interval_days: 3, next_review_at: '', review_count: 2, correct_count: 1, updated_at: '' },
  { id: 'up3', user_id: 'u1', question_id: 'q3', status: 'new', ease_factor: 2.5, interval_days: 1, next_review_at: '', review_count: 0, correct_count: 0, updated_at: '' },
]

vi.mock('@/hooks/use-user-progress', () => ({
  useUserProgress: () => ({ data: mockProgress, isLoading: false }),
}))

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('ProfilePage', () => {
  it('shows the user email', () => {
    wrap(<ProfilePage />)
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('shows avatar initials derived from email', () => {
    wrap(<ProfilePage />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('shows mastered count next to Mastered label', () => {
    wrap(<ProfilePage />)
    const row = screen.getByText('Mastered').closest('div')!
    expect(row).toHaveTextContent('1')
  })

  it('shows learning count next to Learning label', () => {
    wrap(<ProfilePage />)
    const row = screen.getByText('Learning').closest('div')!
    expect(row).toHaveTextContent('1')
  })

  it('shows a sign out button', () => {
    wrap(<ProfilePage />)
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('calls signOut when sign out is clicked', () => {
    wrap(<ProfilePage />)
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    expect(mockSignOut).toHaveBeenCalledOnce()
  })
})
