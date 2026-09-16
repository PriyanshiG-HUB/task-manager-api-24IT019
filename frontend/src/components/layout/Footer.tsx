import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import { navLinks, siteConfig } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const socialLinks = [
  { icon: FaGithub, href: siteConfig.github, label: 'GitHub' },
  { icon: FaLinkedin, href: siteConfig.linkedin, label: 'LinkedIn' },
  { icon: SiLeetcode, href: siteConfig.leetcode, label: 'LeetCode' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-surface/30 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{siteConfig.name}</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Software Developer | AI Enthusiast | Open Source Contributor
            </p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-text-secondary transition-colors hover:border-primary/30 hover:text-primary"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Navigation</h4>
            <ul className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>{siteConfig.location}</li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary transition-colors">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-text-secondary">
          &copy; {currentYear} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
