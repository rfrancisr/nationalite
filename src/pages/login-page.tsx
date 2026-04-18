import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export default function LoginPage() {
  const { user, signInWithEmail } = useAuthStore()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = await signInWithEmail(email)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-5xl">📬</div>
          <h1 className="text-2xl font-semibold text-gray-900">Check your email</h1>
          <p className="text-gray-600">
            We sent a magic link to <strong>{email}</strong>. Click it to sign in.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-5xl mb-4">🇺🇸</div>
          <h1 className="text-3xl font-bold text-indigo-600">Citizenship Prep</h1>
          <p className="mt-2 text-gray-600">Sign in with your email to start studying.</p>
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
      </div>
    </div>
  )
}
