import { formatKwd } from '../lib/currency'

type Props = {
  usd: number
  anchorUsd?: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: { main: 'text-lg', anchor: 'text-xs' },
  md: { main: 'text-2xl', anchor: 'text-sm' },
  lg: { main: 'text-3xl', anchor: 'text-sm' },
}

export function Price({ usd, anchorUsd, size = 'md' }: Props) {
  const c = sizeClasses[size]
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      {anchorUsd != null && (
        <span className={`${c.anchor} text-surface-muted line-through`}>{formatKwd(anchorUsd)}</span>
      )}
      <span className={`${c.main} font-bold text-rose-brand`}>{formatKwd(usd)}</span>
    </span>
  )
}

export function PriceFrom({ usd }: { usd: number }) {
  return (
    <span>
      من <span className="font-bold text-rose-brand">{formatKwd(usd)}</span>
    </span>
  )
}
