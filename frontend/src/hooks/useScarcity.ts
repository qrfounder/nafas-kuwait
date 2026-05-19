import { useEffect, useState } from 'react'

const STOCK_KEY = 'nafas_stock'

function getSessionStock(): number {
  const saved = sessionStorage.getItem(STOCK_KEY)
  if (saved) return Math.max(5, parseInt(saved, 10))
  const n = 12 + Math.floor(Math.random() * 6)
  sessionStorage.setItem(STOCK_KEY, String(n))
  return n
}

export function useScarcity() {
  const [stockLeft, setStockLeft] = useState(14)

  useEffect(() => {
    setStockLeft(getSessionStock())
  }, [])

  const decrementStock = () => {
    setStockLeft((s) => {
      const next = Math.max(5, s - 1)
      sessionStorage.setItem(STOCK_KEY, String(next))
      return next
    })
  }

  return { stockLeft, decrementStock }
}
