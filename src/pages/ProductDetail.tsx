import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import { products, findProductBySlug } from '../data/products'
import { useLang } from '../context/LanguageContext'

const SITE_URL = 'https://linfairwool.cn'

/**
 * 产品详情页 —— 独立可索引 URL：/products/<slug>
 *
 * AEO/GEO 设计：
 *  - 每页注入 Product + FAQPage + BreadcrumbList 结构化数据（Google/AI 引擎可直接引用）
 *  - 正文给出可验证的具体事实（MOQ / 周期 / 成分 / 认证），AI 引擎偏好可引用数字
 *  - FAQ 区块与 FAQPage schema 内容完全一致，避免结构化数据与正文不匹配
 */
export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useLang()
  const product = slug ? findProductBySlug(slug) : undefined
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (!product) return
    document.title = `${product.name} | Custom Manufacturer | LINFAIR`
    const path = `/products/${product.slug ?? product.id}`
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      link.href = SITE_URL
      document.head.appendChild(link)
    }
    link.setAttribute('href', `${SITE_URL}${path}`)

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', product.longDescription?.slice(0, 300) ?? product.description)

    if (product.keywords?.length) {
      let kw = document.querySelector<HTMLMetaElement>('meta[name="keywords"]')
      if (!kw) {
        kw = document.createElement('meta')
        kw.setAttribute('name', 'keywords')
        document.head.appendChild(kw)
      }
      kw.setAttribute('content', product.keywords.join(', '))
    }
  }, [product])

  // ── 结构化数据：Product + FAQPage + BreadcrumbList ──
  useEffect(() => {
    const id = 'product-jsonld'
    document.getElementById(id)?.remove()
    if (!product) return

    const path = `/products/${product.slug ?? product.id}`
    const images = (product.gallery?.length ? product.gallery : [product.image]).map((img) =>
      img.startsWith('http') ? img : `${SITE_URL}${img}`
    )

    const productNode: Record<string, unknown> = {
      '@type': 'Product',
      '@id': `${SITE_URL}${path}#product`,
      name: product.name,
      description: product.longDescription ?? product.description,
      image: images,
      sku: product.id,
      category: product.productType ?? product.subcategory,
      brand: { '@type': 'Brand', name: 'LINFAIR' },
      manufacturer: {
        '@type': 'Organization',
        name: 'Dongguan Lingfei Textile Co., Ltd.',
        url: SITE_URL,
      },
      material: product.materials?.join(', '),
      audience: { '@type': 'BusinessAudience', audienceType: 'Fashion brands, retailers and importers' },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          valueAddedTaxIncluded: false,
          description: 'FOB pricing quoted per order. MOQ and lead time available on request.',
        },
        seller: { '@type': 'Organization', name: 'LINFAIR' },
        url: `${SITE_URL}/contact`,
      },
    }
    if (product.moq) productNode.additionalProperty = []
    const props: Record<string, unknown>[] = []
    if (product.moq) props.push({ '@type': 'PropertyValue', name: 'Minimum Order Quantity', value: product.moq })
    if (product.leadTime) props.push({ '@type': 'PropertyValue', name: 'Lead Time', value: product.leadTime })
    if (product.construction?.length)
      props.push({ '@type': 'PropertyValue', name: 'Construction', value: product.construction.join('; ') })
    if (product.certifications?.length)
      props.push({ '@type': 'PropertyValue', name: 'Certifications', value: product.certifications.join('; ') })
    if (props.length) productNode.additionalProperty = props

    const graph: Record<string, unknown>[] = [productNode]

    if (product.faqs?.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${SITE_URL}${path}#faq`,
        mainEntity: product.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      })
    }

    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
        { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}${path}` },
      ],
    })

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
    document.head.appendChild(script)
    return () => void document.getElementById(id)?.remove()
  }, [product])

  if (!product) {
    return (
      <section className="py-32 bg-warm">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-display font-semibold text-primary">Product Not Found</h1>
          <p className="mt-4 text-text-light">The product you are looking for does not exist or has been moved.</p>
          <div className="mt-8">
            <Button to="/products" variant="accent">
              {t('products.all') || 'Back to Products'}
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const images = product.gallery?.length ? product.gallery : [product.image]
  const related = products
    .filter((p) => p.id !== product.id && p.productType && p.productType === product.productType)
    .slice(0, 3)

  const facts: { label: string; value: string }[] = []
  if (product.moq) facts.push({ label: 'Minimum Order', value: product.moq })
  if (product.leadTime) facts.push({ label: 'Lead Time', value: product.leadTime })

  return (
    <>
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="bg-warm border-b border-black/5">
        <div className="container-custom py-4 text-xs text-text-light">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-accent transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/products" className="hover:text-accent transition-colors">
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-primary font-medium" aria-current="page">
              {product.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* ── Main ── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            {/* Gallery */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="aspect-[3/4] bg-warm rounded-2xl overflow-hidden">
                <img
                  src={images[activeImage]}
                  alt={`${product.name} — view ${activeImage + 1} of ${images.length}`}
                  className="w-full h-full object-cover"
                  decoding="async"
                />
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        i === activeImage ? 'border-accent ring-1 ring-accent/30' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-3">
                {product.productType && (
                  <span className="text-accent text-xs tracking-wider uppercase font-medium">{product.productType}</span>
                )}
                <span className="text-text-light text-xs">|</span>
                <span className="text-text-light text-xs">{product.subcategory}</span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-primary leading-tight">
                {product.name}
              </h1>

              <p className="mt-5 text-text-light leading-relaxed">{product.description}</p>

              {/* Fact box — 可直接被 AI 引擎引用的具体数字 */}
              {facts.length > 0 && (
                <dl className="mt-6 grid grid-cols-2 gap-3">
                  {facts.map((f) => (
                    <div key={f.label} className="bg-warm rounded-xl px-4 py-3">
                      <dt className="text-[11px] uppercase tracking-wider text-text-light">{f.label}</dt>
                      <dd className="mt-1 text-sm font-medium text-primary">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-7 space-y-3">
                <Button to="/contact" variant="accent" className="w-full py-3">
                  {t('products.inquireAbout')}
                </Button>
                {product.amazonUrl && (
                  <a
                    href={product.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#FF9900] text-white font-semibold rounded-xl hover:bg-[#E88F00] transition-all active:scale-[0.98]"
                  >
                    Shop on Amazon
                  </a>
                )}
              </div>

              {/* Spec chips */}
              {product.specs.length > 0 && (
                <ul className="mt-7 flex flex-wrap gap-2">
                  {product.specs.map((s) => (
                    <li key={s} className="text-xs bg-warm px-3 py-1.5 rounded-full text-text-light">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Long description (answer-first) ── */}
      {product.longDescription && (
        <section className="py-12 md:py-16 bg-warm">
          <div className="container-custom max-w-4xl">
            <h2 className="text-xl md:text-2xl font-display font-semibold text-primary">
              About This Product
            </h2>
            <p className="mt-4 text-text leading-relaxed">{product.longDescription}</p>
          </div>
        </section>
      )}

      {/* ── Specification tables ── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <DetailList title="Materials & Composition" items={product.materials} />
            <DetailList title="Construction & Craft" items={product.construction} />
            <DetailList title="Customization Options" items={product.customization} />
            <DetailList title="Certifications & Compliance" items={product.certifications} />
            <DetailList title="Care Instructions" items={product.careInstructions} />
            <DetailList title="Applications & Markets" items={product.applications} />
          </div>
        </div>
      </section>

      {/* ── FAQ (与 FAQPage schema 完全一致) ── */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="py-12 md:py-20 bg-warm" id="faq">
          <div className="container-custom max-w-4xl">
            <span className="text-accent text-xs tracking-[0.2em] uppercase font-medium">Buyer Questions</span>
            <h2 className="mt-2 text-2xl md:text-3xl font-display font-semibold text-primary">
              Frequently Asked Questions
            </h2>
            <div className="mt-8 space-y-3">
              {product.faqs.map((f, i) => (
                <FaqItem key={i} question={f.q} answer={f.a} defaultOpen={i === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related ── */}
      {related.length > 0 && (
        <section className="py-12 md:py-20 bg-white">
          <div className="container-custom">
            <h2 className="text-xl md:text-2xl font-display font-semibold text-primary mb-8">
              More in {product.productType}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
              {related.map((p) => (
                <Link key={p.id} to={`/products/${p.slug ?? p.id}`} className="group">
                  <div className="aspect-[3/4] bg-warm rounded-xl overflow-hidden mb-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 className="text-sm md:text-base font-display font-semibold text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                    {p.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container-custom text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-warm">
            {t('products.ctaTitle')}
          </h2>
          <p className="mt-4 text-warm/60">{t('products.ctaDesc')}</p>
          <div className="mt-8">
            <Button to="/contact" variant="accent">
              {t('products.ctaBtn')}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function DetailList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null
  return (
    <div>
      <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-accent rounded-full" />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-text-light bg-warm px-3 py-2 rounded-lg leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function FaqItem({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 text-left px-5 py-4 hover:bg-black/[0.02] transition-colors"
      >
        <span className="text-sm md:text-base font-medium text-primary">{question}</span>
        <svg
          className={`w-5 h-5 text-accent shrink-0 mt-0.5 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 -mt-1">
          <p className="text-sm text-text-light leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}
