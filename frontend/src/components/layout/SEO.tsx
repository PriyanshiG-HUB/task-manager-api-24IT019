import { useEffect } from 'react'
import type { SEOProps } from '@/types'
import { siteConfig } from '@/lib/utils'

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function SEO({ title, description, path = '', type = 'website', image }: SEOProps) {
  const url = `${siteConfig.url}${path}`
  const ogImage = image || `${siteConfig.url}${siteConfig.profileImage}`

  useEffect(() => {
    document.title = title

    setMeta('description', description)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:type', type, true)
    setMeta('og:url', url, true)
    setMeta('og:image', ogImage, true)
    setMeta('og:site_name', siteConfig.name, true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    const scriptId = 'structured-data'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.email,
      jobTitle: 'Software Developer',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Surat',
        addressRegion: 'Gujarat',
        addressCountry: 'IN',
      },
      sameAs: [siteConfig.github, siteConfig.linkedin, siteConfig.leetcode],
      description: siteConfig.description,
    })
  }, [title, description, url, type, ogImage])

  return null
}
