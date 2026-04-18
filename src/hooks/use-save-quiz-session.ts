import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth-store'
import { PASS_THRESHOLD } from '@/utils/constants'
import type { QuizAnswer } from '@/types'

interface SaveQuizArgs {
  startedAt: string
  answers: QuizAnswer[]
}

export function useSaveQuizSession() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async ({ startedAt, answers }: SaveQuizArgs) => {
      const score = answers.filter((a) => a.correct).length
      const { error } = await supabase.from('quiz_sessions').insert({
        user_id: user!.id,
        started_at: startedAt,
        finished_at: new Date().toISOString(),
        score,
        passed: score >= PASS_THRESHOLD,
        answers,
      })
      if (error) throw new Error(error.message)
      return score
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quiz_sessions'] }),
  })
}
