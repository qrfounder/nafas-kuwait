import { Link } from 'react-router-dom'
import { OptimizedImage } from './OptimizedImage'

const LOGO_SRC = '/brand/nafas-logo.png'

type Props = {
  /** Tighter header (e.g. thank-you, modals). */
  compact?: boolean
  /** Dark footer: larger wordmark on `bg-ink`. */
  variant?: 'default' | 'footer'
  className?: string
}

export function Logo({ compact = false, variant = 'default', className = '' }: Props) {
  const isFooter = variant === 'footer'

  const imgH = isFooter
    ? 'h-9 max-w-[9rem] sm:h-10 sm:max-w-[10rem]'
    : compact
      ? 'h-6 max-w-[5.5rem]'
      : 'h-10 max-w-[10rem] sm:h-11 sm:max-w-[12.5rem] md:h-12 md:max-w-[14rem]'

  return (
    <Link
      to="/"
      className={`group inline-flex shrink-0 items-center justify-center ${className}`}
      aria-label="نفس، راحة منزلية في الكويت"
    >
      <span className="inline-flex shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]">
        <OptimizedImage
          src={LOGO_SRC}
          alt="نفس"
          width={200}
          height={80}
          className={`block shrink-0 object-contain object-center ${imgH}`}
          decoding="async"
          fetchPriority="high"
          loading="eager"
          sizes="200px"
        />
      </span>
    </Link>
  )
}
