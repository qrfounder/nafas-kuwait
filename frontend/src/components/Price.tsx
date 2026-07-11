import { formatUsd } from '../lib/currency'

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
  const showAnchor = anchorUsd != null && Math.abs(anchorUsd - usd) > 0.009
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      {showAnchor && (
        <span className={`${c.anchor} text-surface-muted line-through`}>{formatUsd(anchorUsd!)}</span>
      )}
      <span className={`${c.main} font-bold text-rose-brand`}>{formatUsd(usd)}</span>
    </span>
  )
}

export function PriceFrom({ usd }: { usd: number }) {
  return (
    <span>
      From <span className="font-bold text-rose-brand">{formatUsd(usd)}</span>
    </span>
  )
}
