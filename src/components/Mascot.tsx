import { useEffect, useState } from 'react'

const SRC = `${import.meta.env.BASE_URL}unicorn.svg`
// SVG view fragments crop the one file, so the head and body share a single download.
const VIEW = {
  full: { src: `${SRC}#svgView(viewBox(110,210,1600,1840))`, ratio: 1600 / 1840 },
  head: { src: `${SRC}#svgView(viewBox(820,330,700,700))`, ratio: 1 },
}

interface Props { size?: number; fluid?: boolean; view?: keyof typeof VIEW; hopKey?: unknown; bob?: boolean; className?: string; flip?: boolean }

export default function Mascot({ size = 200, fluid = false, view = 'full', hopKey, bob = false, className = '', flip = false }: Props) {
  const [hop, setHop] = useState(0)
  useEffect(() => { if (hopKey !== undefined) setHop((h) => h + 1) }, [hopKey])
  const v = VIEW[view]
  return (
    <div className={`${bob ? 'animate-bob' : ''} ${className}`} aria-hidden="true">
      <img
        key={hop}
        src={v.src}
        width={Math.round(size * v.ratio)}
        height={size}
        alt=""
        draggable={false}
        className={`${hop > 1 ? 'animate-hop' : ''} select-none ${flip ? '-scale-x-100' : ''}`}
        style={fluid ? { width: '100%', height: 'auto' } : { width: Math.round(size * v.ratio), height: size }}
      />
    </div>
  )
}
