import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { AnimatedSection } from '@/components/layout/AnimatedSection'
import { Button } from '@/components/ui/button'

export function AboutPreview() {
  return (
    <AnimatedSection className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-surface/40 backdrop-blur-xl p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">About Me</h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />
            </div>
            <div>
              <p className="text-text-secondary leading-relaxed">
                I am a B.Tech Information Technology student at CHARUSAT passionate about
                software development, artificial intelligence, data analytics, and open-source
                contributions. I build real-world solutions spanning AI-powered platforms,
                mobile kiosk systems, and developer automation tools.
              </p>
              <Link to="/about" className="inline-block mt-6">
                <Button variant="outline" className="group">
                  Learn More
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
