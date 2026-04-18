import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase'

interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  isRecovery: boolean
  init: () => () => void
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (password: string) => Promise<{ error: string | null }>
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,
  isRecovery: false,

  init: () => {
    supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session, user: data.session?.user ?? null, loading: false })
    }).catch(() => {
      set({ loading: false })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      set({
        session,
        user: session?.user ?? null,
        loading: false,
        isRecovery: event === 'PASSWORD_RECOVERY',
      })
    })

    return () => subscription.unsubscribe()
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }
    // Supabase returns no session when the email already exists (silent dedup)
    if (!data.session) return { error: 'An account with this email already exists. Please sign in instead.' }
    return { error: null }
  },

  signOut: async () => {
    await supabase.auth.signOut()
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error?.message ?? null }
  },

  updatePassword: async (password) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (!error) set({ isRecovery: false })
    return { error: error?.message ?? null }
  },
}))
