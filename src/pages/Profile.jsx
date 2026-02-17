import { Sun, Moon, RotateCcw, User, Calendar, BookOpen, Trophy } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { modules } from '../data/modules'
import ProgressRing from '../components/ProgressRing'

export default function Profile() {
  const [userData, setUserData] = useLocalStorage('userData', { name: 'User', completedLessons: [], startDate: null })
  const [settings, setSettings] = useLocalStorage('settings', { darkMode: true })

  const totalLessons = modules.reduce((sum, m) => sum + m.days.length, 0)
  const completedCount = userData.completedLessons?.length || 0
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const daysSinceStart = userData.startDate
    ? Math.max(1, Math.ceil((Date.now() - new Date(userData.startDate).getTime()) / 86400000))
    : 0

  const weeksCompleted = modules.filter((m) =>
    m.days.every((d) => userData.completedLessons?.includes(`${m.id}-${d.id}`))
  ).length

  const handleReset = () => {
    if (window.confirm('Adakah anda pasti mahu reset semua kemajuan? Tindakan ini tidak boleh dibatalkan.')) {
      setUserData({
        name: userData.name,
        startDate: new Date().toISOString(),
        completedLessons: [],
        journalEntries: [],
      })
    }
  }

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
          <User size={28} className="text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{userData.name}</h1>
          <p className="text-dark-muted text-sm">Pelajar NLP Modeling</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: Calendar, label: 'Hari', value: daysSinceStart, color: 'text-blue-400' },
          { icon: BookOpen, label: 'Pelajaran', value: completedCount, color: 'text-emerald-400' },
          { icon: Trophy, label: 'Minggu', value: weeksCompleted, color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-dark-card border border-dark-border rounded-xl p-3 text-center">
            <stat.icon size={18} className={`${stat.color} mx-auto mb-1.5`} />
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-dark-muted text-[10px]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-5 mb-5">
        <h3 className="font-semibold text-sm mb-4">Kemajuan Program</h3>
        <div className="flex items-center gap-4 mb-4">
          <ProgressRing progress={progress} size={80} strokeWidth={7} />
          <div>
            <p className="text-2xl font-bold">{progress}%</p>
            <p className="text-dark-muted text-xs">{completedCount} / {totalLessons} pelajaran</p>
          </div>
        </div>
        {/* Weekly breakdown */}
        <div className="space-y-2">
          {modules.map((mod) => {
            const done = mod.days.filter((d) => userData.completedLessons?.includes(`${mod.id}-${d.id}`)).length
            const pct = Math.round((done / mod.days.length) * 100)
            return (
              <div key={mod.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-dark-muted">M{mod.week}: {mod.title}</span>
                  <span className="font-medium">{done}/{mod.days.length}</span>
                </div>
                <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden mb-5">
        <h3 className="font-semibold text-sm px-5 pt-4 pb-2">Tetapan</h3>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setSettings((s) => ({ ...s, darkMode: !s.darkMode }))}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-dark-border/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            {settings.darkMode ? <Moon size={18} className="text-accent" /> : <Sun size={18} className="text-amber-400" />}
            <span className="text-sm">Mod {settings.darkMode ? 'Gelap' : 'Cerah'}</span>
          </div>
          <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.darkMode ? 'bg-accent' : 'bg-dark-border'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.darkMode ? 'left-5' : 'left-1'}`} />
          </div>
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <RotateCcw size={18} />
          <span className="text-sm">Reset Kemajuan</span>
        </button>
      </div>

      <p className="text-center text-dark-muted text-[10px]">NLP Modeling Trainer v1.0</p>
    </div>
  )
}
