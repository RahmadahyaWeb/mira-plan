import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Wizard from './pages/Wizard'
import Today from './pages/Today'
import Week from './pages/Week'
import MealPage from './pages/MealPage'
import Library from './pages/Library'
import Login from './pages/Login'
import Register from './pages/Register'
import { PublicOnly, RequireAccount } from './guards'
import { useStore } from './store'
import ArtSheet from './pages/ArtSheet'

export default function App() {
  const { pathname } = useLocation()
  const { error } = useStore()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <div className="min-h-svh overflow-x-clip pb-24 md:pb-0">
      <Nav />
      {error && <p role="alert" className="bg-red-100 px-4 py-2 text-center font-bold text-red-900">{error}</p>}
      <main id="main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<PublicOnly />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<RequireAccount />}>
            <Route path="/plan" element={<Wizard />} />
            <Route path="/today" element={<Today />} />
            <Route path="/today/:key" element={<Today />} />
            <Route path="/week" element={<Week />} />
            <Route path="/meal/:id" element={<MealPage />} />
            <Route path="/library" element={<Library />} />
          </Route>
          {import.meta.env.DEV && <Route path="/_art" element={<ArtSheet />} />}
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
    </div>
  )
}
