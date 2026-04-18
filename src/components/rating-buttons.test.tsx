import { render, screen, fireEvent } from '@testing-library/react'
import RatingButtons from './rating-buttons'

describe('RatingButtons', () => {
  it('renders all four rating buttons', () => {
    render(<RatingButtons onRate={() => {}} />)
    expect(screen.getByRole('button', { name: /again/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hard/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /good/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /easy/i })).toBeInTheDocument()
  })

  it('calls onRate with "again" when Again is clicked', () => {
    const onRate = vi.fn()
    render(<RatingButtons onRate={onRate} />)
    fireEvent.click(screen.getByRole('button', { name: /again/i }))
    expect(onRate).toHaveBeenCalledWith('again')
  })

  it('calls onRate with "hard" when Hard is clicked', () => {
    const onRate = vi.fn()
    render(<RatingButtons onRate={onRate} />)
    fireEvent.click(screen.getByRole('button', { name: /hard/i }))
    expect(onRate).toHaveBeenCalledWith('hard')
  })

  it('calls onRate with "good" when Good is clicked', () => {
    const onRate = vi.fn()
    render(<RatingButtons onRate={onRate} />)
    fireEvent.click(screen.getByRole('button', { name: /good/i }))
    expect(onRate).toHaveBeenCalledWith('good')
  })

  it('calls onRate with "easy" when Easy is clicked', () => {
    const onRate = vi.fn()
    render(<RatingButtons onRate={onRate} />)
    fireEvent.click(screen.getByRole('button', { name: /easy/i }))
    expect(onRate).toHaveBeenCalledWith('easy')
  })

  it('disables all buttons when disabled prop is true', () => {
    render(<RatingButtons onRate={() => {}} disabled />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => expect(btn).toBeDisabled())
  })
})
