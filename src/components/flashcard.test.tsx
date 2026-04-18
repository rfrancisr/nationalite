import { render, screen, fireEvent } from '@testing-library/react'
import Flashcard from './flashcard'

const question = 'What is the supreme law of the land?'
const answers = ['the Constitution']

describe('Flashcard', () => {
  it('shows the question on the front', () => {
    render(<Flashcard question={question} answers={answers} onFlip={() => {}} flipped={false} />)
    expect(screen.getByText(question)).toBeInTheDocument()
  })

  it('does not show answers when not flipped', () => {
    render(<Flashcard question={question} answers={answers} onFlip={() => {}} flipped={false} />)
    expect(screen.queryByText('the Constitution')).not.toBeInTheDocument()
  })

  it('shows answers when flipped', () => {
    render(<Flashcard question={question} answers={answers} onFlip={() => {}} flipped={true} />)
    expect(screen.getByText('the Constitution')).toBeInTheDocument()
  })

  it('calls onFlip when card is clicked', () => {
    const onFlip = vi.fn()
    render(<Flashcard question={question} answers={answers} onFlip={onFlip} flipped={false} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onFlip).toHaveBeenCalledOnce()
  })

  it('shows multiple answers when flipped', () => {
    const multi = ['answer one', 'answer two']
    render(<Flashcard question={question} answers={multi} onFlip={() => {}} flipped={true} />)
    expect(screen.getByText('answer one')).toBeInTheDocument()
    expect(screen.getByText('answer two')).toBeInTheDocument()
  })

  it('shows tap-to-reveal hint when not flipped', () => {
    render(<Flashcard question={question} answers={answers} onFlip={() => {}} flipped={false} />)
    expect(screen.getByText(/tap to reveal/i)).toBeInTheDocument()
  })
})
