export interface SEOProps {
  title: string
  description: string
  path?: string
  type?: string
  image?: string
}

export interface Project {
  id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  category: 'ai' | 'web' | 'data-analytics'
  tech: string[]
  features: string[]
  problem: string
  solution: string
  architecture: string
  challenges: string[]
  implementation: string[]
  results: string[]
  github?: string
  live?: string
  linkedin?: string
  youtube?: string
  featured?: boolean
  image?: string
}

export interface Experience {
  id: string
  role: string
  company: string
  duration: string
  location?: string
  responsibilities: string[]
  skills: string[]
  metrics?: { label: string; value: string }[]
  linkedin?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  badge?: string
  stat?: string
  year?: string
}

export interface Research {
  title: string
  conference: string
  publisher: string
  year: string
  authors: string[]
  abstract: string
  problem: string
  architecture: string
  esp32Integration: string
  rfidAuth: string
  googleSheetsSync: string
  outcomes: string[]
  downloadUrl?: string
  certificateImage?: string
  location?: string
  conferenceDates?: string
}

export interface SkillCategory {
  category: string
  skills: string[]
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  comingSoon: boolean
}

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  updated_at: string
}

export interface GitHubUser {
  public_repos: number
  followers: number
  following: number
  avatar_url: string
  html_url: string
}

export interface Stat {
  label: string
  value: string
  suffix?: string
}

export interface Education {
  institution: string
  degree: string
  duration: string
  cgpa: string
  interests: string[]
}
