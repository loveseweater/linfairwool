import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function SubscriptionPopup() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const location = useLocation()

  useEffect(() => {
    // Only show on frontend pages, not admin
    if (location.pathname.startsWith('/admin')) return

    // Check if already subscribed this session
    const dismissed = sessionStorage.getItem('linfair_popup_dismissed')
    if (dismissed) return

    // Check if already subscribed (session check only)

    // Show popup after 4 seconds
    const timer = setTimeout(() => {
      setShow(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [location.pathname])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setMsg('Please enter a valid email')
      return
    }

    try {
      const raw = localStorage.getItem('linfair_subscribers')
      const subs = raw ? JSON.parse(raw) : []
      subs.push({
        id: `sub-${Date.now()}`,
        email: email.trim(),
        createdAt: new Date().toISOString(),
        source: 'popup',
      })
      localStorage.setItem('linfair_subscribers', JSON.stringify(subs))
      setStatus('success')
      setMsg('Thank you for subscribing!')
      sessionStorage.setItem('linfair_popup_dismissed', 'true')
      setTimeout(() => {
        setShow(false)
        setStatus('idle')
      }, 2000)
    } catch {
      setStatus('error')
      setMsg('Something went wrong. Please try again.')
    }
  }

  const handleDismiss = () => {
    setShow(false)
    sessionStorage.setItem('linfair_popup_dismissed', 'true')
    setStatus('idle')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-[#FAF5EF] rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1B2A4A]/10 hover:bg-[#1B2A4A]/20 text-[#1B2A4A]/60 hover:text-[#1B2A4A] transition-all z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Decorative top bar */}
            <div className="h-2 bg-gradient-to-r from-[#C19A6B] via-[#D4A574] to-[#C19A6B]" />

            <div className="p-8 pt-6">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-[#C19A6B]/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-center font-display text-2xl font-bold text-[#1B2A4A] mb-2">
                Stay Inspired
              </h3>
              <p className="text-center text-[#1B2A4A]/60 text-sm mb-6 leading-relaxed">
                Subscribe to receive the latest knitwear trends, new collections, and exclusive offers directly to your inbox.
              </p>

              {/* Form */}
              {status === 'success' ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-700 font-medium">{msg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white border border-[#1B2A4A]/10 rounded-xl text-[#1B2A4A] text-sm focus:outline-none focus:border-[#C19A6B] focus:ring-2 focus:ring-[#C19A6B]/20 placeholder:text-[#1B2A4A]/30 transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1B2A4A] text-white text-sm font-medium rounded-xl hover:bg-[#1B2A4A]/90 transition-all active:scale-[0.98]"
                  >
                    Subscribe
                  </button>
                </form>
              )}

              {status === 'error' && (
                <p className="text-center text-red-500 text-xs mt-3">{msg}</p>
              )}

              {/* No thanks link */}
              {status !== 'success' && (
                <button
                  onClick={handleDismiss}
                  className="block mx-auto mt-4 text-xs text-[#1B2A4A]/40 hover:text-[#1B2A4A]/60 transition-colors"
                >
                  No thanks, I'll browse
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
