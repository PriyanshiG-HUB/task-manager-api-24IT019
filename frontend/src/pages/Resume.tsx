import { FiDownload, FiPrinter } from 'react-icons/fi'
import { SEO } from '@/components/layout/SEO'
import { AnimatedSection, SectionHeading } from '@/components/layout/AnimatedSection'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { projects } from '@/data/projects'
import { experiences } from '@/data/experience'
import { skillCategories } from '@/data/skills'
import { achievements } from '@/data/achievements'
import { research } from '@/data/research'
import { siteConfig } from '@/lib/utils'

export default function Resume() {
  const handlePrint = () => window.print()

  return (
    <>
      <SEO
        title={`Resume | ${siteConfig.name}`}
        description="Interactive resume of Priyanshi Gajiwala — Software Developer, AI Enthusiast, and Open Source Contributor."
        path="/resume"
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 no-print">
            <SectionHeading title="Resume" subtitle="Interactive professional resume" className="mb-0 text-left" />
            <div className="flex gap-3">
              <a href={siteConfig.resumePath} download>
                <Button>
                  <FiDownload className="h-4 w-4" />
                  Download
                </Button>
              </a>
              <Button variant="outline" onClick={handlePrint}>
                <FiPrinter className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <div className="space-y-8 print:space-y-6">
          <AnimatedSection>
            <Card className="p-8 text-center">
              <h1 className="text-3xl font-bold text-text-primary">{siteConfig.name}</h1>
              <p className="mt-2 text-text-secondary">{siteConfig.title}</p>
              <p className="mt-2 text-sm text-text-secondary">
                {siteConfig.location} • {siteConfig.email} • {siteConfig.phone}
              </p>
            </Card>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Education</h2>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-text-primary">CHARUSAT</h3>
                  <p className="text-sm text-text-secondary">B.Tech Information Technology</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-secondary">2024–2028</p>
                  <p className="text-sm text-primary font-medium">CGPA: 7.80</p>
                </div>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Experience</h2>
              {experiences.map((exp) => (
                <div key={exp.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-text-primary">{exp.role}</h3>
                      <p className="text-sm text-secondary">{exp.company}</p>
                    </div>
                    <p className="text-sm text-text-secondary">{exp.duration}</p>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {exp.responsibilities.map((r) => (
                      <li key={r} className="text-sm text-text-secondary">• {r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Projects</h2>
              {projects.map((p) => (
                <div key={p.id} className="mb-4 last:mb-0">
                  <h3 className="font-medium text-text-primary">{p.title}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.tech.map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{p.shortDescription}</p>
                </div>
              ))}
            </Card>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Research</h2>
              <h3 className="font-medium text-text-primary">{research.title}</h3>
              <p className="text-sm text-text-secondary mt-1">{research.conference}</p>
            </Card>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Skills</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {skillCategories.map((cat) => (
                  <div key={cat.category}>
                    <h3 className="text-sm font-medium text-text-primary mb-2">{cat.category}</h3>
                    <p className="text-sm text-text-secondary">{cat.skills.join(', ')}</p>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Achievements</h2>
              <ul className="space-y-2">
                {achievements.map((a) => (
                  <li key={a.id} className="text-sm text-text-secondary">
                    <Separator className="mb-2 last:hidden" />
                    <span className="text-text-primary font-medium">{a.title}</span> — {a.description}
                  </li>
                ))}
              </ul>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </>
  )
}
