import { useState } from 'react'
import { Brain, ArrowRight, Sparkles } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const steps = [
  {
    title: 'Selamat Datang',
    subtitle: 'NLP Modeling Trainer',
    description: 'Program latihan 6 minggu untuk menguasai teknik modeling NLP — seni menduplikasi kecemerlangan.',
    icon: Brain,
  },
  {
    title: 'Apa Yang Anda Akan Pelajari',
    subtitle: 'Kemahiran Modeling',
    description: 'Asas modeling, strategi mental, corak bahasa, fisiologi, kepercayaan & nilai, dan integrasi penuh.',
    icon: Sparkles,
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [, setUserData] = useLocalStorage('userData', null)

  const handleStart = () => {
    if (name.trim()) {
      setUserData({
        name: name.trim(),
        startDate: new Date().toISOString(),
        completedLessons: [],
        journalEntries: [],
      })
    }
  }

  if (step < steps.length) {
    const current = steps[step]
    const Icon = current.icon
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-8">
          <Icon size={40} className="text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">{current.title}</h1>
        <p className="text-accent font-semibold text-sm mb-4">{current.subtitle}</p>
        <p className="text-dark-muted text-center text-sm leading-relaxed max-w-sm mb-12">
          {current.description}
        </p>
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-accent' : 'w-3 bg-dark-border'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setStep(step + 1)}
          className="flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Seterusnya <ArrowRight size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-8">
        <Brain size={40} className="text-accent" />
      </div>
      <h1 className="text-2xl font-bold text-center mb-2">Siapa Nama Anda?</h1>
      <p className="text-dark-muted text-center text-sm mb-8">
        Kami akan peribadikan pengalaman anda.
      </p>
      <input
        type="text"
        placeholder="Masukkan nama anda..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleStart()}
        className="w-full max-w-sm bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-center text-dark-text placeholder-dark-muted focus:outline-none focus:border-accent transition-colors mb-6"
        autoFocus
      />
      <button
        onClick={handleStart}
        disabled={!name.trim()}
        className="flex items-center gap-2 bg-accent hover:bg-accent-light disabled:opacity-40 disabled:hover:bg-accent text-white font-semibold px-8 py-3 rounded-xl transition-colors"
      >
        Mula Sekarang <ArrowRight size={18} />
      </button>
    </div>
  )
}
