import type { CardStatus } from '@/types'

const styles: Record<CardStatus, string> = {
  new: 'bg-gray-100 text-gray-700',
  learning: 'bg-amber-100 text-amber-700',
  mastered: 'bg-green-100 text-green-700',
}

const labels: Record<CardStatus, string> = {
  new: 'New',
  learning: 'Learning',
  mastered: 'Mastered',
}

export default function StatusBadge({ status }: { status: CardStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
