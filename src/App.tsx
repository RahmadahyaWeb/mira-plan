import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Wizard from './pages/Wizard'
import Today from './pages/Today'
import Week from './pages/Week'
import MealPage from './pages/MealPage'
import Register from './pages/Register'
import ArtSheet from './pages/ArtSheet'

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <div className="min-h-svh overflow-x-clip pb-24 md:pb-0">
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plan" element={<Wizard />} />
          <Route path="/today" element={<Today />} />
          <Route path="/today/:key" element={<Today />} />
          <Route path="/week" element={<Week />} />
          <Route path="/meal/:id" element={<MealPage />} />
          {import.meta.env.DEV && <Route path="/_art" element={<ArtSheet />} />}
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
    </div>
  )
}
