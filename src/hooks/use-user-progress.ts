import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import type { UserProgress, CardStatus } from '@/types'
import { useAuthStore } from '@/stores/auth-store'

async function fetchUserProgress(userId: string): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  return data
}

export function useUserProgress() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['user_progress', user?.id],
    queryFn: () => fetchUserProgress(user!.id),
    enabled: !!user,
  })
}

export function useUpdateStatus() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async ({ questionId, status }: { questionId: string; status: CardStatus }) => {
      const { error } = await supabase
        .from('user_progress')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('user_id', user!.id)
        .eq('question_id', questionId)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user_progress'] }),
  })
}
