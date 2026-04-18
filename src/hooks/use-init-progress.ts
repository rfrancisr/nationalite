import { useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth-store'
import { useQuestions } from '@/hooks/use-questions'

export function useInitProgress() {
  const user = useAuthStore((s) => s.user)
  const { data: questions } = useQuestions()

  useEffect(() => {
    if (!user || !questions?.length) return

    async function seed() {
      const { data: existing } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user!.id)

      if (existing && existing.length > 0) return

      const now = new Date().toISOString()
      const rows = questions!.map((q) => ({
        user_id: user!.id,
        question_id: q.id,
        status: 'new',
        ease_factor: 2.5,
        interval_days: 1,
        next_review_at: now,
        review_count: 0,
        correct_count: 0,
        updated_at: now,
      }))

      await supabase.from('user_progress').upsert(rows, {
        onConflict: 'user_id,question_id',
        ignoreDuplicates: true,
      })
    }

    seed()
  }, [user, questions])
}
