import { useEffect, useState } from 'react'
import type { GitHubRepo, GitHubUser } from '@/types'
import { siteConfig } from '@/lib/utils'

interface GitHubData {
  user: GitHubUser | null
  repos: GitHubRepo[]
  loading: boolean
  error: string | null
}

export function useGitHub(): GitHubData {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${siteConfig.githubUsername}`),
          fetch(
            `https://api.github.com/users/${siteConfig.githubUsername}/repos?sort=updated&per_page=6`
          ),
        ])

        if (!userRes.ok) throw new Error('Failed to fetch GitHub profile')

        const userData: GitHubUser = await userRes.json()
        setUser(userData)

        if (reposRes.ok) {
          const reposData: GitHubRepo[] = await reposRes.json()
          setRepos(reposData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchGitHub()
  }, [])

  return { user, repos, loading, error }
}
