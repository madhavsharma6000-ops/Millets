import KulluBand from '@/components/art/KulluBand'

const motifs = [
  { variant: 'diamond', thread: 2, name: 'Stepped diamonds' },
  { variant: 'zigzag', thread: 4, name: 'Mountain zigzags' },
  { variant: 'steps', thread: 6, name: 'Little steps' },
] as const

export default function KulluCraft() {
  return (
    <section id="kullu-craft" className="py-20 md:py-28 bg-[#F1EAD9]">
      <div className="container-custom grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
        <div>
          <p className="text-[13px] font-bold tracking-[0.1em] uppercase text-terracotta-dark mb-3">Art of the Hills</p>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold leading-[1.05] mb-5 text-balance">
            Inspired by the <span className="text-terracotta">looms of Kullu</span>
          </h2>
          <p className="text-lg text-[#5A4E48] leading-relaxed mb-8">
            In Himachal&apos;s Kullu valley, weavers are known for woollen shawls edged with bright geometric borders.
            The patterns you see across our site are our own tribute to that mountain craft.
          </p>
          <ul className="grid grid-cols-3 gap-3 sm:gap-4">
            {motifs.map((motif) => (
              <li key={motif.name}>
                <div className="rounded-2xl overflow-hidden border-2 border-[#EAE0CC] h-12">
                  <KulluBand variant={motif.variant} thread={motif.thread} />
                </div>
                <p className="mt-2.5 text-sm font-bold text-forest-dark">{motif.name}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Shawl artwork */}
        <div
          className="mx-auto w-full max-w-lg -rotate-2 drop-shadow-xl"
          role="img"
          aria-label="Illustration of a shawl with colourful geometric bands, inspired by Kullu weaving"
        >
          <div className="bg-[#E9DFC9] overflow-hidden rounded-t-xl">
            <div className="h-20 md:h-28" />
            <KulluBand variant="steps" thread={3} />
            <div className="h-5" />
            <KulluBand variant="zigzag" thread={3} />
            <div className="h-5" />
            <KulluBand variant="diamond" thread={4} />
            <div className="h-5" />
            <KulluBand variant="zigzag" thread={3} />
            <div className="h-5" />
            <KulluBand variant="steps" thread={3} />
            <div className="h-6" />
          </div>
          {/* Fringe */}
          <div
            className="h-7"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, #C9B68E 0 4px, transparent 4px 9px)' }}
          />
        </div>
      </div>
    </section>
  )
}
