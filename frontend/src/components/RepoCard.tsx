import { motion } from 'framer-motion'
import { FiStar, FiExternalLink, FiFolder, FiCode } from 'react-icons/fi'
import type { GitHubRepo } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface RepoCardProps {
  repo: GitHubRepo
  index?: number
}

export function RepoCard({ repo, index = 0 }: RepoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="group flex h-full flex-col justify-between transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10 hover:shadow-2xl hover:-translate-y-1">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-primary font-mono text-xs">
              <FiFolder className="h-4 w-4" />
              <span>Public Repository</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full text-xs font-semibold">
              <FiStar className="h-3.5 w-3.5 fill-amber-400" />
              <span>{repo.stargazers_count} {repo.stargazers_count === 1 ? 'Star' : 'Stars'}</span>
            </div>
          </div>

          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
            {repo.name}
          </CardTitle>

          <CardDescription className="line-clamp-3 text-sm text-text-secondary leading-relaxed min-h-[4rem]">
            {repo.description || 'No description provided for this repository.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {repo.language && (
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <FiCode className="h-3.5 w-3.5 text-secondary" />
              <Badge variant="outline" className="font-mono text-xs border-white/10 bg-white/5">
                {repo.language}
              </Badge>
            </div>
          )}

          <div className="pt-2 border-t border-white/5">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-background"
            >
              <span>Open Repository</span>
              <FiExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default RepoCard
