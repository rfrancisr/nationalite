import type { CardStatus, SM2Rating } from '@/types'
import {
  SM2_MIN_EASE,
  SM2_INITIAL_EASE,
  MASTERED_INTERVAL_DAYS,
} from './constants'

interface CardState {
  ease_factor: number
  interval_days: number
  status: CardStatus
}

interface UpdatedCardState extends CardState {
  next_review_at: string
}

export function applyRating(card: CardState, rating: SM2Rating): UpdatedCardState {
  let { ease_factor, interval_days } = card

  switch (rating) {
    case 'again':
      interval_days = 1
      ease_factor = Math.max(SM2_MIN_EASE, ease_factor - 0.2)
      break
    case 'hard':
      interval_days = Math.round(interval_days * 1.2)
      ease_factor = Math.max(SM2_MIN_EASE, ease_factor - 0.15)
      break
    case 'good':
      interval_days = Math.round(interval_days * ease_factor)
      break
    case 'easy':
      interval_days = Math.round(interval_days * ease_factor * 1.3)
      ease_factor = ease_factor + 0.1
      break
  }

  if (rating === 'good' || rating === 'easy') {
    ease_factor = Math.max(ease_factor, SM2_INITIAL_EASE)
  }

  const status: CardStatus =
    card.status === 'new'
      ? 'learning'
      : interval_days >= MASTERED_INTERVAL_DAYS
        ? 'mastered'
        : 'learning'

  const next_review_at =
    rating === 'again' || rating === 'hard'
      ? new Date().toISOString()
      : new Date(Date.now() + interval_days * 24 * 60 * 60 * 1000).toISOString()

  return { ease_factor, interval_days, status, next_review_at }
}
