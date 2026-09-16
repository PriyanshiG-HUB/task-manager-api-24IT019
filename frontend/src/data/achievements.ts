import type { Achievement } from '@/types'

export const achievements: Achievement[] = [
  {
    id: '1',
    title: 'GDG Open Source Hackathon',
    description: 'Rank 12 of 188 Teams — Top 20 finish in Tech Sprint',
    badge: 'Top 20',
    stat: '12/188',
    year: '2025',
  },
  {
    id: '2',
    title: 'Merged Pull Requests',
    description: '8 Pull Requests merged into production repositories',
    badge: 'Open Source',
    stat: '8 PRs',
    year: '2025',
  },
  {
    id: '3',
    title: 'Smart India Hackathon 2025',
    description: 'Top 50 Team nationally recognized for innovative solution',
    badge: 'Top 50',
    stat: 'Top 50',
    year: '2025',
  },
  {
    id: '4',
    title: 'SSIP 2025 Phase-2',
    description: 'Selected for AI-based Educational Content Generation Project',
    badge: 'Selected',
    year: '2025',
  },
  {
    id: '5',
    title: 'Gen AI Academy 2.0',
    description: 'Gold League Achiever in generative AI coursework',
    badge: 'Gold League',
    year: '2025',
  },
  {
    id: '6',
    title: 'Hacktoberfest',
    description: 'Open Source Contributor — contributing to global OSS ecosystem',
    badge: 'Contributor',
    year: '2024',
  },
]

export const quickStats = [
  { label: 'Merged Pull Requests', value: '8', suffix: '+' },
  { label: 'GDG Hackathon', value: 'Top 20', suffix: '' },
  { label: 'Smart India Hackathon', value: 'Top 50', suffix: '' },
  { label: 'Students Mentored', value: '100', suffix: '+' },
]
