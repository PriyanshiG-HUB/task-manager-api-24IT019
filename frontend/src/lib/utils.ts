import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

export const siteConfig = {
  name: 'Priyanshi Gajiwala',
  title: 'Software Developer | AI Enthusiast | Open Source Contributor',
  description:
    'Building intelligent software solutions, scalable applications, and impactful technology products.',
  url: 'https://priyanshigajiwala.dev',
  email: 'priyanshigajiwala@gmail.com',
  phone: '+91-7016755944',
  location: 'Surat, Gujarat, India',
  github: 'https://github.com/PriyanshiG-HUB',
  linkedin: 'https://www.linkedin.com/in/priyanshi-gajiwala-1b00b7323/',
  leetcode: 'https://leetcode.com/u/priyanshigajiwala',
  twitter: 'https://twitter.com/priyanshigajiwala',
  githubUsername: 'PriyanshiG-HUB',
  resumePath: '/resume.pdf',
  profileImage: '/images/Profile.png',
}

export const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Experience', path: '/experience' },
  { name: 'Research', path: '/research' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Resume', path: '/resume' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
  {
  name: "Tasks",
  path: "/tasks",
},
]
