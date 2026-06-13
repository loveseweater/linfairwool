import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: string
  to?: string
  href?: string
  variant?: 'primary' | 'outline' | 'outline-light' | 'accent'
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  className = '',
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200'

  const variants = {
    primary: 'bg-primary text-warm hover:bg-primary-light rounded-full',
    accent: 'bg-accent text-primary hover:bg-accent-light rounded-full',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-warm rounded-full',
    'outline-light': 'border-2 border-warm text-warm hover:bg-warm hover:text-primary rounded-full',
  }

  const classes = `${baseStyles} ${variants[variant]} ${className}`

  if (to) {
    return (
      <motion.span
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link to={to} className={classes}>
          {children}
        </Link>
      </motion.span>
    )
  }

  if (href) {
    return (
      <motion.span
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </motion.span>
    )
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${classes} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
