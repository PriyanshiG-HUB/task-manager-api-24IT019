import { motion } from 'framer-motion'
import { quickStats } from '@/data/achievements'
import { useCounter } from '@/hooks'
import { AnimatedSection, SectionHeading } from '@/components/layout/AnimatedSection'
import { Card } from '@/components/ui/card'

function StatCard({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  const numericValue = parseInt(value.replace(/\D/g, ''))
  const isNumeric = !isNaN(numericValue) && numericValue > 0
  const { count, ref } = useCounter(isNumeric ? numericValue : 0)

  const displayValue = isNumeric ? `${count}${suffix}` : value

  return (
    <Card ref={ref} className="p-6 text-center transition-all duration-300 hover:border-primary/30 hover:-translate-y-1">
      <motion.p
        className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
      >
        {displayValue}
      </motion.p>
      <p className="mt-2 text-sm text-text-secondary">{label}</p>
    </Card>
  )
}

export function QuickStats() {
  return (
    <AnimatedSection className="py-20 bg-surface/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Quick Stats" subtitle="Highlights from my journey so far" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
