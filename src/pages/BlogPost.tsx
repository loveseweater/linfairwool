import { usePageTitle } from '../hooks/usePageTitle'
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
  usePageTitle(post ? `${post.title} | LINFAIR` : 'Article | LINFAIR')

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

  // Find previous and next posts by array order for continuous reading
  const postIndex = blogPosts.findIndex((p) => p.id === id)
  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : undefined
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : undefined

  // Find related posts (same category, exclude current)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 2)

  // Enhanced Markdown-like rendering
  const renderContent = (text: string) => {
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    let inTable = false
    let tableRows: string[][] = []
    let inList = false
    let listItems: string[] = []

    const flushList = (key: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="text-text-light ml-6 mb-4 space-y-1 list-disc">
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
            ))}
          </ul>
        )
        listItems = []
      }
      inList = false
    }

    const flushTable = (key: string) => {
      if (tableRows.length > 1) {
        // First row is header, second row is separator (skip), rest are data
        const header = tableRows[0]
        const body = tableRows.slice(2)
        elements.push(
          <div key={`table-${key}`} className="overflow-x-auto my-6">
            <table className="w-full text-xs md:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-accent/30">
                  {header.map((h, i) => (
                    <th key={i} className="text-left py-2 px-3 font-semibold text-primary">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} className="border-b border-gray-100">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 px-3 text-text-light" dangerouslySetInnerHTML={{ __html: renderInline(cell.trim()) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      tableRows = []
      inTable = false
    }

    // Render inline formatting: **bold**, [link](url)
    const renderInline = (text: string): string => {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline hover:text-accent-dark">$1</a>')
    }

    lines.forEach((line, i) => {
      // Table detection
      if (line.startsWith('| ') || line.startsWith('|')) {
        if (!inTable) inTable = true
        const cells = line.split('|').filter((_c, idx, arr) => idx > 0 && idx < arr.length - 1)
        if (!cells.every(c => c.trim().match(/^[-:]+$/))) {
          tableRows.push(cells)
        }
        return
      } else if (inTable) {
        flushTable(`${i}`)
      }

      // List detection
      if (line.startsWith('- ')) {
        if (!inList) inList = true
        listItems.push(line.replace('- ', ''))
        return
      } else if (inList) {
        flushList(`${i}`)
      }

      // Headings
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-display font-semibold text-primary mt-8 mb-3">{line.replace('## ', '')}</h2>)
        return
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-display font-semibold text-primary mt-6 mb-2">{line.replace('### ', '')}</h3>)
        return
      }

      // Empty line
      if (line.trim() === '') {
        elements.push(<div key={i} className="h-4" />)
        return
      }

      // Regular paragraph with inline formatting
      elements.push(
        <p key={i} className="text-text-light leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
      )
    })

    // Flush any remaining lists or tables
    flushList('end')
    flushTable('end')

    return elements
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img src={post.image} alt="" className="w-full h-full object-cover opacity-20" loading="eager" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Link to="/blog" className="text-accent text-sm hover:underline inline-flex items-center gap-1 mb-4 touch-manipulation">
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
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-display font-bold text-warm leading-[1.1]">
              {post.title}
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-warm/60 leading-relaxed">{post.excerpt}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-warm">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto bg-white rounded-2xl p-5 md:p-12 shadow-sm"
          >
            {post.content ? (
              <div className="prose prose-sm max-w-none">
                {renderContent(post.content)}
              </div>
            ) : (
              <p className="text-text-light">{post.excerpt}</p>
            )}
          </motion.div>

          {/* Previous / Next navigation for continuous reading */}
          {(prevPost || nextPost) && (
            <div className="max-w-3xl mx-auto mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {prevPost ? (
                  <Link
                    to={`/blog/${prevPost.id}`}
                    className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-accent/40 hover:shadow-md transition-all flex flex-col gap-2"
                  >
                    <span className="text-accent text-xs tracking-wider uppercase font-medium inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </span>
                    <span className="text-sm font-display font-semibold text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                      {prevPost.title}
                    </span>
                  </Link>
                ) : (
                  <div className="hidden sm:block" />
                )}
                {nextPost ? (
                  <Link
                    to={`/blog/${nextPost.id}`}
                    className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-accent/40 hover:shadow-md transition-all flex flex-col gap-2 text-right sm:items-end"
                  >
                    <span className="text-accent text-xs tracking-wider uppercase font-medium inline-flex items-center gap-1">
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-display font-semibold text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                      {nextPost.title}
                    </span>
                  </Link>
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="max-w-3xl mx-auto mt-12">
              <h3 className="text-lg md:text-xl font-display font-semibold text-primary mb-4 md:mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/blog/${rp.id}`}
                    className="bg-white rounded-xl overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy" decoding="async"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-accent text-xs tracking-wider uppercase font-medium">{rp.category}</span>
                      <h4 className="mt-1 text-base font-display font-semibold text-primary leading-snug line-clamp-2">{rp.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-xl md:text-2xl font-display font-semibold text-primary">{t('blog.relatedTitle')}</h2>
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
