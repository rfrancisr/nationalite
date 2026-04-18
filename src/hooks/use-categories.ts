import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import type { Category } from '@/types'

async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) throw new Error(error.message)
  return data
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: fetchCategories, staleTime: Infinity })
}
