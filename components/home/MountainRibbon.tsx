'use client'

import { useEffect, useRef, useState } from 'react'

// Drawn at a fixed pixel size and centred, so the text stays readable on phones.
const WIDTH = 3840
const HEIGHT = 190
const SPEED = 45 // px per second
const NBSP = ' '
const GAP = NBSP.repeat(5)

// Alternating valleys and peaks of different heights, joined with smooth curves.
const HEIGHTS = [130, 60, 120, 80, 135, 50, 125, 75, 135, 50, 120, 80, 135, 60, 125, 75, 130]
const STEP = WIDTH / (HEIGHTS.length - 1)
const RIDGE = HEIGHTS.map((y, i) => {
  const x = i * STEP
  if (i === 0) return `M${x},${y}`
  const mid = x - STEP / 2
  return `C${mid},${HEIGHTS[i - 1]} ${mid},${y} ${x},${y}`
}).join(' ')

function TextRun({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item) => (
        <tspan key={item}>
          {item.toUpperCase().replace(/ /g, NBSP)}
          {GAP}
          <tspan className="fill-ochre">▲</tspan>
          {GAP}
        </tspan>
      ))}
    </>
  )
}

export default function MountainRibbon({ items, label }: { items: string[]; label: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const measureRef = useRef<SVGTextElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)
  const [copies, setCopies] = useState(4)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let period = 0
    let offset = 0
    let last = 0
    let frame = 0
    let visible = false

    const measure = () => {
      period = measureRef.current?.getComputedTextLength() || 0
      if (period) setCopies(Math.ceil((WIDTH * 1.1) / period) + 1)
    }

    const tick = (now: number) => {
      // Cap the gap so a background tab doesn't jump on return
      const dt = last ? Math.min(now - last, 100) / 1000 : 0
      last = now
      if (period) {
        offset = (offset + SPEED * dt) % period
        textPathRef.current?.setAttribute('startOffset', String(-offset))
      }
      frame = requestAnimationFrame(tick)
    }

    const update = () => {
      cancelAnimationFrame(frame)
      last = 0
      if (visible && !reduceMotion.matches) frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })

    measure()
    document.fonts?.ready.then(measure)
    observer.observe(section)
    reduceMotion.addEventListener('change', update)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      reduceMotion.removeEventListener('change', update)
    }
  }, [])

  const textClass = 'fill-cream font-heading font-bold text-[15px] tracking-[0.14em]'

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ height: HEIGHT }} aria-label={label}>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="absolute top-0 left-1/2 -translate-x-1/2 max-w-none"
        aria-hidden="true"
      >
        <path d={RIDGE} fill="none" className="stroke-forest" strokeWidth={62} />
        <path id="mountain-ridge" d={RIDGE} fill="none" />
        <text ref={measureRef} className={textClass} visibility="hidden">
          <TextRun items={items} />
        </text>
        <text className={textClass} dominantBaseline="central">
          <textPath ref={textPathRef} href="#mountain-ridge">
            {Array.from({ length: copies }, (_, i) => (
              <TextRun key={i} items={items} />
            ))}
          </textPath>
        </text>
      </svg>
    </section>
  )
}
