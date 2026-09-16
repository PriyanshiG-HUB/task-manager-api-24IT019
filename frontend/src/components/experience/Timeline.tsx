import { motion } from 'framer-motion'
import { FiBriefcase, FiExternalLink } from 'react-icons/fi'
import { FaLinkedin } from 'react-icons/fa'
import type { Experience } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AnimatedSection } from '@/components/layout/AnimatedSection'

interface TimelineProps {
  experiences: Experience[]
}

export function Timeline({ experiences }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent md:-translate-x-px" />

      {experiences.map((exp, i) => (
        <AnimatedSection key={exp.id} delay={i * 0.15} className="relative mb-12">
          <div className={`flex flex-col md:flex-row gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            <div className="hidden md:block md:w-1/2" />

            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background z-10">
              <FiBriefcase className="h-4 w-4 text-primary" />
            </div>

            <motion.div
              className="ml-12 md:ml-0 md:w-1/2"
              initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 transition-all hover:border-primary/30">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-primary">{exp.duration}</span>
                  {exp.location && (
                    <span className="text-xs text-text-secondary">• {exp.location}</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-text-primary">{exp.role}</h3>
                <p className="text-secondary font-medium mt-1">{exp.company}</p>

                <ul className="mt-4 space-y-2">
                  {exp.responsibilities.map((r) => (
                    <li key={r} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {r}
                    </li>
                  ))}
                </ul>

                {exp.metrics && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {exp.metrics.map((m) => (
                      <div key={m.label} className="rounded-lg bg-white/5 p-3 text-center">
                        <p className="text-lg font-bold text-primary">{m.value}</p>
                        <p className="text-[10px] text-text-secondary">{m.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.skills.map((s) => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>

                {exp.linkedin && (
                  <a
                    href={exp.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <FaLinkedin className="h-4 w-4" />
                    View LinkedIn Post
                    <FiExternalLink className="h-3 w-3" />
                  </a>
                )}
              </Card>
            </motion.div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  )
}
