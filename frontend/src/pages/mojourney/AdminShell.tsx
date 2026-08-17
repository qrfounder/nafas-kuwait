import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export type AdminSection =
  | 'overview'
  | 'live'
  | 'analytics'
  | 'orders'
  | 'products'
  | 'redirects'
  | 'links'
  | 'pixels'

const NAV_GROUPS: { label: string; items: { id: AdminSection; label: string; hint?: string }[] }[] = [
  {
    label: 'Dashboard',
    items: [
      { id: 'live', label: 'Live View', hint: 'Real-time map & globe' },
      { id: 'overview', label: 'Overview' },
      { id: 'analytics', label: 'Analytics', hint: 'Visitors & funnel' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { id: 'orders', label: 'Orders' },
      { id: 'products', label: 'Products', hint: 'HIMRJP10' },
      { id: 'redirects', label: 'Redirects', hint: 'URLs & ads' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { id: 'links', label: 'Campaign links' },
      { id: 'pixels', label: 'Pixels' },
    ],
  },
]

export function sectionTitle(id: AdminSection): string {
  for (const g of NAV_GROUPS) {
    const item = g.items.find((i) => i.id === id)
    if (item) return item.label
  }
  return id
}

type Props = {
  section: AdminSection
  onSection: (s: AdminSection) => void
  onLogout: () => void
  apiStatus?: ReactNode
  children: ReactNode
}

export function AdminShell({ section, onSection, onLogout, apiStatus, children }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row" dir="ltr">
      <aside className="border-b md:border-b-0 md:border-r border-slate-800 md:w-64 shrink-0 md:min-h-screen p-4 flex flex-col gap-4">
        <div className="px-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Nafas USA</p>
          <p className="font-display text-lg font-bold text-white">Mojourney Admin</p>
        </div>

        <nav className="flex flex-col gap-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSection(item.id)}
                    className={`rounded-lg px-3 py-2 text-left transition-colors ${
                      section === item.id
                        ? 'bg-slate-800 text-amber-200'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-sm block">{item.label}</span>
                    {item.hint && (
                      <span className="text-[10px] text-slate-500 block">{item.hint}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex-1" />
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800/60"
        >
          Sign out
        </button>
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg px-3 py-2 text-sm text-amber-400/90 hover:bg-slate-800/60"
        >
          View storefront ↗
        </Link>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-white">{sectionTitle(section)}</h2>
          {apiStatus}
        </header>
        {children}
      </main>
    </div>
  )
}
