import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-indigo-600">Loading…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
