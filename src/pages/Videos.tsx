import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'
import { useLang } from '../context/LanguageContext'
import { videos, type Video } from '../data/videos'

// 为谷歌收录注入 VideoObject 结构化数据
function VideoSchema({ list }: { list: Video[] }) {
  useEffect(() => {
    const id = 'video-jsonld'
    const old = document.getElementById(id)
    if (old) old.remove()
    if (list.length === 0) return
    const items = list.map((v) => ({
      '@type': 'VideoObject',
      name: v.title,
      description: v.description,
      thumbnailUrl: v.thumbnail,
      embedUrl: v.embedUrl,
      uploadDate: v.date,
      contentUrl: v.embedUrl,
    }))
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': items })
    document.head.appendChild(script)
    return () => {
      const el = document.getElementById(id)
      if (el) el.remove()
    }
  }, [list])
  return null
}

export default function Videos() {
  const { t } = useLang()
  const [filter, setFilter] = useState<'all' | 'product' | 'brand'>('all')
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)

  const filteredVideos = filter === 'all' ? videos : videos.filter(v => v.type === filter)

  const filters = [
    { value: 'all' as const, label: t('videos.all') },
    { value: 'product' as const, label: t('videos.product') },
    { value: 'brand' as const, label: t('videos.brand') },
  ]

  return (
    <>
      <VideoSchema list={videos} />
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-accent text-xs tracking-wider uppercase font-medium mb-3 inline-block">{t('videos.heroTag')}</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-warm leading-[1.1]">{t('videos.heroTitle')}</h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-warm/60 leading-relaxed">{t('videos.heroDesc')}</p>
          </motion.div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-16 md:py-24 bg-warm">
        <div className="container-custom">
          {/* Filter */}
          <div className="flex gap-2 md:gap-3 justify-center mb-10 md:mb-16 overflow-x-auto scrollbar-hide pb-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium tracking-wide transition-all duration-200 rounded-full shrink-0 ${
                  filter === f.value
                    ? 'bg-primary text-warm shadow-md'
                    : 'bg-white text-text-light border border-accent/10 hover:border-accent/30'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-primary text-warm">
                      {video.type === 'product' ? t('videos.product') : t('videos.brand')}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-5 md:p-6">
                    <span className="text-accent text-xs tracking-wider uppercase font-medium">{video.category}</span>
                    <h3 className="mt-1 text-base md:text-lg font-display font-semibold text-primary leading-snug line-clamp-2">{video.title}</h3>
                    <p className="mt-2 text-xs md:text-sm text-text-light leading-relaxed line-clamp-2">{video.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-light">{t('videos.noVideos')}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-primary">{t('videos.ctaTitle')}</h2>
          <p className="mt-3 text-text-light max-w-lg mx-auto">{t('videos.ctaDesc')}</p>
          <div className="mt-6 flex gap-4 justify-center">
            <Button to="/contact" variant="accent">{t('videos.contactBtn')}</Button>
            <Button to="/products" variant="outline">{t('videos.viewProducts')}</Button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="mb-4 ml-auto w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors touch-manipulation"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src={activeVideo.embedUrl}
                  title={activeVideo.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-white text-lg font-display font-semibold">{activeVideo.title}</h3>
                <p className="text-white/60 text-sm mt-1">{activeVideo.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
