import { motion } from 'framer-motion'
import { FiStar, FiGitBranch, FiExternalLink } from 'react-icons/fi'
import { useGitHub } from '@/hooks/useGitHub'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { AnimatedSection, SectionHeading } from '@/components/layout/AnimatedSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { siteConfig } from '@/lib/utils'

export function GitHubStats() {
  const { user, repos, loading, error } = useGitHub()

  return (
    <AnimatedSection className="py-20 bg-surface/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Open Source Activity"
          subtitle="Contributing to the developer community on GitHub"
        />

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-text-secondary">
            <p>Unable to load GitHub data. Visit my profile directly.</p>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
            >
              View GitHub Profile <FiExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              {[
                { label: 'Repositories', value: user?.public_repos ?? 0 },
                { label: 'Followers', value: user?.followers ?? 0 },
                { label: 'Following', value: user?.following ?? 0 },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 text-center">
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {repos.map((repo, i) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    <Card className="h-full transition-all hover:border-primary/30 hover:-translate-y-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FiGitBranch className="h-4 w-4 text-primary" />
                          {repo.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                          {repo.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-3">
                          {repo.language && <Badge variant="outline">{repo.language}</Badge>}
                          <span className="flex items-center gap-1 text-xs text-text-secondary">
                            <FiStar className="h-3 w-3" /> {repo.stargazers_count}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </AnimatedSection>
  )
}
