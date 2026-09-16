import { Link, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiGithub, FiExternalLink, FiYoutube } from 'react-icons/fi'
import { FaLinkedin } from 'react-icons/fa'
import { SEO } from '@/components/layout/SEO'
import { AnimatedSection } from '@/components/layout/AnimatedSection'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { getProjectBySlug, getRelatedProjects, getCategoryLabel } from '@/data/projects'
import { siteConfig } from '@/lib/utils'

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) return <Navigate to="/not-found" replace />

  const related = getRelatedProjects(project.slug)

  return (
    <>
      <SEO
        title={`${project.title} | ${siteConfig.name}`}
        description={project.shortDescription}
        path={`/projects/${project.slug}`}
        type="article"
      />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-8"
          >
            <FiArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Badge variant="secondary" className="mb-4">{getCategoryLabel(project.category)}</Badge>
            <h1 className="text-4xl font-bold text-text-primary md:text-5xl">{project.title}</h1>
            <p className="mt-4 text-lg text-text-secondary max-w-3xl">{project.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <Badge key={t} variant="outline">{t}</Badge>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <FiGithub className="h-4 w-4" /> GitHub
                  </Button>
                </a>
              )}
              {project.linkedin && (
                <a href={project.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <FaLinkedin className="h-4 w-4" /> LinkedIn Post
                  </Button>
                </a>
              )}
              {project.youtube && (
                <a href={project.youtube} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <FiYoutube className="h-4 w-4" /> YouTube
                  </Button>
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="sm">
                    <FiExternalLink className="h-4 w-4" /> Live Demo
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {[
              { title: 'Overview', content: project.description },
              { title: 'Problem Statement', content: project.problem },
              { title: 'Solution', content: project.solution },
              { title: 'Architecture', content: project.architecture },
            ].map((section, i) => (
              <AnimatedSection key={section.title} delay={i * 0.1}>
                <Card className="p-8">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">{section.title}</h2>
                  <p className="text-text-secondary leading-relaxed">{section.content}</p>
                </Card>
              </AnimatedSection>
            ))}

            <AnimatedSection>
              <Card className="p-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Challenges</h2>
                <ul className="space-y-3">
                  {project.challenges.map((c) => (
                    <li key={c} className="text-text-secondary flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      {c}
                    </li>
                  ))}
                </ul>
              </Card>
            </AnimatedSection>

            <AnimatedSection>
              <Card className="p-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Implementation</h2>
                <ul className="space-y-3">
                  {project.implementation.map((item) => (
                    <li key={item} className="text-text-secondary flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </AnimatedSection>

            <AnimatedSection>
              <Card className="p-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Screenshots</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      className="aspect-video rounded-lg border border-white/10 bg-surface/60 flex items-center justify-center"
                    >
                      <p className="text-sm text-text-secondary">Screenshot {n}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedSection>
          </div>

          <div className="space-y-8">
            <AnimatedSection>
              <Card className="p-6 sticky top-24">
                <h3 className="font-semibold text-text-primary mb-4">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>

                <h3 className="font-semibold text-text-primary mt-6 mb-4">Features</h3>
                <ul className="space-y-2">
                  {project.features.map((f) => (
                    <li key={f} className="text-sm text-text-secondary flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <h3 className="font-semibold text-text-primary mt-6 mb-4">Results</h3>
                <ul className="space-y-2">
                  {project.results.map((r) => (
                    <li key={r} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Card>
            </AnimatedSection>
          </div>
        </div>

        {related.length > 0 && (
          <AnimatedSection className="mt-16">
            <h2 className="text-2xl font-bold text-text-primary mb-8">Related Projects</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {related.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </>
  )
}
