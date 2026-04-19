export type CardStatus = 'new' | 'learning' | 'mastered'
export type SM2Rating = 'again' | 'hard' | 'good' | 'easy'

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

export interface Question {
  id: string
  number: number
  category_id: string
  question: string
  answers: string[]
  hint?: string
}

export interface UserProgress {
  id: string
  user_id: string
  question_id: string
  status: CardStatus
  ease_factor: number
  interval_days: number
  next_review_at: string
  review_count: number
  correct_count: number
  updated_at: string
}

export interface QuizSession {
  id: string
  user_id: string
  started_at: string
  finished_at?: string
  score?: number
  passed?: boolean
  answers: QuizAnswer[]
}

export interface QuizAnswer {
  question_id: string
  chosen_answers: string[]
  correct: boolean
}

export interface ParsedQuestion {
  number: number
  question: string
  answers: string[]
}
