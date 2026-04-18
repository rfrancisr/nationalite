import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { applyRating } from '@/utils/sm2'
import { useAuthStore } from '@/stores/auth-store'
import type { SM2Rating, UserProgress } from '@/types'

interface ApplyRatingArgs {
  progress: UserProgress
  rating: SM2Rating
}

export function useApplyRating() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async ({ progress, rating }: ApplyRatingArgs) => {
      const updated = applyRating(progress, rating)
      const { error } = await supabase
        .from('user_progress')
        .update({
          status: updated.status,
          ease_factor: updated.ease_factor,
          interval_days: updated.interval_days,
          next_review_at: updated.next_review_at,
          review_count: progress.review_count + 1,
          correct_count:
            rating !== 'again' ? progress.correct_count + 1 : progress.correct_count,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user!.id)
        .eq('question_id', progress.question_id)
      if (error) throw new Error(error.message)
      return updated
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user_progress'] }),
  })
}
