import { motion } from 'framer-motion'
import { FiAward } from 'react-icons/fi'
import { SEO } from '@/components/layout/SEO'
import { AnimatedSection, SectionHeading } from '@/components/layout/AnimatedSection'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { achievements } from '@/data/achievements'
import { siteConfig } from '@/lib/utils'

export default function Achievements() {
  return (
    <>
      <SEO
        title={`Achievements | ${siteConfig.name}`}
        description="Hackathon rankings, open source contributions, and academic achievements of Priyanshi Gajiwala."
        path="/achievements"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            title="Achievements"
            subtitle="Recognition from hackathons, open source, and academic programs"
          />
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, i) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group h-full p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10">
                    <FiAward className="h-6 w-6 text-primary" />
                  </div>
                  {achievement.badge && (
                    <Badge variant="secondary">{achievement.badge}</Badge>
                  )}
                </div>
                {achievement.stat && (
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    {achievement.stat}
                  </p>
                )}
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {achievement.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">{achievement.description}</p>
                {achievement.year && (
                  <p className="mt-3 text-xs font-mono text-text-secondary/60">{achievement.year}</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
