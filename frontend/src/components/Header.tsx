import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Logo } from './Logo'
import { TrustBar } from './TrustBar'
import { useCart } from '../context/CartContext'

const nav = [
  { to: '/', label: 'الرئيسية' },
  { to: '/collection', label: 'المجموعة' },
  { to: '/about', label: 'من نحن' },
  { to: '/contact', label: 'تواصل' },
]

export function Header() {
  const { itemCount, setCartOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-cream/98 backdrop-blur-sm border-b border-surface-border">
      <TrustBar />
      <div className="container-narrow h-14 flex items-center justify-between gap-3">
        <button
          type="button"
          className="md:hidden p-2 -mr-1 text-ink"
          aria-label="القائمة"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <Logo />

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                isActive ? 'text-rose-brand' : 'text-surface-muted hover:text-ink'
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative btn-primary text-sm py-2 px-4 shrink-0"
        >
          السلة
          {itemCount > 0 && (
            <span className="absolute -top-2 -left-2 w-5 h-5 bg-gold-accent text-ink text-xs rounded-full flex items-center justify-center font-bold">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-surface-border bg-cream px-4 py-3 flex flex-col gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-2 rounded-lg text-sm font-medium ${
                  isActive ? 'text-rose-brand bg-rose-light/50' : 'text-ink'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
          <NavLink
            to="/policies"
            onClick={() => setMenuOpen(false)}
            className="py-3 px-2 text-sm text-surface-muted"
          >
            السياسات
          </NavLink>
        </nav>
      )}
    </header>
  )
}
