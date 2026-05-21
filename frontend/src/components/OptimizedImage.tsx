import { manifestEntry, toWebp, webpSrcSet, defaultSizes } from '../lib/optimizedImage'

type Props = {
  src: string
  alt: string
  /** Applied to inner <img> */
  className?: string
  /** Applied to <picture> wrapper (e.g. absolute inset-0) */
  pictureClassName?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  fetchPriority?: 'high' | 'low' | 'auto'
  sizes?: string
  /** Clicks pass through to parent (e.g. button row). */
  inert?: boolean
  onError?: React.ReactEventHandler<HTMLImageElement>
}

/** Serves WebP with responsive srcset when manifest variants exist. */
export function OptimizedImage({
  src,
  alt,
  className = '',
  pictureClassName = '',
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  sizes,
  inert,
  onError,
}: Props) {
  const inertClass = inert ? 'pointer-events-none select-none' : ''
  if (src.endsWith('.svg')) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} ${inertClass}`.trim()}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
      />
    )
  }

  const entry = manifestEntry(src)
  const webp = entry?.webp ?? toWebp(src)
  const srcSet = webpSrcSet(src)
  const sizesAttr = sizes ?? defaultSizes(entry?.category)

  return (
    <picture className={[pictureClassName, inertClass].filter(Boolean).join(' ') || undefined}>
      {srcSet ? (
        <source type="image/webp" srcSet={srcSet} sizes={sizesAttr} />
      ) : (
        <source type="image/webp" srcSet={webp} />
      )}
      <img
        src={webp}
        alt={alt}
        className={`${className} ${inertClass}`.trim()}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        sizes={srcSet ? sizesAttr : undefined}
        onError={onError}
      />
    </picture>
  )
}
