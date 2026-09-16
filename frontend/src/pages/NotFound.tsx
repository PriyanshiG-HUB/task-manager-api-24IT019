import { Link } from 'react-router-dom'
import { FiHome, FiArrowLeft } from 'react-icons/fi'
import { SEO } from '@/components/layout/SEO'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/utils'

export default function NotFound() {
  return (
    <>
      <SEO
        title={`404 - Page Not Found | ${siteConfig.name}`}
        description="The page you're looking for doesn't exist."
        path="/not-found"
      />

      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-text-primary">Page Not Found</h1>
        <p className="mt-2 text-text-secondary max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/">
            <Button>
              <FiHome className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <FiArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </>
  )
}
