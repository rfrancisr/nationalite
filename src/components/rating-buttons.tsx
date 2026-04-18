import type { SM2Rating } from '@/types'

interface Props {
  onRate: (rating: SM2Rating) => void
  disabled?: boolean
}

const ratings: { rating: SM2Rating; label: string; description: string; className: string }[] = [
  { rating: 'again', label: 'Again', description: 'I forgot', className: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { rating: 'hard', label: 'Hard', description: 'Almost', className: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { rating: 'good', label: 'Good', description: 'Got it', className: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { rating: 'easy', label: 'Easy', description: 'Easy!', className: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
]

export default function RatingButtons({ onRate, disabled = false }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {ratings.map(({ rating, label, description, className }) => (
        <button
          key={rating}
          onClick={() => onRate(rating)}
          disabled={disabled}
          aria-label={`Rate ${label}: ${description}`}
          className={`flex flex-col items-center py-3 px-2 rounded-xl font-semibold text-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${className}`}
        >
          <span>{label}</span>
          <span className="text-xs font-normal opacity-70 mt-0.5">{description}</span>
        </button>
      ))}
    </div>
  )
}
