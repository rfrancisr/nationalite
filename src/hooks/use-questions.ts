import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import type { Question } from '@/types'

async function fetchQuestions(): Promise<Question[]> {
  const { data, error } = await supabase.from('questions').select('*').order('number')
  if (error) throw new Error(error.message)
  return data
}

export function useQuestions() {
  return useQuery({ queryKey: ['questions'], queryFn: fetchQuestions, staleTime: Infinity })
}
