import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiGithub, FiExternalLink } from 'react-icons/fi'
import type { Project } from '@/types'
import { getCategoryLabel } from '@/data/projects'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface ProjectCardProps {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group h-full transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10 hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-3">
                {getCategoryLabel(project.category)}
              </Badge>
              <CardTitle className="group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((t) => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>
          <ul className="space-y-1 mb-6">
            {project.features.slice(0, 3).map((f) => (
              <li key={f} className="text-sm text-text-secondary flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <Link
              to={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View Details <FiArrowRight className="h-4 w-4" />
            </Link>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary">
                <FiGithub className="h-4 w-4" />
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary">
                <FiExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
