import { SEO } from '@/components/layout/SEO'
import { AnimatedSection, SectionHeading } from '@/components/layout/AnimatedSection'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { skillCategories, certifications } from '@/data/skills'
import { siteConfig } from '@/lib/utils'
import type { Education } from '@/types'

const education: Education = {
  institution: 'Charotar University of Science & Technology (CHARUSAT)',
  degree: 'B.Tech Information Technology',
  duration: '2024–2028',
  cgpa: '7.80',
  interests: [
    'Full Stack Development',
    'AI Systems',
    'Open Source',
    'System Design',
    'Data Analytics',
  ],
}

export default function About() {
  return (
    <>
      <SEO
        title={`About | ${siteConfig.name}`}
        description="Learn about Priyanshi Gajiwala — B.Tech IT student at CHARUSAT passionate about software development, AI, and open source."
        path="/about"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            title="About Me"
            subtitle="Passionate about building technology that makes a difference"
          />
          <Card className="p-8 mb-16">
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <div className="shrink-0">
                <div className="h-36 w-36 rounded-2xl border border-white/10 bg-white shadow-xl shadow-primary/10 overflow-hidden">
                  <img
                    src={siteConfig.profileImage}
                    alt="Priyanshi Gajiwala"
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="text-text-secondary leading-relaxed text-lg">
                I am a B.Tech Information Technology student at CHARUSAT passionate about
                software development, artificial intelligence, data analytics, and open-source
                contributions. I build real-world solutions including an AI-powered ESG Fraud
                Detection Platform, a Hotel Self-Service Kiosk for a US-based hospitality client,
                and developer automation tools. With a strong foundation in React Native, FastAPI,
                Python, and system design, I thrive on solving complex problems through hackathons
                and open-source contributions.
              </p>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection>
          <h3 className="text-2xl font-bold text-text-primary mb-6">Education</h3>
          <Card className="p-8 mb-16">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h4 className="text-xl font-semibold text-text-primary">{education.institution}</h4>
                <p className="text-secondary mt-1">{education.degree}</p>
                <p className="text-sm text-text-secondary mt-2">{education.duration}</p>
              </div>
              <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-2 text-center">
                <p className="text-2xl font-bold text-primary">{education.cgpa}</p>
                <p className="text-xs text-text-secondary">CGPA</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium text-text-primary mb-3">Areas of Interest</p>
              <div className="flex flex-wrap gap-2">
                {education.interests.map((i) => (
                  <Badge key={i} variant="secondary">{i}</Badge>
                ))}
              </div>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection>
          <h3 className="text-2xl font-bold text-text-primary mb-6">Technical Skills</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            {skillCategories.map((cat) => (
              <Card key={cat.category} className="p-6 transition-all hover:border-primary/30">
                <h4 className="font-semibold text-text-primary mb-3">{cat.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h3 className="text-2xl font-bold text-text-primary mb-6">Certifications</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {certifications.map((cert) => (
              <Card key={cert} className="p-4 text-sm text-text-secondary hover:border-primary/30 transition-all">
                {cert}
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </>
  )
}
