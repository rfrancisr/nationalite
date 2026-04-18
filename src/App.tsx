import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-8 font-sans text-2xl font-semibold text-indigo-600">Citizenship Test Prep — M1 scaffold ✓</div>} />
    </Routes>
  )
}
