import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export default function LoginPage() {
  const { user, signIn, signUp, resetPassword } = useAuthStore()
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (mode === 'forgot') {
      const result = await resetPassword(email)
      setSubmitting(false)
      if (result.error) setError(result.error)
      else setResetSent(true)
      return
    }

    const result = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password)
    setSubmitting(false)
    if (result.error) setError(result.error)
  }

  function switchMode(next: 'signin' | 'signup' | 'forgot') {
    setMode(next)
    setError(null)
    setResetSent(false)
  }

  if (resetSent) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-5xl">📧</div>
        <h2 className="text-2xl font-bold text-indigo-600">Check your email</h2>
        <p className="text-gray-600">We sent a password reset link to <strong>{email}</strong>.</p>
        <button type="button" onClick={() => switchMode('signin')} className="text-indigo-600 font-medium hover:underline">
          Back to sign in
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-5xl mb-4">🇺🇸</div>
          <h1 className="text-3xl font-bold text-indigo-600">Citizenship Prep</h1>
          <p className="mt-2 text-gray-600">
            {mode === 'signin' && 'Sign in to continue studying.'}
            {mode === 'signup' && 'Create an account to get started.'}
            {mode === 'forgot' && 'Enter your email to reset your password.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Email address"
          />
          {mode !== 'forgot' && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Password"
            />
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? '…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 space-y-2">
          {mode === 'signin' && (
            <>
              <p>
                Don't have an account?{' '}
                <button type="button" onClick={() => switchMode('signup')} className="text-indigo-600 font-medium hover:underline">Sign up</button>
              </p>
              <p>
                <button type="button" onClick={() => switchMode('forgot')} className="text-indigo-600 font-medium hover:underline">Forgot password?</button>
              </p>
            </>
          )}
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('signin')} className="text-indigo-600 font-medium hover:underline">Sign in</button>
            </p>
          )}
          {mode === 'forgot' && (
            <p>
              <button type="button" onClick={() => switchMode('signin')} className="text-indigo-600 font-medium hover:underline">Back to sign in</button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
