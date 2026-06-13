import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../../utils/useSiteData'
import { useLang } from '../../context/LanguageContext'

const socialIcons: Record<string, JSX.Element> = {
  Facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  ),
  Instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  ),
  LinkedIn: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  ),
  Pinterest: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.782c0-1.67.968-2.925 2.171-2.925 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
  ),
  YouTube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  ),
  TikTok: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  ),
  'Twitter/X': (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
}

export default function Footer() {
  const { siteContent } = useSiteData()
  const { t } = useLang()
  const enabledSocials = siteContent.socialLinks.filter(s => s.enabled)
  const [subEmail, setSubEmail] = useState('')
  const [subMsg, setSubMsg] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail)) {
      setSubMsg('Please enter a valid email')
      return
    }
    try {
      const raw = localStorage.getItem('linfair_subscribers')
      const subs = raw ? JSON.parse(raw) : []
      subs.push({ id: `sub-${Date.now()}`, email: subEmail, createdAt: new Date().toISOString() })
      localStorage.setItem('linfair_subscribers', JSON.stringify(subs))
      setSubMsg('Subscribed! Thank you.')
      setSubEmail('')
      setTimeout(() => setSubMsg(''), 3000)
    } catch {
      setSubMsg('Failed to subscribe')
    }
  }

  return (
    <footer className="bg-primary text-warm">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img src={siteContent.logo || '/logo.png?v=2'} alt="LINFAIR" className="h-14 w-auto" />
            </div>
            <p className="text-warm/60 text-sm leading-relaxed mb-6">
              {t('footer.brandDesc')}
            </p>
            {enabledSocials.length > 0 && (
              <div className="flex items-center gap-3">
                {enabledSocials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className="w-9 h-9 bg-white/5 hover:bg-accent hover:text-primary rounded-full flex items-center justify-center text-warm/60 hover:text-primary transition-all duration-300"
                  >
                    {socialIcons[social.name] || (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/></svg>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', labelKey: 'nav.home' },
                { to: '/about', labelKey: 'nav.about' },
                { to: '/products', labelKey: 'nav.products' },
                { to: '/blog', labelKey: 'nav.blog' },
                { to: '/contact', labelKey: 'nav.contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-warm/50 hover:text-accent text-sm transition-colors duration-200"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">{t('footer.collections')}</h3>
            <ul className="space-y-2.5">
              {[
                { labelKey: 'footer.menSweaters' },
                { labelKey: 'footer.womenSweaters' },
                { labelKey: 'footer.cashmere' },
                { labelKey: 'footer.merino' },
              ].map((item) => (
                <li key={item.labelKey}>
                  <Link
                    to="/products"
                    className="text-warm/50 hover:text-accent text-sm transition-colors duration-200"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-warm/50 text-sm">
              <li>{siteContent.contact.address}</li>
              <li>
                <a href={`mailto:${siteContent.contact.email}`} className="hover:text-accent transition-colors duration-200">
                  {siteContent.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteContent.contact.phone}`} className="hover:text-accent transition-colors duration-200">
                  {siteContent.contact.phone}
                </a>
              </li>
            </ul>

            {/* Newsletter Subscribe */}
            <div className="mt-6">
              <h4 className="text-warm text-sm font-medium mb-2">Newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-warm text-xs focus:outline-none focus:border-accent placeholder:text-warm/30"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-primary text-xs font-medium rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              {subMsg && (
                <p className={`text-xs mt-2 ${subMsg.includes('Subscribed') ? 'text-green-400' : 'text-red-400'}`}>
                  {subMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-warm/30 text-xs">
            &copy; {new Date().getFullYear()} LINFAIR Wool. {t('footer.rights')}
          </p>
          {enabledSocials.length > 0 && (
            <div className="flex items-center gap-4">
              {enabledSocials.slice(0, 4).map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm/30 hover:text-accent text-xs transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
