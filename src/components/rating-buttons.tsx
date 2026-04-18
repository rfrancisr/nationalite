import type { SM2Rating } from '@/types'

interface Props {
  onRate: (rating: SM2Rating) => void
  disabled?: boolean
}

const ratings: { rating: SM2Rating; label: string; className: string }[] = [
  { rating: 'again', label: 'Again', className: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { rating: 'hard', label: 'Hard', className: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { rating: 'good', label: 'Good', className: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { rating: 'easy', label: 'Easy', className: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
]

export default function RatingButtons({ onRate, disabled = false }: Props) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {ratings.map(({ rating, label, className }) => (
        <button
          key={rating}
          onClick={() => onRate(rating)}
          disabled={disabled}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
