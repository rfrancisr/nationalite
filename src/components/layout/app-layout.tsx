import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { useInitProgress } from '@/hooks/use-init-progress'

const navItems = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/flashcards', label: 'Flashcards', icon: '🃏', end: false },
  { to: '/quiz', label: 'Quiz', icon: '✏️', end: false },
  { to: '/profile', label: 'Profile', icon: '👤', end: false },
]

function NavItem({ to, label, icon, end }: { to: string; label: string; icon: string; end: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
          isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export default function AppLayout() {
  const user = useAuthStore((s) => s.user)
  useInitProgress()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4 gap-1 shrink-0">
        <div className="text-xl font-bold text-indigo-600 mb-6 px-4">🇺🇸 Citizenship</div>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        <div className="mt-auto px-4 pb-1">
          <p className="text-sm text-gray-500 truncate" title={user?.email ?? ''}>
            {user?.email}
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pb-24 md:pb-0 min-h-screen overflow-auto">
        <Outlet />
      </main>

      {/* Bottom tab bar — mobile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex safe-area-inset-bottom"
        aria-label="Main navigation"
      >
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-3 min-h-[64px] text-sm font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-600'
              }`
            }
            aria-label={label}
          >
            <span className="text-2xl leading-none mb-1" aria-hidden="true">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
