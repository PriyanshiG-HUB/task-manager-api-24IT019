import { motion } from 'framer-motion'
import {
  SiReact,
  SiPython,
  SiTypescript,
  SiFastapi,
  SiGithub,
} from 'react-icons/si'
import { FaJava, FaBrain } from 'react-icons/fa'

const icons = [
  { Icon: SiReact, color: '#61DAFB', x: '10%', y: '20%', delay: 0 },
  { Icon: SiPython, color: '#3776AB', x: '85%', y: '15%', delay: 0.5 },
  { Icon: SiTypescript, color: '#3178C6', x: '75%', y: '70%', delay: 1 },
  { Icon: SiFastapi, color: '#009688', x: '15%', y: '75%', delay: 1.5 },
  { Icon: SiGithub, color: 'var(--color-text-primary)', x: '50%', y: '10%', delay: 0.8 },
  { Icon: FaJava, color: '#ED8B00', x: '90%', y: '45%', delay: 1.2 },
  { Icon: FaBrain, color: '#8B5CF6', x: '5%', y: '45%', delay: 0.3 },
]

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {icons.map(({ Icon, color, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: x, top: y }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay,
            ease: 'easeInOut',
          }}
        >
          <Icon className="h-8 w-8 opacity-20" style={{ color }} />
        </motion.div>
      ))}
    </div>
  )
}

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #F8FAFC 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}
