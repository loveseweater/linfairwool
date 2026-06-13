import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import { useSiteData } from '../utils/useSiteData'
import { useLang } from '../context/LanguageContext'

export default function BlogPost() {
  const { t } = useLang()
  const { id } = useParams()
  const { blogPosts } = useSiteData()
  const post = blogPosts.find((p) => p.id === id)

  if (!post) {
    return (
      <section className="py-32 bg-warm">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-display font-semibold text-primary">{t('blog.notFound')}</h1>
          <p className="mt-4 text-text-light">{t('blog.notFoundDesc')}</p>
          <div className="mt-8">
            <Button to="/blog" variant="accent">{t('blog.backBtn')}</Button>
          </div>
        </div>
      </section>
    )
  }

  // Simple Markdown-like rendering
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-display font-semibold text-primary mt-8 mb-3">{line.replace('## ', '')}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-display font-semibold text-primary mt-6 mb-2">{line.replace('### ', '')}</h3>
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-primary mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-text-light ml-4 mb-1 list-disc">{line.replace('- ', '')}</li>
      }
      if (line.startsWith('| ')) {
        return null // skip table rows for simplicity
      }
      if (line.trim() === '') {
        return <div key={i} className="h-3" />
      }
      return <p key={i} className="text-text-light leading-relaxed mb-2">{line}</p>
    })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img src={post.image} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Link to="/blog" className="text-accent text-sm hover:underline inline-flex items-center gap-1 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('blog.back')}
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-accent text-xs tracking-wider uppercase font-medium">{post.category}</span>
              <span className="text-warm/40 text-xs">|</span>
              <span className="text-warm/40 text-xs">{post.date}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-warm leading-tight">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-warm">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm"
          >
            {post.content ? (
              <div className="prose prose-sm max-w-none">
                {renderContent(post.content)}
              </div>
            ) : (
              <p className="text-text-light">{post.excerpt}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Related / CTA */}
      <section className="py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-display font-semibold text-primary">{t('blog.relatedTitle')}</h2>
          <p className="mt-3 text-text-light max-w-lg mx-auto">
            {t('blog.relatedDesc')}
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <Button to="/contact" variant="accent">{t('blog.contactBtn')}</Button>
            <Button to="/products" variant="outline">{t('blog.viewProducts')}</Button>
          </div>
        </div>
      </section>
    </>
  )
}
