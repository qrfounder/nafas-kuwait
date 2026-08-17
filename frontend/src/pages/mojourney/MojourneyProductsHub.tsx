import { useEffect, useState } from 'react'
import { MojourneySkuInventory } from './MojourneySkuInventory'

export function MojourneyProductsHub({ onError }: { onError: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
        Live product on the landing page:{' '}
        <strong className="text-slate-200">خلطة أجدادنا</strong> · SKU{' '}
        <span className="font-mono text-amber-200/90">HIMRJP10</span> ·{' '}
        <span className="font-mono text-xs">/product/official</span>
      </p>
      <MojourneySkuInventory onError={onError} />
    </div>
  )
}
