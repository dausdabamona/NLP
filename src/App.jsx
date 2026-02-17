import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Program from './pages/Program'
import WeekDetail from './pages/WeekDetail'
import DailyTask from './pages/DailyTask'
import Library from './pages/Library'
import Journal from './pages/Journal'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import BottomNav from './components/BottomNav'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useEffect } from 'react'

function App() {
  const [settings] = useLocalStorage('settings', { darkMode: true })
  const [userData] = useLocalStorage('userData', null)

  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.remove('light-mode')
    } else {
      document.body.classList.add('light-mode')
    }
  }, [settings.darkMode])

  if (!userData) {
    return <Onboarding />
  }

  return (
    <div className="pb-20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/program" element={<Program />} />
        <Route path="/program/week/:weekId" element={<WeekDetail />} />
        <Route path="/program/week/:weekId/day/:dayId" element={<DailyTask />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:conceptId" element={<Library />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App
