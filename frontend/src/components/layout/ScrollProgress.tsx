import { motion } from 'framer-motion'
import { useScrollProgress } from '@/hooks'

export function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-primary to-secondary"
      style={{ transform: `scaleX(${progress / 100})` }}
      aria-hidden="true"
    />
  )
}
