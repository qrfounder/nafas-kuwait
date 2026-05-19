import { formatKwd, formatUsd } from '../lib/currency'

type Props = {
  usd: number
  anchorUsd?: number
  size?: 'sm' | 'md' | 'lg'
  showUsdHint?: boolean
}

const sizeClasses = {
  sm: { main: 'text-lg', anchor: 'text-xs', hint: 'text-[10px]' },
  md: { main: 'text-2xl', anchor: 'text-sm', hint: 'text-xs' },
  lg: { main: 'text-3xl', anchor: 'text-sm', hint: 'text-xs' },
}

export function Price({ usd, anchorUsd, size = 'md', showUsdHint = true }: Props) {
  const c = sizeClasses[size]
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      {anchorUsd != null && (
        <span className={`${c.anchor} text-surface-muted line-through`}>{formatKwd(anchorUsd)}</span>
      )}
      <span className={`${c.main} font-bold text-rose-brand`}>{formatKwd(usd)}</span>
      {showUsdHint && <span className={`${c.hint} text-surface-muted`}>({formatUsd(usd)})</span>}
    </span>
  )
}

export function PriceFrom({ usd }: { usd: number }) {
  return (
    <span>
      من <span className="font-bold text-rose-brand">{formatKwd(usd)}</span>
      <span className="text-xs text-surface-muted mr-1"> ({formatUsd(usd)})</span>
    </span>
  )
}
