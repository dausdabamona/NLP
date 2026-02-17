import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Clock, BookOpen, Dumbbell, PenLine } from 'lucide-react'
import { modules } from '../data/modules'
import { useLocalStorage } from '../hooks/useLocalStorage'

const typeConfig = {
  lesson: { icon: BookOpen, label: 'Pelajaran', color: 'text-blue-400 bg-blue-400/15' },
  practice: { icon: Dumbbell, label: 'Latihan', color: 'text-amber-400 bg-amber-400/15' },
  reflection: { icon: PenLine, label: 'Refleksi', color: 'text-purple-400 bg-purple-400/15' },
}

export default function WeekDetail() {
  const { weekId } = useParams()
  const navigate = useNavigate()
  const [userData] = useLocalStorage('userData', { completedLessons: [] })

  const mod = modules.find((m) => m.id === Number(weekId))
  if (!mod) return <div className="p-6 text-center text-dark-muted">Modul tidak ditemui.</div>

  const completedCount = mod.days.filter((d) =>
    userData.completedLessons?.includes(`${mod.id}-${d.id}`)
  ).length

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/program')} className="p-2 -ml-2 rounded-xl hover:bg-dark-card transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="text-accent text-xs font-semibold">MINGGU {mod.week}</p>
          <h1 className="text-lg font-bold">{mod.title}</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-dark-card rounded-xl p-4 border border-dark-border mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-dark-muted">Kemajuan</span>
          <span className="font-semibold">{completedCount} / {mod.days.length}</span>
        </div>
        <div className="h-2 bg-dark-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / mod.days.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Day List */}
      <div className="space-y-2.5">
        {mod.days.map((day) => {
          const isCompleted = userData.completedLessons?.includes(`${mod.id}-${day.id}`)
          const tc = typeConfig[day.type] || typeConfig.lesson
          const TypeIcon = tc.icon

          return (
            <button
              key={day.id}
              onClick={() => navigate(`/program/week/${mod.id}/day/${day.id}`)}
              className="w-full text-left bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]"
            >
              {isCompleted ? (
                <CheckCircle2 size={22} className="text-emerald-400 flex-shrink-0" />
              ) : (
                <Circle size={22} className="text-dark-border flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-dark-muted text-xs">Hari {day.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tc.color}`}>
                    {tc.label}
                  </span>
                </div>
                <h3 className={`font-semibold text-sm truncate ${isCompleted ? 'text-dark-muted line-through' : ''}`}>
                  {day.title}
                </h3>
                <p className="text-dark-muted text-xs truncate">{day.subtitle}</p>
              </div>
              <div className="flex items-center gap-1 text-dark-muted flex-shrink-0">
                <Clock size={12} />
                <span className="text-xs">{day.duration}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
