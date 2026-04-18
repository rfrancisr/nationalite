import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Mock Supabase before importing the hook
const mockSelect = vi.fn()
const mockUpsert = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/utils/supabase', () => ({
  supabase: {
    from: (table: string) => {
      mockFrom(table)
      return {
        select: mockSelect,
        upsert: mockUpsert,
      }
    },
  },
}))

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: (sel: (s: { user: { id: string } | null }) => unknown) =>
    sel({ user: { id: 'user-123' } }),
}))

vi.mock('@/hooks/use-questions', () => ({
  useQuestions: () => ({
    data: [
      { id: 'q1', number: 1, category_id: 'cat1', question: 'Q1', answers: ['A1'] },
      { id: 'q2', number: 2, category_id: 'cat1', question: 'Q2', answers: ['A2'] },
    ],
  }),
}))

import { useInitProgress } from './use-init-progress'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return React.createElement(QueryClientProvider, { client: qc }, children)
}

describe('useInitProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not upsert when user already has progress rows', async () => {
    mockSelect.mockReturnValue({
      eq: () => ({ data: [{ id: 'up1' }, { id: 'up2' }], error: null }),
    })

    renderHook(() => useInitProgress(), { wrapper })

    await waitFor(() => expect(mockSelect).toHaveBeenCalled())
    expect(mockUpsert).not.toHaveBeenCalled()
  })

  it('upserts progress rows when user has none', async () => {
    mockSelect.mockReturnValue({
      eq: () => ({ data: [], error: null }),
    })
    mockUpsert.mockReturnValue({ error: null })

    renderHook(() => useInitProgress(), { wrapper })

    await waitFor(() => expect(mockUpsert).toHaveBeenCalled())
    const rows = mockUpsert.mock.calls[0][0] as Array<{ user_id: string; question_id: string; status: string }>
    expect(rows).toHaveLength(2)
    expect(rows[0].user_id).toBe('user-123')
    expect(rows[0].status).toBe('new')
  })
})
