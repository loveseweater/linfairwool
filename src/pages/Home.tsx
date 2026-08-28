import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'
import { useSiteData } from '../utils/useSiteData'
import { useLang } from '../context/LanguageContext'

const iconPaths: Record<string, JSX.Element> = {
  'Premium Materials': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  'Expert Craftsmanship': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.644 5.644a1.5 1.5 0 01-2.121 0l-.707-.707a1.5 1.5 0 010-2.121l5.644-5.644m2.122 2.122l5.644-5.644a1.5 1.5 0 012.121 0l.707.707a1.5 1.5 0 010 2.121l-5.644 5.644m-4.243-4.243l5.656-5.656" />
    </svg>
  ),
  'Custom Design': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  'Quality Control': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

export default function Home() {
  const { products, siteContent } = useSiteData()
  const { t } = useLang()
  const featuredProducts = products.slice(0, 4)
  const { hero, stats, brandStory, advantages, cta } = siteContent.home

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/factory-production-floor.jpg" alt="LINFAIR Knitwear Factory" width="780" height="470" fetchPriority="high" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/75 via-primary/45 to-primary/75" />
        </div>

        <div className="container-custom relative z-10 py-28 md:py-28 md:py-32">
          <div className="flex justify-start">
            <div className="max-w-3xl text-left">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block text-accent text-sm tracking-[0.2em] uppercase font-medium mb-6"
              >
                {hero.subtitle}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-warm leading-tight"
              >
                {hero.title}
                <br />
                <span className="text-accent">{hero.titleHighlight}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-5 md:mt-6 text-base md:text-lg text-warm/70 max-w-2xl leading-relaxed"
              >
                {hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 md:mt-10 flex flex-wrap gap-3 md:gap-4 justify-start"
              >
                <Button to="/products" variant="accent">
                  {hero.button1Text}
                </Button>
                <Button to={hero.button2Link} variant="outline-light">
                  {hero.button2Text}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-warm/20 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-accent rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-xs md:text-sm text-text-light">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-warm">
        <div className="container-custom">
          <SectionTitle
            subtitle={t('home.featuredSubtitle')}
            title={t('home.featuredTitle')}
            description={t('home.featuredDesc')}
          />

          <div className="mt-10 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="aspect-[3/4] bg-warm-dark rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy" decoding="async"
                  />
                </div>
                <span className="text-accent text-xs tracking-wider uppercase font-medium">{product.category}</span>
                <h3 className="mt-1 text-sm md:text-lg font-display font-semibold text-primary leading-snug line-clamp-2">{product.name}</h3>
                <p className="mt-1 text-xs md:text-sm text-text-light leading-relaxed line-clamp-2">{product.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <Button to="/products" variant="outline">
              {t('home.viewAll')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-accent text-xs tracking-[0.2em] uppercase font-medium">
                {brandStory.subtitle}
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-primary leading-tight">
                {brandStory.title}
                <br />
                <span className="text-accent">{brandStory.titleHighlight}</span>
              </h2>
              {brandStory.paragraphs.map((p, i) => (
                <p key={i} className="mt-6 text-text-light leading-relaxed">{p}</p>
              ))}
              <div className="mt-8">
                <Button to={brandStory.buttonLink} variant="outline">
                  {brandStory.buttonText}
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={brandStory.image}
                  alt="Knitwear craftsmanship"
                  className="w-full h-full object-cover"
                  loading="lazy" decoding="async"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-full hidden md:block" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container-custom">
          <SectionTitle
            subtitle={t('home.whyUs')}
            title={t('home.whyUsTitle')}
            description={t('home.whyUsDesc')}
            light
          />

          <div className="mt-10 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {advantages.map((adv, index) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/10 text-accent mb-4 md:mb-5">
                  {iconPaths[adv.title] || iconPaths['Premium Materials']}
                </div>
                <h3 className="text-warm font-display text-base md:text-xl font-semibold mb-2 md:mb-3">{adv.title}</h3>
                <p className="text-warm/50 text-xs md:text-sm leading-relaxed">{adv.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-warm">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-primary">
              {t('home.ctaTitle')}
            </h2>
            <p className="mt-4 text-text-light leading-relaxed">
              {t('home.ctaDesc')}
            </p>
            <div className="mt-8">
              <Button to={cta.buttonLink} variant="accent">
                {t('home.ctaBtn')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
