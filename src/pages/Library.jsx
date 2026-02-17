import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Tag } from 'lucide-react'
import { concepts } from '../data/concepts'

const categories = ['Semua', 'Asas', 'Strategi', 'Bahasa', 'Teknik', 'Model']

export default function Library() {
  const { conceptId } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')

  // Detail view
  if (conceptId) {
    const concept = concepts.find((c) => c.id === conceptId)
    if (!concept) return <div className="p-6 text-center text-dark-muted">Konsep tidak ditemui.</div>

    const related = concepts.filter((c) => concept.relatedConcepts.includes(c.id))

    return (
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/library')} className="p-2 -ml-2 rounded-xl hover:bg-dark-card transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-accent text-xs font-semibold">{concept.category}</p>
            <h1 className="text-lg font-bold">{concept.title}</h1>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 mb-5">
          <p className="text-sm leading-relaxed text-dark-muted">{concept.content}</p>
        </div>

        {related.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-3">Konsep Berkaitan</h3>
            <div className="space-y-2">
              {related.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate(`/library/${r.id}`)}
                  className="w-full text-left bg-dark-card border border-dark-border rounded-xl p-3 flex items-center gap-3 active:scale-[0.98] transition-transform"
                >
                  <Tag size={16} className="text-accent flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{r.title}</p>
                    <p className="text-dark-muted text-xs truncate">{r.summary}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // List view
  const filtered = concepts.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'Semua' || c.category === activeCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-1">Pustaka NLP</h1>
      <p className="text-dark-muted text-sm mb-5">Rujukan konsep dan teknik NLP</p>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
        <input
          type="text"
          placeholder="Cari konsep..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-dark-card border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder-dark-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-accent text-white'
                : 'bg-dark-card border border-dark-border text-dark-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Concepts List */}
      <div className="space-y-2.5">
        {filtered.map((concept) => (
          <button
            key={concept.id}
            onClick={() => navigate(`/library/${concept.id}`)}
            className="w-full text-left bg-dark-card border border-dark-border rounded-xl p-4 transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-accent font-bold text-sm">{concept.title[0]}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm">{concept.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-border/50 text-dark-muted">
                    {concept.category}
                  </span>
                </div>
                <p className="text-dark-muted text-xs leading-relaxed line-clamp-2">{concept.summary}</p>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-dark-muted text-sm py-8">Tiada konsep ditemui.</p>
        )}
      </div>
    </div>
  )
}
