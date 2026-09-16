import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollProgress } from './ScrollProgress'
import { BackToTop } from './BackToTop'
import { PageTransition } from './PageTransition'
import { CommandPalette } from './CommandPalette'

export function Layout() {
  const location = useLocation()

  return (
    <div className="relative min-h-screen flex flex-col">
      <ScrollProgress />
      <Navbar />
      <CommandPalette />
      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
