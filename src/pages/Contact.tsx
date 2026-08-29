import { useState, FormEvent } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import HeroCarousel from '../components/ui/HeroCarousel'
import { useSiteData } from '../utils/useSiteData'
import { useLang } from '../context/LanguageContext'

interface FormData {
  name: string
  email: string
  company: string
  subject: string
  message: string
}

const initialForm: FormData = {
  name: '',
  email: '',
  company: '',
  subject: '',
  message: '',
}

export default function Contact() {
    usePageTitle('Contact Us | LINFAIR — Premium Knitwear Manufacturer')

  const { t } = useLang()
  const { siteContent } = useSiteData()
  const { contact } = siteContent

  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}
    if (!form.name.trim()) newErrors.name = `${t('contact.formName')} ${t('contact.formRequired')}`
    if (!form.email.trim()) newErrors.email = `${t('contact.formEmail')} ${t('contact.formRequired')}`
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = t('contact.formInvalidEmail')
    if (!form.subject.trim()) newErrors.subject = `${t('contact.formSubject')} ${t('contact.formRequired')}`
    if (!form.message.trim()) newErrors.message = `${t('contact.formMessage')} ${t('contact.formRequired')}`
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        // Fallback: open email client
        const params = new URLSearchParams({
          subject: `[LINFAIR Wool Inquiry] ${form.subject}`,
          body: `Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
        })
        window.location.href = `mailto:${contact.email}?${params.toString()}`
        setSubmitted(true)
      }
    } catch {
      // Fallback: open email client
      const params = new URLSearchParams({
        subject: `[LINFAIR Wool Inquiry] ${form.subject}`,
        body: `Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
      })
      window.location.href = `mailto:${contact.email}?${params.toString()}`
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-primary overflow-hidden">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0">
          <HeroCarousel images={contact.heroImages} className="opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-accent text-xs tracking-[0.2em] uppercase font-medium">{contact.subtitle}</span>
            <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-warm leading-[1.1]">
              {contact.title}
              <br />
              <span className="text-accent">{contact.titleHighlight}</span>
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-warm/60 leading-relaxed">
              {contact.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24 bg-warm">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-10 md:gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              {submitted ? (
                <div className="bg-white p-12 text-center rounded-2xl">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-primary">{t('contact.thankYou')}</h3>
                  <p className="mt-3 text-text-light">
                    {t('contact.thankYouMsg')}
                  </p>
                  <div className="mt-6">
                    <Button variant="outline" onClick={() => { setSubmitted(false); setForm(initialForm) }}>
                      {t('contact.sendAnother')}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <h2 className="text-2xl font-display font-semibold text-primary mb-2">{contact.formTitle}</h2>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                        {t('contact.formName')} <span className="text-rust">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className={`w-full px-4 py-3 bg-white border ${errors.name ? 'border-rust/50' : 'border-transparent'} focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm rounded-xl`}
                        placeholder={t('contact.formPlaceholderName')}
                      />
                      {errors.name && <p className="mt-1 text-xs text-rust">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                        {t('contact.formEmail')} <span className="text-rust">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={`w-full px-4 py-3 bg-white border ${errors.email ? 'border-rust/50' : 'border-transparent'} focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm rounded-xl`}
                        placeholder={t('contact.formPlaceholderEmail')}
                      />
                      {errors.email && <p className="mt-1 text-xs text-rust">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-text mb-2">
                      {t('contact.formCompany')}
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={form.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-transparent focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm rounded-xl"
                      placeholder={t('contact.formPlaceholderCompany')}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-text mb-2">
                      {t('contact.formSubject')} <span className="text-rust">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={form.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      className={`w-full px-4 py-3 bg-white border ${errors.subject ? 'border-rust/50' : 'border-transparent'} focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm rounded-xl`}
                      placeholder={t('contact.formPlaceholderSubject')}
                    />
                    {errors.subject && <p className="mt-1 text-xs text-rust">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                      {t('contact.formMessage')} <span className="text-rust">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      className={`w-full px-4 py-3 bg-white border ${errors.message ? 'border-rust/50' : 'border-transparent'} focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm resize-none rounded-xl`}
                      placeholder={t('contact.formPlaceholderMessage')}
                    />
                    {errors.message && <p className="mt-1 text-xs text-rust">{errors.message}</p>}
                  </div>

                  <Button variant="accent" disabled={submitting}>
                    {submitting ? t('contact.formSending') : t('contact.formSubmit')}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white p-6 md:p-10 rounded-2xl">
                <h3 className="text-xl font-display font-semibold text-primary mb-8">{t('contact.infoTitle')}</h3>

                <div className="space-y-6 md:space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-primary">{t('contact.address')}</h4>
                    </div>
                    <p className="text-text-light text-sm ml-13">
                      {contact.address}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-primary">{t('contact.email')}</h4>
                    </div>
                    <p className="text-text-light text-sm ml-13">
                      <a href={`mailto:${contact.email}`} className="hover:text-accent transition-colors">
                        {contact.email}
                      </a>
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-primary">{t('contact.phone')}</h4>
                    </div>
                    <p className="text-text-light text-sm ml-13">
                      <a href={`tel:${contact.phone}`} className="hover:text-accent transition-colors">
                        {contact.phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(contact.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full px-6 py-3.5 bg-[#25D366] text-white font-medium rounded-xl hover:bg-[#20BD5A] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {t('contact.whatsapp')}
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-primary mb-4">{t('contact.hours')}</h4>
                  <p className="text-text-light text-sm">{contact.workingHours}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
