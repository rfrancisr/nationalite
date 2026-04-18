import { useAuthStore } from '@/stores/auth-store'
import { useUserProgress } from '@/hooks/use-user-progress'
import { TOTAL_QUESTIONS } from '@/utils/constants'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const { data: progress = [] } = useUserProgress()

  const initial = (user?.email?.[0] ?? '?').toUpperCase()
  const mastered = progress.filter((p) => p.status === 'mastered').length
  const learning = progress.filter((p) => p.status === 'learning').length
  const newCount = progress.filter((p) => p.status === 'new').length

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-8">
      {/* Avatar + email */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
          {initial}
        </div>
        <p className="text-gray-700 font-medium text-lg">{user?.email}</p>
      </div>

      {/* Progress stats */}
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        <StatRow label="Mastered" value={mastered} color="text-green-600" />
        <StatRow label="Learning" value={learning} color="text-amber-600" />
        <StatRow label="New" value={newCount} color="text-gray-500" />
        <StatRow label="Total questions" value={TOTAL_QUESTIONS} color="text-indigo-600" />
      </div>

      {/* Overall progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Overall mastery</span>
          <span>{Math.round((mastered / TOTAL_QUESTIONS) * 100)}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${(mastered / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="w-full py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-lg font-semibold ${color}`}>{value}</span>
    </div>
  )
}
