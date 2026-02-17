import { useNavigate } from 'react-router-dom'
import { Brain, Lightbulb, MessageSquare, Activity, Shield, Star, Lock, CheckCircle2 } from 'lucide-react'
import { modules } from '../data/modules'
import { useLocalStorage } from '../hooks/useLocalStorage'
import ProgressRing from '../components/ProgressRing'

const iconMap = { Brain, Lightbulb, MessageSquare, Activity, Shield, Star }

export default function Program() {
  const navigate = useNavigate()
  const [userData] = useLocalStorage('userData', { completedLessons: [] })

  const getWeekProgress = (mod) => {
    const completed = mod.days.filter((d) =>
      userData.completedLessons?.includes(`${mod.id}-${d.id}`)
    ).length
    return { completed, total: mod.days.length, percent: Math.round((completed / mod.days.length) * 100) }
  }

  const isUnlocked = (mod) => {
    if (mod.id === 1) return true
    const prev = modules.find((m) => m.id === mod.id - 1)
    if (!prev) return true
    const prevProgress = getWeekProgress(prev)
    return prevProgress.completed >= Math.ceil(prevProgress.total * 0.5)
  }

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-1">Program Latihan</h1>
      <p className="text-dark-muted text-sm mb-6">6 minggu modeling NLP</p>

      <div className="space-y-3">
        {modules.map((mod) => {
          const Icon = iconMap[mod.icon] || Brain
          const prog = getWeekProgress(mod)
          const unlocked = isUnlocked(mod)
          const done = prog.percent === 100

          return (
            <button
              key={mod.id}
              onClick={() => unlocked && navigate(`/program/week/${mod.id}`)}
              disabled={!unlocked}
              className={`w-full text-left bg-dark-card border rounded-2xl p-4 transition-all ${
                unlocked
                  ? 'border-dark-border active:scale-[0.98]'
                  : 'border-dark-border/50 opacity-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  done ? 'bg-emerald-500/20' : 'bg-primary/20'
                }`}>
                  {!unlocked ? (
                    <Lock size={20} className="text-dark-muted" />
                  ) : done ? (
                    <CheckCircle2 size={22} className="text-emerald-400" />
                  ) : (
                    <Icon size={22} className="text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-accent text-xs font-semibold">MINGGU {mod.week}</span>
                  </div>
                  <h3 className="font-semibold text-sm truncate">{mod.title}</h3>
                  <p className="text-dark-muted text-xs mt-0.5 truncate">{mod.description}</p>
                </div>
                <div className="relative flex-shrink-0">
                  <ProgressRing progress={prog.percent} size={44} strokeWidth={4} />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                    {prog.completed}/{prog.total}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
