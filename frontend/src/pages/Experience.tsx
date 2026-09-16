import { SEO } from '@/components/layout/SEO'
import { AnimatedSection, SectionHeading } from '@/components/layout/AnimatedSection'
import { Timeline } from '@/components/experience/Timeline'
import { Card } from '@/components/ui/card'
import { experiences, leadership } from '@/data/experience'
import { siteConfig } from '@/lib/utils'

export default function Experience() {
  return (
    <>
      <SEO
        title={`Experience | ${siteConfig.name}`}
        description="Professional experience and internships of Priyanshi Gajiwala in data analytics and software development."
        path="/experience"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            title="Experience"
            subtitle="Building skills through real-world internships and leadership"
          />
        </AnimatedSection>

        <Timeline experiences={experiences} />

        <AnimatedSection className="mt-16">
          <h3 className="text-2xl font-bold text-text-primary mb-6">Leadership & Activities</h3>
          <Card className="p-8">
            <h4 className="text-lg font-semibold text-text-primary">
              {leadership.role} — {leadership.organization}
            </h4>
            <ul className="mt-4 space-y-3">
              {leadership.activities.map((a) => (
                <li key={a} className="text-text-secondary flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {a}
                </li>
              ))}
            </ul>
          </Card>
        </AnimatedSection>
      </div>
    </>
  )
}
