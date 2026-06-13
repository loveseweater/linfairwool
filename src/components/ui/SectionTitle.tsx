import { motion } from 'framer-motion'

interface SectionTitleProps {
  subtitle?: string
  title: string
  description?: string
  align?: 'center' | 'left'
  light?: boolean
}

export default function SectionTitle({
  subtitle,
  title,
  description,
  align = 'center',
  light = false,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}
    >
      {subtitle && (
        <span className={`inline-block text-xs tracking-[0.2em] uppercase font-medium mb-3 ${
          light ? 'text-accent' : 'text-accent'
        }`}>
          {subtitle}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-display font-semibold leading-tight ${
        light ? 'text-warm' : 'text-primary'
      }`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${
          light ? 'text-warm/60' : 'text-text-light'
        }`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
