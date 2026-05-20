import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'

export type GlobeMarker = {
  lat: number
  lng: number
  stage: string
}

type Props = {
  markers: GlobeMarker[]
  width?: number
  height?: number
}

const STAGE_COLOR: Record<string, [number, number, number]> = {
  purchased: [0.75, 0.35, 0.95],
  checkout: [0.95, 0.55, 0.2],
  cart: [0.35, 0.75, 0.95],
  browsing: [0.25, 0.55, 0.95],
}

function toCobeMarkers(markers: GlobeMarker[]) {
  return markers
    .filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng))
    .map((m) => ({
      location: [m.lat, m.lng] as [number, number],
      size: m.stage === 'purchased' ? 0.08 : 0.06,
      color: STAGE_COLOR[m.stage] ?? STAGE_COLOR.browsing,
    }))
}

export function LiveGlobe({ markers, width = 520, height = 520 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const markersRef = useRef(markers)
  markersRef.current = markers

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = width * dpr
    const h = height * dpr
    let phi = 0
    let frame = 0

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: w,
      height: h,
      phi: 0,
      theta: 0.25,
      dark: 0,
      diffuse: 1.15,
      mapSamples: 14000,
      mapBrightness: 4.5,
      baseColor: [0.82, 0.9, 0.95],
      markerColor: [0.3, 0.55, 0.95],
      glowColor: [0.75, 0.88, 0.95],
      markers: toCobeMarkers(markersRef.current),
    })

    const tick = () => {
      phi += 0.004
      globe.update({
        phi,
        markers: toCobeMarkers(markersRef.current),
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      globe.destroy()
    }
  }, [width, height])

  return (
    <div className="relative flex items-center justify-center w-full" style={{ maxWidth: width }}>
      <canvas
        ref={canvasRef}
        className="w-full h-auto max-w-full"
        style={{ width, height, aspectRatio: '1 / 1' }}
      />
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 text-[10px] text-slate-400 bg-slate-950/70 rounded-lg px-2.5 py-2 border border-slate-800">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-violet-400" /> Orders / purchased
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400" /> Visitors now
        </span>
      </div>
    </div>
  )
}
