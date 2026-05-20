import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export type AdminSection =
  | 'overview'
  | 'analytics'
  | 'orders'
  | 'products'
  | 'redirects'
  | 'links'
  | 'pixels'

const NAV_GROUPS: { label: string; items: { id: AdminSection; label: string }[] }[] = [
  {
    label: 'Dashboard',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'analytics', label: 'Analytics' },
    ],
  },
  {
    label: 'Store',
    items: [
      { id: 'orders', label: 'Orders' },
      { id: 'products', label: 'Products' },
      { id: 'redirects', label: 'Redirects' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { id: 'links', label: 'Campaign Links' },
      { id: 'pixels', label: 'Pixels & Tracking' },
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
      <aside className="border-b md:border-b-0 md:border-r border-slate-800 md:w-60 shrink-0 md:min-h-screen p-4 flex flex-col gap-4">
        <div className="px-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Nafas Kuwait</p>
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
                    className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      section === item.id
                        ? 'bg-slate-800 text-amber-200'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    {item.label}
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
        <Link to="/" className="rounded-lg px-3 py-2 text-sm text-amber-400/90 hover:bg-slate-800/60">
          View storefront
        </Link>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-white">{sectionTitle(section)}</h2>
          {apiStatus}
        </header>
        {children}
      </main>
    </div>
  )
}
