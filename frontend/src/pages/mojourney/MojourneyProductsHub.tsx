import { useState } from 'react'
import { MojourneyBundleAdmin } from './MojourneyBundleAdmin'
import { MojourneySkuInventory } from './MojourneySkuInventory'

type Tab = 'bundles' | 'skus'

export function MojourneyProductsHub({ onError }: { onError: (msg: string) => void }) {
  const [tab, setTab] = useState<Tab>('skus')

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
        Manage <strong className="text-slate-200">bundle offers</strong> (product pages) and individual{' '}
        <strong className="text-slate-200">warehouse SKUs</strong> (price, stock quantity, labels). Changes
        apply on the live store after save.
      </p>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-1">
        <button
          type="button"
          onClick={() => setTab('skus')}
          className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'skus' ? 'bg-slate-800 text-amber-200' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          SKU inventory
        </button>
        <button
          type="button"
          onClick={() => setTab('bundles')}
          className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'bundles' ? 'bg-slate-800 text-amber-200' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Bundle offers
        </button>
      </div>

      {tab === 'skus' ? <MojourneySkuInventory onError={onError} /> : <MojourneyBundleAdmin onError={onError} />}
    </div>
  )
}
