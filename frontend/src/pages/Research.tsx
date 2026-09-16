import { FiDownload, FiBookOpen } from 'react-icons/fi'
import { SEO } from '@/components/layout/SEO'
import { AnimatedSection } from '@/components/layout/AnimatedSection'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { research } from '@/data/research'
import { siteConfig } from '@/lib/utils'

const sections = [
  { key: 'abstract', title: 'Abstract', content: research.abstract },
  { key: 'problem', title: 'Problem', content: research.problem },
  { key: 'architecture', title: 'Architecture', content: research.architecture },
  { key: 'esp32', title: 'ESP32 Integration', content: research.esp32Integration },
  { key: 'rfid', title: 'RFID Authentication', content: research.rfidAuth },
  { key: 'sheets', title: 'Google Sheets API Synchronization', content: research.googleSheetsSync },
] as const

export default function Research() {
  return (
    <>
      <SEO
        title={`Research | ${siteConfig.name}`}
        description="IoT-Driven RFID-Based Real-Time Attendance System — published at SmartCom 2026, Springer Nature."
        path="/research"
      />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <FiBookOpen className="h-6 w-6 text-secondary" />
              <Badge variant="secondary">Research Publication</Badge>
            </div>
            <h1 className="text-3xl font-bold text-text-primary md:text-4xl max-w-4xl">
              {research.title}
            </h1>
            <p className="mt-4 text-text-secondary">{research.conference}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>Springer Nature</Badge>
              <Badge variant="outline">{research.year}</Badge>
              {research.location && <Badge variant="outline">{research.location}</Badge>}
            </div>
            {research.authors.length > 0 && (
              <p className="mt-4 text-sm text-text-secondary">
                <span className="text-text-primary font-medium">Authors: </span>
                {research.authors.join(', ')}
              </p>
            )}
            {research.conferenceDates && (
              <p className="mt-2 text-sm text-text-secondary">
                <span className="text-text-primary font-medium">Dates: </span>
                {research.conferenceDates}
              </p>
            )}
          </AnimatedSection>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8 space-y-8">
        {research.certificateImage && (
          <AnimatedSection>
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Conference Certificate
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Certificate of contribution presented at SmartCom 2026, confirming selection for
                publication by Springer Nature.
              </p>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl">
                <img
                  src={research.certificateImage}
                  alt="SmartCom 2026 Certificate of Contribution — IoT Driven RFID-Based Real-Time Attendance System"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              {research.downloadUrl && (
                <a href={research.downloadUrl} download className="inline-block mt-6">
                  <Button>
                    <FiDownload className="h-4 w-4" />
                    Download Publication
                  </Button>
                </a>
              )}
            </Card>
          </AnimatedSection>
        )}

        {sections.map((section, i) => (
          <AnimatedSection key={section.key} delay={i * 0.08}>
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">{section.title}</h2>
              <p className="text-text-secondary leading-relaxed">{section.content}</p>
            </Card>
          </AnimatedSection>
        ))}

        <AnimatedSection>
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Research Outcomes</h2>
            <ul className="space-y-3">
              {research.outcomes.map((o) => (
                <li key={o} className="text-text-secondary flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {o}
                </li>
              ))}
            </ul>
          </Card>
        </AnimatedSection>

        <AnimatedSection>
          <Card className="p-8 border-secondary/30">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Conference Information</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex gap-2">
                <dt className="text-text-secondary w-28 shrink-0">Conference</dt>
                <dd className="text-text-primary">{research.conference}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-text-secondary w-28 shrink-0">Publisher</dt>
                <dd className="text-text-primary">{research.publisher}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-text-secondary w-28 shrink-0">Year</dt>
                <dd className="text-text-primary">{research.year}</dd>
              </div>
              {research.location && (
                <div className="flex gap-2">
                  <dt className="text-text-secondary w-28 shrink-0">Location</dt>
                  <dd className="text-text-primary">{research.location}</dd>
                </div>
              )}
              {research.conferenceDates && (
                <div className="flex gap-2">
                  <dt className="text-text-secondary w-28 shrink-0">Dates</dt>
                  <dd className="text-text-primary">{research.conferenceDates}</dd>
                </div>
              )}
            </dl>
          </Card>
        </AnimatedSection>
      </div>
    </>
  )
}
