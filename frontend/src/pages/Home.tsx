import { SEO } from '@/components/layout/SEO'
import { Hero } from '@/components/home/Hero'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { QuickStats } from '@/components/home/QuickStats'
import { AboutPreview } from '@/components/home/AboutPreview'
import { GitHubStats } from '@/components/home/GitHubStats'
import { siteConfig } from '@/lib/utils'

export default function Home() {
  return (
    <>
      <SEO
        title={`${siteConfig.name} | Software Developer & AI Enthusiast`}
        description={siteConfig.description}
        path="/"
      />
      <Hero />
      <FeaturedProjects />
      <QuickStats />
      <AboutPreview />
      <GitHubStats />
    </>
  )
}
