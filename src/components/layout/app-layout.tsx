import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

const navItems = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/questions', label: 'Browse', icon: '📚', end: false },
  { to: '/flashcards', label: 'Flashcards', icon: '🃏', end: false },
  { to: '/quiz', label: 'Quiz', icon: '✏️', end: false },
]

function NavItem({ to, label, icon, end }: { to: string; label: string; icon: string; end: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
        }`
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export default function AppLayout() {
  const { user, signOut } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 p-4 gap-1 shrink-0">
        <div className="text-lg font-bold text-indigo-600 mb-4 px-3">🇺🇸 Citizenship</div>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        <div className="mt-auto">
          <button
            onClick={signOut}
            className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >
            Sign out ({user?.email})
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom tab bar — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
