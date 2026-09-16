import { useState, useEffect, useMemo, useCallback } from 'react'
import { FiSearch, FiGithub, FiLayers } from 'react-icons/fi'
import { SEO } from '@/components/layout/SEO'
import { AnimatedSection, SectionHeading } from '@/components/layout/AnimatedSection'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { Spinner } from '@/components/Spinner'
import { ErrorMessage } from '@/components/ErrorMessage'
import { RepoCard } from '@/components/RepoCard'
import { Input } from '@/components/ui/input'
import { projects } from '@/data/projects'
import { siteConfig } from '@/lib/utils'
import type { GitHubRepo } from '@/types'

// Primary GitHub API Endpoint as specified in Practical 3
const GITHUB_API_URL = "https://api.github.com/users/PriyanshiG-HUB/repos";

export default function Projects() {
  // --- Practical 3 State Management ---
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Search query state for live repository filtering
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Tab switching state: 'github' (Practical 3) vs 'showcase' (Original Featured Projects)
  const [activeTab, setActiveTab] = useState<'github' | 'showcase'>('github')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  /**
   * Asynchronous function to fetch repositories from GitHub REST API.
   * Handles network errors, rate limits, non-OK responses, and invalid JSON gracefully.
   */
  const fetchRepos = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(GITHUB_API_URL)

      // Handle HTTP error statuses (e.g., 404 Not Found, 403 Rate Limit Exceeded)
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.')
        } else if (response.status === 404) {
          throw new Error('GitHub user or repositories endpoint not found.')
        } else {
          throw new Error(`HTTP Error: Failed to fetch repositories (Status: ${response.status})`)
        }
      }

      // Parse JSON response safely
      const data = await response.json()

      // Validate that response is an array
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format received from GitHub API.')
      }

      // Sort repositories by updated_at date descending
      const sortedData = data.sort(
        (a: GitHubRepo, b: GitHubRepo) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )

      setRepos(sortedData)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred while loading repositories.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * useEffect Hook to fetch GitHub repositories once when component mounts.
   * Empty dependency array [] guarantees execution ONLY on mount.
   */
  useEffect(() => {
    fetchRepos()
  }, [fetchRepos])

  /**
   * Filter GitHub repositories by name based on search input (Case Insensitive).
   */
  const filteredRepos = useMemo(() => {
    if (!searchQuery.trim()) return repos
    return repos.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    )
  }, [repos, searchQuery])

  /**
   * Filter static showcase projects by category (Original portfolio feature).
   */
  const filteredShowcase = useMemo(() => {
    if (activeCategory === 'all') return projects
    return projects.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  return (
    <>
      <SEO
        title={`Projects | ${siteConfig.name}`}
        description="Explore software projects and live GitHub repositories by Priyanshi Gajiwala — AI systems, web applications, and data analytics."
        path="/projects"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            title="Projects & Repositories"
            subtitle="Explore live GitHub repositories dynamically fetched via REST API & featured projects"
          />

          {/* Sub-Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveTab('github')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'github'
                  ? 'bg-primary text-background shadow-lg shadow-primary/20 scale-105'
                  : 'border border-white/10 bg-surface/60 text-text-secondary hover:text-text-primary hover:bg-white/10'
              }`}
            >
              <FiGithub className="h-4 w-4" />
              GitHub Live Repositories (Practical 3)
            </button>
            <button
              onClick={() => setActiveTab('showcase')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'showcase'
                  ? 'bg-primary text-background shadow-lg shadow-primary/20 scale-105'
                  : 'border border-white/10 bg-surface/60 text-text-secondary hover:text-text-primary hover:bg-white/10'
              }`}
            >
              <FiLayers className="h-4 w-4" />
              Featured Showcase Projects
            </button>
          </div>

          {/* --- TAB 1: LIVE GITHUB REPOS (PRACTICAL 3 REQUIREMENTS) --- */}
          {activeTab === 'github' && (
            <div className="space-y-8">
              {/* Search Bar Input */}
              <div className="mx-auto max-w-md relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
                  <FiSearch className="h-4 w-4" />
                </div>
                <Input
                  type="text"
                  placeholder="Search repositories by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm bg-surface/60 border-white/10 focus:border-primary/50"
                  aria-label="Search repositories by name"
                />
              </div>

              {/* Conditional Rendering: Loading -> Error -> Repos List */}
              {loading ? (
                <Spinner label="Loading repositories from GitHub API..." />
              ) : error ? (
                <ErrorMessage message={error} onRetry={fetchRepos} />
              ) : filteredRepos.length === 0 ? (
                <div className="text-center py-16 rounded-xl border border-white/10 bg-surface/40 backdrop-blur-md">
                  <p className="text-text-secondary text-base">
                    {searchQuery.trim()
                      ? `No repositories found matching "${searchQuery}".`
                      : 'No public repositories found for this account.'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRepos.map((repo, index) => (
                    <RepoCard key={repo.id} repo={repo} index={index} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- TAB 2: FEATURED SHOWCASE PROJECTS (PRESERVES ORIGINAL CODEBASE) --- */}
          {activeTab === 'showcase' && (
            <div className="space-y-8">
              <ProjectFilters active={activeCategory} onChange={setActiveCategory} />

              {filteredShowcase.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-text-secondary">No projects found in this category.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredShowcase.map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </AnimatedSection>
      </div>
    </>
  )
}
