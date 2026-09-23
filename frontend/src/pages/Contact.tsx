import { useState, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMail,
  FiMapPin,
  FiSend,
  FiCheck,
  FiClock,
  FiDatabase,
  FiAlertCircle,
  FiTrash2,
  FiSave
} from 'react-icons/fi'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import { SEO } from '@/components/layout/SEO'
import { AnimatedSection, SectionHeading } from '@/components/layout/AnimatedSection'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/lib/utils'
import { sendContactMessage } from '@/lib/api'

const DRAFT_STORAGE_KEY = 'portfolio_contact_draft'
const SENT_MESSAGES_KEY = 'portfolio_sent_messages'

interface SentMessageRecord {
  id: string
  name: string
  email: string
  message: string
  sentAt: string
  persistedToDb: boolean
}

const socialLinks = [
  { icon: FaLinkedin, href: siteConfig.linkedin, label: 'LinkedIn' },
  { icon: FaGithub, href: siteConfig.github, label: 'GitHub' },
  { icon: SiLeetcode, href: siteConfig.leetcode, label: 'LeetCode' },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draftSaved, setDraftSaved] = useState(false)

  // Controlled form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [showPreview, setShowPreview] = useState(true)

  // Persistent Sent Inquiries History
  const [sentMessages, setSentMessages] = useState<SentMessageRecord[]>([])

  // 1. Restore draft and sent history from localStorage on mount (Data Persistence)
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft)
        if (parsed.name) setName(parsed.name)
        if (parsed.email) setEmail(parsed.email)
        if (parsed.message) setMessage(parsed.message)
      }

      const savedHistory = localStorage.getItem(SENT_MESSAGES_KEY)
      if (savedHistory) {
        setSentMessages(JSON.parse(savedHistory))
      }
    } catch (err) {
      console.warn('Error loading persisted data from localStorage:', err)
    }
  }, [])

  // 2. Auto-save form draft to localStorage on input changes (Data Persistence)
  useEffect(() => {
    if (submitted) return

    if (name.trim() || email.trim() || message.trim()) {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({ name, email, message })
      )
      setDraftSaved(true)
      const timer = setTimeout(() => setDraftSaved(false), 2000)
      return () => clearTimeout(timer)
    } else {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      setDraftSaved(false)
    }
  }, [name, email, message, submitted])

  // 3. Asynchronous Form Submission to MongoDB API
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Asynchronous network request to Node/Express/MongoDB backend
      const result = await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      })

      // Persist to local sent inquiries history
      const newRecord: SentMessageRecord = {
        id: result._id || Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        sentAt: new Date().toISOString(),
        persistedToDb: true,
      }

      const updatedHistory = [newRecord, ...sentMessages]
      setSentMessages(updatedHistory)
      localStorage.setItem(SENT_MESSAGES_KEY, JSON.stringify(updatedHistory))

      // Clear draft upon successful submission
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      setName('')
      setEmail('')
      setMessage('')
      setSubmitted(true)
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send message. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClearHistory = () => {
    localStorage.removeItem(SENT_MESSAGES_KEY)
    setSentMessages([])
  }

  const handleSendAnother = () => {
    setSubmitted(false)
    setError(null)
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
            subtitle="Have a project in mind or want to connect? Send an asynchronous message persisted directly to MongoDB."
          />
        </AnimatedSection>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Contact Information */}
          <AnimatedSection>
            <Card className="p-8 h-full flex flex-col justify-between">
              <div>
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

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <FiDatabase className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Data Persistence</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Messages persist in MongoDB backend and auto-save locally to browser storage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
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

          {/* Right Column: Asynchronous Form & Live Preview */}
          <AnimatedSection delay={0.15}>
            <div>
              <Card className="p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                      <FiCheck className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary">Message Sent & Persisted!</h3>
                    <p className="mt-2 text-text-secondary max-w-sm">
                      Your inquiry was asynchronously dispatched and permanently saved in MongoDB.
                    </p>
                    <div className="mt-6 flex gap-3">
                      <Button onClick={handleSendAnother} className="cursor-pointer">
                        Send Another Message
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Error Banner */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm"
                      >
                        <FiAlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    {/* Auto-Save Draft Indicator */}
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                      <span className="font-medium text-text-primary">Send an In-Depth Message</span>
                      <AnimatePresence>
                        {draftSaved && (
                          <motion.span
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-1 text-emerald-400 font-medium"
                          >
                            <FiSave className="h-3 w-3" /> Draft auto-saved
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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

                    <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          <span>Saving Asynchronously...</span>
                        </div>
                      ) : (
                        <>
                          <FiSend className="h-4 w-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </Card>

              {/* Real-Time Live Preview */}
              <AnimatePresence>
                {!submitted && showPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Card className="mt-6 p-6 border border-white/10 bg-surface/40 backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
                          Live Preview
                        </h4>
                        <Badge variant="outline" className="text-[10px]">
                          Real-time
                        </Badge>
                      </div>
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

        {/* Persistent Inquiries History Section */}
        {sentMessages.length > 0 && (
          <AnimatedSection delay={0.25} className="mt-12">
            <Card className="p-6 border border-white/10 bg-surface/30 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <FiDatabase className="h-5 w-5 text-emerald-400" />
                  <h4 className="text-base font-semibold text-text-primary">
                    Your Sent Inquiries History
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {sentMessages.length} {sentMessages.length === 1 ? 'Message' : 'Messages'}
                  </Badge>
                </div>
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-red-400 transition-colors cursor-pointer"
                  title="Clear local history"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                  <span>Clear History</span>
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-text-primary truncate">
                          {msg.name}
                        </span>
                        <Badge variant="default" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          MongoDB Saved
                        </Badge>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-3 mb-3">
                        &ldquo;{msg.message}&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-text-secondary border-t border-white/10 pt-2 mt-2">
                      <span className="truncate max-w-[140px]">{msg.email}</span>
                      <span className="flex items-center gap-1">
                        <FiClock className="h-3 w-3" />
                        {new Date(msg.sentAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>
        )}
      </div>
    </>
  )
}
