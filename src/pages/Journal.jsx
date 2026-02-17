import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, PenLine } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Journal() {
  const [userData, setUserData] = useLocalStorage('userData', { journalEntries: [] })
  const [isWriting, setIsWriting] = useState(false)
  const [newEntry, setNewEntry] = useState('')
  const [newMood, setNewMood] = useState('neutral')
  const [expandedId, setExpandedId] = useState(null)

  const entries = userData.journalEntries || []

  const moods = [
    { value: 'great', emoji: '😊', label: 'Hebat' },
    { value: 'good', emoji: '🙂', label: 'Baik' },
    { value: 'neutral', emoji: '😐', label: 'Biasa' },
    { value: 'low', emoji: '😔', label: 'Rendah' },
    { value: 'struggle', emoji: '😤', label: 'Sukar' },
  ]

  const saveEntry = () => {
    if (!newEntry.trim()) return
    const entry = {
      id: Date.now(),
      text: newEntry.trim(),
      mood: newMood,
      date: new Date().toISOString(),
    }
    setUserData((prev) => ({
      ...prev,
      journalEntries: [entry, ...(prev.journalEntries || [])],
    }))
    setNewEntry('')
    setNewMood('neutral')
    setIsWriting(false)
  }

  const deleteEntry = (id) => {
    setUserData((prev) => ({
      ...prev,
      journalEntries: (prev.journalEntries || []).filter((e) => e.id !== id),
    }))
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })
  }

  const getMoodEmoji = (mood) => moods.find((m) => m.value === mood)?.emoji || '😐'

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Jurnal Refleksi</h1>
          <p className="text-dark-muted text-sm">{entries.length} catatan</p>
        </div>
        <button
          onClick={() => setIsWriting(!isWriting)}
          className={`p-2.5 rounded-xl transition-colors ${
            isWriting ? 'bg-red-500/20 text-red-400' : 'bg-accent/20 text-accent'
          }`}
        >
          {isWriting ? <ChevronUp size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {/* Write new entry */}
      {isWriting && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <PenLine size={16} className="text-accent" />
            <span className="text-sm font-semibold">Catatan Baru</span>
          </div>

          {/* Mood selector */}
          <div className="flex gap-2 mb-3">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setNewMood(m.value)}
                className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                  newMood === m.value
                    ? 'bg-accent/20 ring-1 ring-accent'
                    : 'bg-dark-border/30'
                }`}
              >
                <span className="text-lg">{m.emoji}</span>
                <span className="text-[10px] text-dark-muted">{m.label}</span>
              </button>
            ))}
          </div>

          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Tuliskan refleksi, pemerhatian, atau insight anda hari ini..."
            rows={4}
            className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-sm placeholder-dark-muted focus:outline-none focus:border-accent transition-colors resize-none"
            autoFocus
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={saveEntry}
              disabled={!newEntry.trim()}
              className="bg-accent hover:bg-accent-light disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="text-center py-16">
          <PenLine size={40} className="text-dark-border mx-auto mb-4" />
          <p className="text-dark-muted text-sm">Belum ada catatan jurnal.</p>
          <p className="text-dark-muted text-xs mt-1">Tekan + untuk mula menulis.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const isExpanded = expandedId === entry.id
            return (
              <div
                key={entry.id}
                className="bg-dark-card border border-dark-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="w-full text-left p-4 flex items-start gap-3"
                >
                  <span className="text-xl flex-shrink-0">{getMoodEmoji(entry.mood)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {entry.text}
                    </p>
                    <p className="text-dark-muted text-xs mt-1.5">
                      {formatDate(entry.date)} · {formatTime(entry.date)}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-dark-muted flex-shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {isExpanded && (
                  <div className="px-4 pb-3 flex justify-end">
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-400/70 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={12} />
                      Padam
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
