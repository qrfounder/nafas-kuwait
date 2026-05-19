type Props = {
  src: string
  alt: string
  aspect?: '4/3' | '1/1' | '16/10'
  className?: string
  priority?: boolean
}

const aspectClass = {
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '16/10': 'aspect-[16/10]',
}

export function ProductImage({ src, alt, aspect = '4/3', className = '', priority }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#EEEBE6] border border-surface-border ${aspectClass[aspect]} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  )
}
