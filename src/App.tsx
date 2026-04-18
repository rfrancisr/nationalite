import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import AppLayout from '@/components/layout/app-layout'
import ProtectedRoute from '@/components/protected-route'
import LoginPage from '@/pages/login-page'
import QuestionsPage from '@/pages/questions-page'
import CategoryPage from '@/pages/category-page'
import FlashcardsPage from '@/pages/flashcards-page'
import QuizPage from '@/pages/quiz-page'
import DashboardPage from '@/pages/dashboard-page'
import ProfilePage from '@/pages/profile-page'

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
        <Route path="/" element={<DashboardPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}
