import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock, ChevronRight } from 'lucide-react'
import { modules } from '../data/modules'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function DailyTask() {
  const { weekId, dayId } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useLocalStorage('userData', { completedLessons: [] })

  const mod = modules.find((m) => m.id === Number(weekId))
  const day = mod?.days.find((d) => d.id === Number(dayId))

  if (!mod || !day) return <div className="p-6 text-center text-dark-muted">Pelajaran tidak ditemui.</div>

  const lessonKey = `${mod.id}-${day.id}`
  const isCompleted = userData.completedLessons?.includes(lessonKey)

  const toggleComplete = () => {
    setUserData((prev) => {
      const lessons = prev.completedLessons || []
      if (lessons.includes(lessonKey)) {
        return { ...prev, completedLessons: lessons.filter((l) => l !== lessonKey) }
      }
      return { ...prev, completedLessons: [...lessons, lessonKey] }
    })
  }

  // Next lesson
  const currentDayIndex = mod.days.findIndex((d) => d.id === day.id)
  const nextDay = mod.days[currentDayIndex + 1]
  const nextWeek = !nextDay ? modules.find((m) => m.id === mod.id + 1) : null

  return (
    <div className="px-4 pt-6 pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(`/program/week/${mod.id}`)} className="p-2 -ml-2 rounded-xl hover:bg-dark-card transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-accent text-xs font-semibold">Minggu {mod.week} · Hari {day.id}</p>
          <h1 className="text-lg font-bold truncate">{day.title}</h1>
        </div>
        <div className="flex items-center gap-1 text-dark-muted flex-shrink-0">
          <Clock size={14} />
          <span className="text-xs">{day.duration}</span>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-5 mb-8">
        {day.content.sections.map((section, i) => (
          <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <h2 className="font-bold text-base mb-3">{section.heading}</h2>
            <div className="text-sm text-dark-muted leading-relaxed whitespace-pre-line">
              {section.text.split('\n').map((line, j) => {
                const boldProcessed = line.split(/\*\*(.*?)\*\*/).map((part, k) =>
                  k % 2 === 1 ? <strong key={k} className="text-dark-text font-semibold">{part}</strong> : part
                )
                return <p key={j} className={j > 0 ? 'mt-1.5' : ''}>{boldProcessed}</p>
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Exercise */}
      {day.content.exercise && (
        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-8">
          <h3 className="text-accent font-bold text-sm mb-2">Latihan Hari Ini</h3>
          <p className="text-sm text-dark-muted leading-relaxed">{day.content.exercise}</p>
        </div>
      )}

      {/* Complete Button */}
      <button
        onClick={toggleComplete}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
          isCompleted
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-accent hover:bg-accent-light text-white'
        }`}
      >
        <CheckCircle2 size={20} />
        {isCompleted ? 'Selesai ✓' : 'Tandakan Selesai'}
      </button>

      {/* Next Lesson */}
      {isCompleted && (nextDay || nextWeek) && (
        <button
          onClick={() => {
            if (nextDay) navigate(`/program/week/${mod.id}/day/${nextDay.id}`)
            else if (nextWeek) navigate(`/program/week/${nextWeek.id}`)
          }}
          className="w-full mt-3 flex items-center justify-between bg-dark-card border border-dark-border rounded-xl p-4 transition-all active:scale-[0.98]"
        >
          <div>
            <p className="text-dark-muted text-xs">Seterusnya</p>
            <p className="font-semibold text-sm">
              {nextDay ? nextDay.title : `Minggu ${nextWeek.week}: ${nextWeek.title}`}
            </p>
          </div>
          <ChevronRight size={18} className="text-dark-muted" />
        </button>
      )}
    </div>
  )
}
