import { usePageTitle } from '../hooks/usePageTitle'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import HeroCarousel from '../components/ui/HeroCarousel'
import { useSiteData } from '../utils/useSiteData'
import { useLang } from '../context/LanguageContext'

export default function Blog() {
    usePageTitle('Blog & Knitwear Insights | LINFAIR')

  const { t } = useLang()
  const { blogPosts, siteContent } = useSiteData()
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-primary overflow-hidden">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0">
          <HeroCarousel images={siteContent.blogHeroImages} className="opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-accent text-xs tracking-[0.2em] uppercase font-medium">{t('blog.heroSubtitle')}</span>
            <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-warm leading-[1.1]">
              {t('blog.heroTitle')}
              <br />
              <span className="text-accent">{t('blog.heroHighlight')}</span>
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-warm/60 leading-relaxed">
              {t('blog.heroDesc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 md:py-24 bg-warm">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden group"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy" decoding="async"
                  />
                </div>
                <div className="p-5 md:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-accent text-xs tracking-wider uppercase font-medium">{post.category}</span>
                    <span className="text-text-light text-xs">|</span>
                    <span className="text-text-light text-xs">{post.date}</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-display font-semibold text-primary leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-2 md:mt-3 text-text-light text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-6">
                    <Link to={`/blog/${post.id}`} className="text-accent text-sm font-medium hover:text-accent-dark transition-colors inline-flex items-center gap-2">
                      {t('blog.readMore')}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-primary">
              {t('blog.ctaTitle')}
            </h2>
            <p className="mt-4 text-text-light">
              {t('blog.ctaDesc')}
            </p>
            <div className="mt-8">
              <Button to="/contact" variant="accent">
                {t('blog.ctaBtn')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
