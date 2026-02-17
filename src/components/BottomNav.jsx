import { useLocation, useNavigate } from 'react-router-dom'
import { Home, BookOpen, Library, NotebookPen, User } from 'lucide-react'

const tabs = [
  { path: '/', icon: Home, label: 'Utama' },
  { path: '/program', icon: BookOpen, label: 'Program' },
  { path: '/library', icon: Library, label: 'Pustaka' },
  { path: '/journal', icon: NotebookPen, label: 'Jurnal' },
  { path: '/profile', icon: User, label: 'Profil' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-card border-t border-dark-border light-nav">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const active = isActive(tab.path)
          const Icon = tab.icon
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-accent'
                  : 'text-dark-muted hover:text-dark-text'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] ${active ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
      <style>{`
        body.light-mode .light-nav {
          background-color: var(--color-light-card);
          border-color: var(--color-light-border);
        }
        body.light-mode .light-nav .text-dark-muted {
          color: var(--color-light-muted);
        }
        body.light-mode .light-nav .hover\\:text-dark-text:hover {
          color: var(--color-light-text);
        }
      `}</style>
    </nav>
  )
}
