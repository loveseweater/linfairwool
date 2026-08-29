import { usePageTitle } from '../hooks/usePageTitle'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'
import HeroCarousel from '../components/ui/HeroCarousel'
import { useSiteData } from '../utils/useSiteData'
import { useLang } from '../context/LanguageContext'

export default function About() {
    usePageTitle('About Us | LINFAIR — Premium Knitwear Manufacturer')

  const { siteContent } = useSiteData()
  const { t } = useLang()
  const { hero, intro, values, timeline, cta } = siteContent.about
  return (
    <>
      {/* Hero */}
      <section className="relative py-32 bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <HeroCarousel images={hero.heroImages} className="opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-accent text-xs tracking-[0.2em] uppercase font-medium">{hero.subtitle}</span>
            <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-warm leading-tight">
              {hero.title}
              <br />
              <span className="text-accent">{hero.titleHighlight}</span>
            </h1>
            <p className="mt-6 text-lg text-warm/60 leading-relaxed">
              {hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary">
                {intro.title}
                <br />
                <span className="text-accent">{intro.titleHighlight}</span>
              </h2>
              {intro.paragraphs.map((p, i) => (
                <p key={i} className="mt-6 text-text-light leading-relaxed">{p}</p>
              ))}
              <div className="mt-8 grid grid-cols-2 gap-6">
                {intro.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-display font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-text-light mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={intro.image}
                  alt="Knitwear factory"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-warm">
        <div className="container-custom">
          <SectionTitle
            subtitle={t('about.valuesSubtitle')}
            title={t('about.valuesTitle')}
            description={t('about.valuesDesc')}
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl"
              >
                <div className="w-12 h-1 bg-accent rounded-full mb-6" />
                <h3 className="text-xl font-display font-semibold text-primary mb-3">{value.title}</h3>
                <p className="text-text-light text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <SectionTitle
            subtitle={t('about.timelineSubtitle')}
            title={t('about.timelineTitle')}
            description={t('about.timelineDesc')}
          />

          <div className="mt-16 max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex gap-8 pb-12 last:pb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-accent border-2 border-white z-10 shrink-0" />
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-accent/20 mt-1" />
                  )}
                </div>

                <div className="flex-1 pt-0.5">
                  <span className="text-accent text-sm font-medium tracking-wider">{item.year}</span>
                  <h3 className="text-xl font-display font-semibold text-primary mt-1">{item.title}</h3>
                  <p className="text-text-light text-sm mt-2 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-warm">
              {t('about.ctaTitle')}
            </h2>
            <p className="mt-4 text-warm/60 max-w-xl mx-auto">
              {t('about.ctaDesc')}
            </p>
            <div className="mt-8">
              <Button to={cta.buttonLink} variant="accent">
                {t('about.ctaBtn')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
