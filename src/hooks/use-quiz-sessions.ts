import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth-store'
import type { QuizSession } from '@/types'

async function fetchQuizSessions(userId: string): Promise<QuizSession[]> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('started_at', since)
    .order('started_at', { ascending: false })
    .limit(20)
  if (error) throw new Error(error.message)
  return data
}

export function useQuizSessions() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['quiz_sessions', user?.id],
    queryFn: () => fetchQuizSessions(user!.id),
    enabled: !!user,
  })
}
