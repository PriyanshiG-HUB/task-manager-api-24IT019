import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiCommand } from 'react-icons/fi'
import { navLinks } from '@/lib/utils'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filtered = navLinks.filter((link) =>
    link.name.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (path: string) => {
    navigate(path)
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 hidden items-center gap-2 rounded-lg border border-white/10 bg-surface/80 px-3 py-2 text-xs text-text-secondary backdrop-blur-xl transition-colors hover:border-primary/30 hover:text-text-primary sm:flex"
        aria-label="Open command palette"
      >
        <FiSearch className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="ml-2 rounded border border-white/10 px-1.5 py-0.5 text-[10px]">
          <FiCommand className="inline h-2.5 w-2.5" />K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[20vh] px-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-lg rounded-xl border border-white/10 bg-surface shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4">
                <FiSearch className="h-4 w-4 text-text-secondary" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages..."
                  className="flex-1 bg-transparent py-4 text-sm text-text-primary placeholder:text-text-secondary/60 outline-none"
                />
              </div>
              <ul className="max-h-64 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-text-secondary">No results found</li>
                ) : (
                  filtered.map((link) => (
                    <li key={link.path}>
                      <button
                        onClick={() => handleSelect(link.path)}
                        className="flex w-full items-center px-4 py-3 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
