import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiMapPin, FiSend, FiCheck } from 'react-icons/fi'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import { SEO } from '@/components/layout/SEO'
import { AnimatedSection, SectionHeading } from '@/components/layout/AnimatedSection'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { siteConfig } from '@/lib/utils'

const socialLinks = [
  { icon: FaLinkedin, href: siteConfig.linkedin, label: 'LinkedIn' },
  { icon: FaGithub, href: siteConfig.github, label: 'GitHub' },
  { icon: SiLeetcode, href: siteConfig.leetcode, label: 'LeetCode' },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Controlled form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [showPreview, setShowPreview] = useState(true)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <>
      <SEO
        title={`Contact | ${siteConfig.name}`}
        description="Get in touch with Priyanshi Gajiwala for collaborations, internships, and opportunities."
        path="/contact"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            title="Get in Touch"
            subtitle="Have a project in mind or want to connect? I'd love to hear from you."
          />
        </AnimatedSection>

        <div className="grid gap-8 lg:grid-cols-2">
          <AnimatedSection>
            <Card className="p-8 h-full">
              <h3 className="text-xl font-semibold text-text-primary mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FiMapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Location</p>
                    <p className="text-sm text-text-secondary">{siteConfig.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FiMail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Email</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm font-medium text-text-primary mb-4">Connect on Social</p>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-text-secondary transition-all hover:border-primary/30 hover:text-primary hover:shadow-lg hover:shadow-primary/10"
                      aria-label={label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div>
              <Card className="p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                      <FiCheck className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary">Message Sent!</h3>
                    <p className="mt-2 text-text-secondary">
                      Thank you for reaching out. I&apos;ll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message..."
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <div className="mt-1.5 flex items-center justify-between text-xs text-text-secondary">
                        <span>Characters: {message.length}</span>
                        <button
                          type="button"
                          onClick={() => setShowPreview(!showPreview)}
                          className="font-medium text-primary hover:underline transition-all cursor-pointer"
                        >
                          {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      ) : (
                        <>
                          <FiSend className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </Card>

              <AnimatePresence>
                {!submitted && showPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Card className="mt-6 p-6 border border-white/10 bg-surface/40 backdrop-blur-xl">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                        Live Preview
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex gap-2">
                          <span className="font-semibold text-text-primary min-w-[60px]">Name:</span>
                          <span className="text-text-secondary break-all">{name || '—'}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-text-primary min-w-[60px]">Email:</span>
                          <span className="text-text-secondary break-all">{email || '—'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-text-primary">Message:</span>
                          <div className="text-text-secondary whitespace-pre-wrap break-words min-h-[50px] p-3 rounded-lg bg-white/5 border border-white/10 font-mono text-xs">
                            {message || 'Your message preview will appear here as you type...'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  )
}
