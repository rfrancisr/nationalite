import { render, screen } from '@testing-library/react'
import StatusBadge from './status-badge'

describe('StatusBadge', () => {
  it('renders "New" for new status', () => {
    render(<StatusBadge status="new" />)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders "Learning" for learning status', () => {
    render(<StatusBadge status="learning" />)
    expect(screen.getByText('Learning')).toBeInTheDocument()
  })

  it('renders "Mastered" for mastered status', () => {
    render(<StatusBadge status="mastered" />)
    expect(screen.getByText('Mastered')).toBeInTheDocument()
  })

  it('applies distinct color classes per status', () => {
    const { rerender } = render(<StatusBadge status="new" />)
    const newBadge = screen.getByText('New')
    expect(newBadge.className).toContain('gray')

    rerender(<StatusBadge status="learning" />)
    expect(screen.getByText('Learning').className).toContain('amber')

    rerender(<StatusBadge status="mastered" />)
    expect(screen.getByText('Mastered').className).toContain('green')
  })
})
