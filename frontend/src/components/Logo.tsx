import { Link } from 'react-router-dom'

/** Tight-cropped transparent PNGs (≈8.9:1). Heights map to header/footer CSS. */
const LOGO = {
  src: '/brand/nafas-logo-240.png',
  srcSet: [
    '/brand/nafas-logo-120.png 120w',
    '/brand/nafas-logo-160.png 160w',
    '/brand/nafas-logo-200.png 200w',
    '/brand/nafas-logo-240.png 240w',
    '/brand/nafas-logo-320.png 320w',
    '/brand/nafas-logo-400.png 400w',
    '/brand/nafas-logo-480.png 480w',
  ].join(', '),
}

/** Intrinsic ratio of processed wordmark (240×27). */
const INTRINSIC = { w: 240, h: 27 }

type Props = {
  compact?: boolean
  variant?: 'default' | 'footer'
  className?: string
}

/**
 * Responsive wordmark: true alpha PNG, height-driven so text stays readable
 * on mobile (~28px) through desktop (~36px).
 */
export function Logo({ compact = false, variant = 'default', className = '' }: Props) {
  const isFooter = variant === 'footer'

  const box = isFooter
    ? 'h-8 w-auto sm:h-9'
    : compact
      ? 'h-7 w-auto'
      : 'h-[1.75rem] w-auto sm:h-8 md:h-8'

  const sizes = isFooter
    ? '(max-width: 640px) 180px, 200px'
    : compact
      ? '160px'
      : '(max-width: 640px) 250px, 285px'

  return (
    <Link
      to="/"
      className={`group inline-flex shrink-0 items-center ${className}`}
      aria-label="Nafas home"
    >
      <img
        src={LOGO.src}
        srcSet={LOGO.srcSet}
        sizes={sizes}
        alt="Nafas"
        width={INTRINSIC.w}
        height={INTRINSIC.h}
        className={`block w-auto max-w-none object-contain object-left ${box} ${
          isFooter ? 'brightness-0 invert' : ''
        } transition-opacity duration-200 group-hover:opacity-75`}
        decoding="async"
        fetchPriority="high"
      />
    </Link>
  )
}
