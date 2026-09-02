import { useState, useRef, useCallback } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'
import HeroCarousel from '../components/ui/HeroCarousel'
import { useSiteData } from '../utils/useSiteData'
import { useLang } from '../context/LanguageContext'

export default function Products() {
    usePageTitle('Knitwear Collection | LINFAIR — Sweaters, Cardigans & Knit Tops', '/products')

  const { t } = useLang()
  const { products, blogPosts, siteContent } = useSiteData()
  const categories = ['All', ...(siteContent.categories || ['Women'])]
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  const filtered = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory)

  const openDetail = (product: typeof products[0]) => {
    setSelectedProduct(product)
    setSelectedImage(0)
    document.body.style.overflow = 'hidden'
  }

  const closeDetail = () => {
    setSelectedProduct(null)
    document.body.style.overflow = ''
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <HeroCarousel images={siteContent.productsHeroImages} className="opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-accent text-xs tracking-[0.2em] uppercase font-medium">{t('products.heroSubtitle')}</span>
            <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-warm leading-[1.1]">
              {t('products.heroTitle')}
              <br />
              <span className="text-accent">{t('products.heroHighlight')}</span>
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-warm/60 leading-relaxed">
              {t('products.heroDesc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 bg-warm">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="flex gap-2 md:gap-3 justify-center mb-10 md:mb-16 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium tracking-wide transition-all duration-200 rounded-full shrink-0 ${
                  activeCategory === cat
                    ? 'bg-primary text-warm'
                    : 'bg-white text-text hover:bg-primary/10'
                }`}
              >
                {cat === 'All' ? t('products.all') : cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={openDetail}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-text-light">
              {t('products.noProducts')}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            onClose={closeDetail}
          />
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-primary">
              {t('products.ctaTitle')}
            </h2>
            <p className="mt-4 text-text-light max-w-xl mx-auto">
              {t('products.ctaDesc')}
            </p>
            <div className="mt-8">
              <Button to="/contact" variant="accent">
                {t('products.ctaBtn')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Latest Articles */}
      <section className="py-16 md:py-24 bg-warm">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <span className="text-accent text-xs tracking-[0.2em] uppercase font-medium">{t('products.articlesSubtitle')}</span>
              <h2 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-primary leading-tight">
                {t('products.articlesTitle')}
              </h2>
            </div>
            <Link to="/blog" className="text-accent text-sm font-medium hover:text-accent-dark transition-colors inline-flex items-center gap-2 shrink-0">
              {t('products.viewAllArticles')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[16/10] overflow-hidden bg-warm">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy" decoding="async"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent text-xs tracking-wider uppercase font-medium">{post.category}</span>
                    <span className="text-text-light text-xs">|</span>
                    <span className="text-text-light text-xs">{post.date}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-display font-semibold text-primary leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-text-light text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 text-accent text-sm font-medium inline-flex items-center gap-2">
                    {t('products.readArticle')}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── Product Card with Image Carousel ─── */
function ProductCard({
  product,
  onOpenDetail,
}: {
  product: any
  onOpenDetail: (p: any) => void
}) {
  const { t } = useLang()
  const [imgIndex, setImgIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const images = product.gallery?.length > 0 ? product.gallery : [product.image]

  const startAutoPlay = useCallback(() => {
    stopAutoPlay()
    intervalRef.current = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length)
    }, 2500)
  }, [images.length])

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const goTo = (i: number) => {
    setImgIndex(i)
    startAutoPlay()
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={() => onOpenDetail(product)}
    >
      {/* Image Carousel */}
      <div
        className="aspect-[3/4] bg-white rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4 relative"
        onMouseEnter={startAutoPlay}
        onMouseLeave={stopAutoPlay}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIndex}
            src={images[imgIndex]}
            alt={`${product.name} - ${imgIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            loading="lazy" decoding="async"
          />
        </AnimatePresence>

        {/* Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_: string, i: number) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === imgIndex ? 'bg-accent w-3' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">
            {imgIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-accent text-[10px] md:text-xs tracking-wider uppercase font-medium">{product.category}</span>
        <span className="hidden md:inline text-text-light text-xs">|</span>
        <span className="hidden md:inline text-text-light text-xs">{product.subcategory}</span>
      </div>
      <h3 className="text-sm md:text-lg font-display font-semibold text-primary leading-snug line-clamp-2">{product.name}</h3>
      <p className="mt-1 text-xs md:text-sm text-text-light leading-relaxed line-clamp-2">{product.description}</p>
      <div className="mt-2 md:mt-3 hidden md:flex flex-wrap gap-1.5">
        {product.specs.slice(0, 3).map((spec: string) => (
          <span key={spec} className="text-[10px] bg-white px-2 py-1 rounded-full text-text-light border border-gray-100">
            {spec}
          </span>
        ))}
        {product.specs.length > 3 && (
          <span className="text-[10px] text-accent px-2 py-1">+{product.specs.length - 3} more</span>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <Button to="/contact" variant="outline" className="w-full text-[11px] md:text-xs py-2">
          {t('products.inquire')}
        </Button>
        {product.amazonUrl && (
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#FF9900] text-white text-xs font-semibold rounded-xl hover:bg-[#E88F00] transition-all active:scale-[0.98]"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 14.5c-.5.5-1.2.7-1.9.7-1.5 0-2.8-.8-3.5-2-.7 1.2-2 2-3.5 2-.7 0-1.4-.2-1.9-.7-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0 .3.3.7.5 1.1.5 1 0 1.9-.6 2.3-1.5.1-.2.1-.5.1-.7V10.5h-1.5c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h1.5V7.5c0-.4.3-.8.8-.8s.8.3.8.8v1.5h1.5c.4 0 .8.3.8.8s-.3.8-.8.8h-1.5v3.5c0 .3.1.5.2.7.3.6.9 1 1.5 1 .4 0 .8-.2 1.1-.5.3-.3.8-.3 1.1 0 .2.3.2.8-.1 1.1z"/>
            </svg>
            Shop on Amazon
          </a>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Product Detail Modal (like e-commerce detail page) ─── */
function ProductDetail({
  product,
  selectedImage,
  setSelectedImage,
  onClose,
}: {
  product: any
  selectedImage: number
  setSelectedImage: (i: number) => void
  onClose: () => void
}) {
  const { t } = useLang()
  const images = product.gallery?.length > 0 ? product.gallery : [product.image]
  const [showVideo, setShowVideo] = useState(false)
  const hasVideo = !!product.video

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-t-2xl md:rounded-2xl max-w-5xl w-full max-h-[90vh] md:max-h-[90vh] overflow-y-auto fixed bottom-0 md:relative md:m-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* ── Left: Image Gallery ── */}
          <div className="bg-gray-50 p-4 md:p-8">
            <button
              onClick={onClose}
              className="mb-4 w-10 h-10 bg-black/10 rounded-full flex items-center justify-center text-primary hover:bg-black/20 transition-colors touch-manipulation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main Image / Video */}
            <div className="aspect-[3/4] flex items-center justify-center mb-4 bg-white rounded-xl overflow-hidden relative">
              {showVideo && hasVideo ? (
                <div className="w-full h-full">
                  <iframe
                    src={product.video}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${product.name} video`}
                  />
                </div>
              ) : (
                <img
                  src={images[selectedImage]}
                  alt={`${product.name} - View ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              {hasVideo && !showVideo && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 bg-black/30 flex items-center justify-center group transition-opacity hover:bg-black/40"
                >
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>
              )}
            </div>

            {/* Video / Image toggle */}
            {hasVideo && (
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setShowVideo(false)}
                  className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                    !showVideo ? 'bg-accent text-white' : 'bg-gray-100 text-text-light hover:bg-gray-200'
                  }`}
                >
                  {t('products.photos')}
                </button>
                <button
                  onClick={() => setShowVideo(true)}
                  className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                    showVideo ? 'bg-accent text-white' : 'bg-gray-100 text-text-light hover:bg-gray-200'
                  }`}
                >
                  {t('products.video')}
                </button>
              </div>
            )}

            {/* Thumbnail Strip */}
            {!showVideo && images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all duration-200 ${
                      i === selectedImage
                        ? 'border-accent ring-1 ring-accent/30'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Details ── */}
          <div className="p-4 md:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-accent text-xs tracking-wider uppercase font-medium">{product.category}</span>
              <span className="text-text-light text-xs">|</span>
              <span className="text-text-light text-xs">{product.subcategory}</span>
            </div>

            <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-semibold text-primary leading-tight">
              {product.name}
            </h2>

            <div className="mt-6 flex-1">
              <p className="text-text-light leading-relaxed">{product.description}</p>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {t('products.specs')}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {product.specs.map((spec: string) => (
                    <div key={spec} className="flex items-center gap-2 text-sm text-text-light bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                      {spec}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {product.amazonUrl && (
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#FF9900] text-white font-semibold rounded-xl hover:bg-[#E88F00] transition-all active:scale-[0.98]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 14.5c-.5.5-1.2.7-1.9.7-1.5 0-2.8-.8-3.5-2-.7 1.2-2 2-3.5 2-.7 0-1.4-.2-1.9-.7-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0 .3.3.7.5 1.1.5 1 0 1.9-.6 2.3-1.5.1-.2.1-.5.1-.7V10.5h-1.5c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h1.5V7.5c0-.4.3-.8.8-.8s.8.3.8.8v1.5h1.5c.4 0 .8.3.8.8s-.3.8-.8.8h-1.5v3.5c0 .3.1.5.2.7.3.6.9 1 1.5 1 .4 0 .8-.2 1.1-.5.3-.3.8-.3 1.1 0 .2.3.2.8-.1 1.1z"/>
                  </svg>
                  Shop on Amazon
                </a>
              )}
              <Button to="/contact" variant="accent" className="w-full py-3">
                {t('products.inquireAbout')}
              </Button>
              <Button to="/contact" variant="outline" className="w-full py-3">
                {t('products.requestQuote')}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
