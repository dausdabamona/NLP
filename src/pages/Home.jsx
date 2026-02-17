import { useNavigate } from 'react-router-dom'
import { BookOpen, Library, NotebookPen, ChevronRight, Flame } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { modules } from '../data/modules'
import { quotes } from '../data/quotes'
import ProgressRing from '../components/ProgressRing'

export default function Home() {
  const navigate = useNavigate()
  const [userData] = useLocalStorage('userData', { name: 'User', completedLessons: [] })

  const totalLessons = modules.reduce((sum, m) => sum + m.days.length, 0)
  const completedCount = userData.completedLessons?.length || 0
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  // Determine current week/day
  const currentWeek = modules.find((m) =>
    m.days.some((d) => !userData.completedLessons?.includes(`${m.id}-${d.id}`))
  ) || modules[modules.length - 1]

  const currentDay = currentWeek.days.find(
    (d) => !userData.completedLessons?.includes(`${currentWeek.id}-${d.id}`)
  ) || currentWeek.days[0]

  // Daily quote based on date
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  const todayQuote = quotes[dayOfYear % quotes.length]

  // Streak calculation
  const streak = Math.min(completedCount, 42)

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-dark-muted text-sm">Selamat datang,</p>
          <h1 className="text-xl font-bold">{userData.name}</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-dark-card px-3 py-1.5 rounded-full border border-dark-border">
          <Flame size={16} className="text-orange-400" />
          <span className="text-sm font-semibold">{streak}</span>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-dark-card rounded-2xl p-5 border border-dark-border mb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <ProgressRing progress={progress} size={70} strokeWidth={6} />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {progress}%
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Kemajuan Keseluruhan</h3>
            <p className="text-dark-muted text-xs">
              {completedCount} / {totalLessons} pelajaran selesai
            </p>
            <p className="text-accent text-xs mt-1 font-medium">
              Minggu {currentWeek.week}: {currentWeek.title}
            </p>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <button
        onClick={() => navigate(`/program/week/${currentWeek.id}/day/${currentDay.id}`)}
        className="w-full bg-gradient-to-r from-primary to-primary-light rounded-2xl p-5 text-left mb-5 transition-transform active:scale-[0.98]"
      >
        <p className="text-white/70 text-xs font-medium mb-1">TERUSKAN BELAJAR</p>
        <h3 className="text-white font-bold text-lg mb-1">{currentDay.title}</h3>
        <p className="text-white/60 text-sm mb-3">{currentDay.subtitle}</p>
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full">
            {currentDay.duration}
          </span>
          <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full capitalize">
            {currentDay.type}
          </span>
        </div>
      </button>

      {/* Quote Card */}
      <div className="bg-dark-card rounded-2xl p-5 border border-dark-border mb-5">
        <p className="text-sm italic leading-relaxed mb-2">"{todayQuote.text}"</p>
        <p className="text-dark-muted text-xs">— {todayQuote.author}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: BookOpen, label: 'Program', path: '/program', color: 'text-blue-400' },
          { icon: Library, label: 'Pustaka', path: '/library', color: 'text-emerald-400' },
          { icon: NotebookPen, label: 'Jurnal', path: '/journal', color: 'text-purple-400' },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="bg-dark-card border border-dark-border rounded-xl p-4 flex flex-col items-center gap-2 transition-transform active:scale-95"
          >
            <item.icon size={22} className={item.color} />
            <span className="text-xs font-medium">{item.label}</span>
            <ChevronRight size={14} className="text-dark-muted" />
          </button>
        ))}
      </div>
    </div>
  )
}
