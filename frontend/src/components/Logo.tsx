import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 shrink-0">
      <span className="w-10 h-10 rounded-full bg-rose-brand text-white font-display font-bold text-xl flex items-center justify-center">
        ن
      </span>
      <span className="font-display font-bold text-2xl text-ink">نفس</span>
    </Link>
  )
}
