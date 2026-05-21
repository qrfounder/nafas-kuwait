import manifest from '../../public/image-manifest.json'

type ManifestEntry = {
  src: string
  webp: string
  widths: number[]
  category: string
}

const entries = manifest as Record<string, ManifestEntry>

/** PNG/JPEG path → default WebP (same path, .webp suffix). */
export function toWebp(src: string): string {
  if (src.endsWith('.webp') || src.endsWith('.svg')) return src
  return src.replace(/\.(png|jpe?g)$/i, '.webp')
}

export function manifestEntry(src: string): ManifestEntry | undefined {
  return entries[src]
}

/** Build srcset for WebP variants: `file-640.webp 640w, ...` */
export function webpSrcSet(src: string): string | undefined {
  const entry = entries[src]
  if (!entry?.widths?.length) return undefined
  const base = src.replace(/\.(png|jpe?g)$/i, '')
  return entry.widths
    .map((w) => `${base}-${w}.webp ${w}w`)
    .join(', ')
}

export function defaultSizes(category?: string): string {
  switch (category) {
    case 'catalog':
      return '128px'
    case 'logo':
      return '200px'
    case 'pain':
      return '(max-width: 768px) 100vw, 33vw'
    case 'showcase':
      return '(max-width: 768px) 100vw, 50vw'
    default:
      return '(max-width: 768px) 100vw, 50vw'
  }
}
