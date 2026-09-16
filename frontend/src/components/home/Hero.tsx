import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiDownload, FiMail } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useTypingAnimation } from '@/hooks'
import { siteConfig } from '@/lib/utils'
import { AnimatedBackground, FloatingIcons } from './FloatingIcons'

const titles = [
  'Software Developer',
  'AI Enthusiast',
  'Open Source Contributor',
]

export function Hero() {
  const typedText = useTypingAnimation(titles, 80, 40, 2500)

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <AnimatedBackground />
      <FloatingIcons />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary font-mono text-sm mb-4"
            >
              Hello, I&apos;m
            </motion.p>

            <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Priyanshi{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Gajiwala
              </span>
            </h1>

            <div className="mt-4 h-8">
              <p className="text-xl text-text-secondary font-medium">
                {typedText}
                <span className="animate-pulse text-primary">|</span>
              </p>
            </div>

            <p className="mt-6 text-lg text-text-secondary max-w-lg leading-relaxed">
              Building intelligent software solutions, scalable applications, and impactful
              technology products.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/projects">
                <Button size="lg" className="group">
                  View Projects
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href={siteConfig.resumePath} download>
                <Button variant="outline" size="lg">
                  <FiDownload className="h-4 w-4" />
                  Download Resume
                </Button>
              </a>
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  <FiMail className="h-4 w-4" />
                  Contact Me
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 blur-2xl" />
              <div className="relative h-72 w-72 sm:h-80 sm:w-80 rounded-2xl border border-white/10 bg-white shadow-2xl shadow-primary/10 overflow-hidden">
                <img
                  src={siteConfig.profileImage}
                  alt="Priyanshi Gajiwala — Software Developer and AI Enthusiast"
                  className="h-full w-full object-cover object-top"
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
