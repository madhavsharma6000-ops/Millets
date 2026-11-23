import { useId } from 'react'

/**
 * Original woven bands inspired by the geometric borders of Kullu shawls.
 * Each pattern is built on a small grid, like threads on a loom, and repeats sideways.
 */
const C = {
  cream: '#F9F6F0',
  red: '#B5322B',
  terracotta: '#C85A32',
  ochre: '#E09F3E',
  forest: '#3B5D43',
  dark: '#2C221E',
}

type Variant = 'diamond' | 'zigzag' | 'steps'
type Weave = { w: number; h: number; color: (x: number, y: number) => string }

const weaves: Record<Variant, Weave> = {
  // Stepped diamonds between striped edges
  diamond: {
    w: 16,
    h: 23,
    color: (x, y) => {
      const edge = Math.min(y, 22 - y)
      if (edge === 0) return C.dark
      if (edge === 1) return x % 4 < 2 ? C.ochre : C.red
      if (edge === 2) return C.dark
      const d = Math.abs(x - 8) + Math.abs(y - 11)
      if (d <= 1) return C.cream
      if (d <= 3) return C.red
      if (d === 4) return C.dark
      if (d <= 6) return C.ochre
      if (d === 7) return C.cream
      if (d === 8) return C.dark
      if (d <= 10) return C.forest
      if (d <= 12) return C.terracotta
      return C.ochre
    },
  },
  // Mountain-like zigzag
  zigzag: {
    w: 12,
    h: 11,
    color: (x, y) => {
      if (y === 0 || y === 10) return C.red
      const v = y + Math.abs(x - 6)
      if (v <= 4) return C.forest
      if (v === 5) return C.cream
      if (v <= 7) return C.red
      if (v <= 9) return C.ochre
      if (v === 10) return C.cream
      return C.dark
    },
  },
  // Small hooked steps
  steps: {
    w: 8,
    h: 7,
    color: (x, y) => {
      if (y === 0 || y === 6) return C.ochre
      const d = Math.abs(x - 4) + Math.abs(y - 3)
      if (d === 0) return C.ochre
      if (d <= 2) return C.red
      if (d === 3) return C.cream
      return C.dark
    },
  },
}

// Merge same-coloured threads in each row so the markup stays small
function threads({ w, h, color }: Weave) {
  const paths: Record<string, string> = {}
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; ) {
      const c = color(x, y)
      let run = 1
      while (x + run < w && color(x + run, y) === c) run++
      paths[c] = (paths[c] || '') + `M${x} ${y}h${run}v1h-${run}z`
      x += run
    }
  }
  return Object.entries(paths)
}

const drawn = {
  diamond: threads(weaves.diamond),
  zigzag: threads(weaves.zigzag),
  steps: threads(weaves.steps),
}

export default function KulluBand({
  variant = 'diamond',
  thread = 2,
  className = '',
}: {
  variant?: Variant
  /** Size of one thread in pixels */
  thread?: number
  className?: string
}) {
  const id = `kullu-${useId().replace(/:/g, '')}`
  const { w, h } = weaves[variant]

  return (
    <svg
      className={`block w-full ${className}`}
      height={h * thread}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse" patternTransform={`scale(${thread})`}>
          {drawn[variant].map(([fill, d]) => (
            <path key={fill} fill={fill} d={d} />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
