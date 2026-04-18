import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import AppLayout from '@/components/layout/app-layout'
import ProtectedRoute from '@/components/protected-route'
import LoginPage from '@/pages/login-page'
import QuestionsPage from '@/pages/questions-page'
import CategoryPage from '@/pages/category-page'

function DashboardPlaceholder() {
  return <div className="p-8 text-2xl font-semibold text-indigo-600">Dashboard — coming in M5</div>
}

function FlashcardsPlaceholder() {
  return <div className="p-8 text-2xl font-semibold text-indigo-600">Flashcards — coming in M3</div>
}

function QuizPlaceholder() {
  return <div className="p-8 text-2xl font-semibold text-indigo-600">Quiz — coming in M4</div>
}

export default function App() {
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    const cleanup = init()
    return cleanup
  }, [init])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPlaceholder />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/flashcards" element={<FlashcardsPlaceholder />} />
        <Route path="/quiz" element={<QuizPlaceholder />} />
      </Route>
    </Routes>
  )
}
