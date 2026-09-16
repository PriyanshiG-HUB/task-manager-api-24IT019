import { FiClock, FiBookOpen } from 'react-icons/fi'
import { SEO } from '@/components/layout/SEO'
import { AnimatedSection, SectionHeading } from '@/components/layout/AnimatedSection'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { siteConfig } from '@/lib/utils'
import type { BlogPost } from '@/types'

const placeholderPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building AI Applications',
    excerpt: 'A deep dive into designing and deploying production-ready AI systems with modern tooling.',
    category: 'AI',
    comingSoon: true,
  },
  {
    id: '2',
    title: 'React Native Development',
    excerpt: 'Best practices for building cross-platform mobile apps with React Native and Expo.',
    category: 'Mobile',
    comingSoon: true,
  },
  {
    id: '3',
    title: 'FastAPI Best Practices',
    excerpt: 'Architecting scalable Python backends with FastAPI, async patterns, and clean APIs.',
    category: 'Backend',
    comingSoon: true,
  },
  {
    id: '4',
    title: 'Open Source Journey',
    excerpt: 'Lessons learned from contributing to open source and merging pull requests to production.',
    category: 'Open Source',
    comingSoon: true,
  },
]

export default function Blog() {
  return (
    <>
      <SEO
        title={`Blog | ${siteConfig.name}`}
        description="Technical articles on AI, React Native, FastAPI, and open source development."
        path="/blog"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            title="Blog"
            subtitle="Thoughts on software engineering, AI, and open source"
          />

          <div className="mb-12 rounded-2xl border border-white/10 bg-surface/40 backdrop-blur-xl p-8 text-center">
            <FiBookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-bold text-text-primary">Articles Coming Soon</h3>
            <p className="mt-2 text-text-secondary max-w-lg mx-auto">
              I&apos;m working on technical articles covering AI development, mobile engineering,
              and open source. Stay tuned!
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {placeholderPosts.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.1}>
                <Card className="h-full opacity-75 transition-all hover:opacity-100 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <FiClock className="h-3 w-3" /> Coming Soon
                      </span>
                    </div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-secondary">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </>
  )
}
