import { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import SubscriptionPopup from '../ui/SubscriptionPopup'
import { useSiteData } from '../../utils/useSiteData'

export default function Layout({ children }: { children: ReactNode }) {
  const { siteContent } = useSiteData()
  const location = useLocation()
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Track page views
  useEffect(() => {
    try {
      const raw = localStorage.getItem('linfair_analytics')
      const events = raw ? JSON.parse(raw) : []
      events.push({
        page: location.pathname,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || 'direct',
      })
      // Keep only last 1000 events
      if (events.length > 1000) events.splice(0, events.length - 1000)
      localStorage.setItem('linfair_analytics', JSON.stringify(events))
    } catch {}
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const whatsapp = siteContent.contact.whatsapp?.replace(/[^0-9]/g, '')
  const whatsappMsg = siteContent.contact.whatsappMessage || 'Hello LINFAIR, I am interested in your knitwear products.'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 md:pt-20 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <SubscriptionPopup />

      {/* WhatsApp Floating Button */}
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BD5A] hover:scale-110 transition-all duration-300 group"
          title="Chat on WhatsApp"
        >
          <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
          </span>
        </a>
      )}

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-50 w-11 h-11 md:w-12 md:h-12 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-primary transition-all duration-300"
            title="Back to top"
          >
            <svg className="w-5 h-5 text-warm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
