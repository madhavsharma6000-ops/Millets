import { Metadata } from 'next'
import Link from 'next/link'
import { Award, BookOpen, GraduationCap, Mail, Linkedin, Twitter, Leaf, Eye, Target, Coffee, Moon, Sunrise, Dumbbell, ArrowRight, Heart, Mountain } from 'lucide-react'
import KulluCraft from '@/components/home/KulluCraft'

export const metadata: Metadata = {
  title: 'Our Story & Mission',
  description: 'From a life-altering accident to a national movement — discover how Millet Mountain is revolutionizing gut health and snacking with ancient millets.',
  keywords: ['millet snacks', 'gut health', 'ancient grains', 'clean label', 'whole grain', 'Millet Mountain story'],
}

// JSON-LD Schema for Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Millet Mountain',
  description: 'Clean-label, high-protein, 100% whole-grain millet snacks that heal the gut and honor heritage.',
  url: 'https://milletmountain.com/about',
  founder: {
    '@type': 'Person',
    name: 'Madhav Sharma',
    jobTitle: 'Founder',
  },
  knowsAbout: [
    'Nutrition & Dietetics',
    'Ancient Grains',
    'Gut Health',
    'Millet Snacking',
  ],
}

const peakHacks = [
  {
    icon: Coffee,
    title: 'The 3:00 PM Desk Rescue',
    vibe: 'For the afternoon office slump.',
    products: 'Multimillet Flakes / Cookies',
    hack: 'Crumble our multi-millet cookies over Greek yogurt or toss our flakes with a drizzle of honey and dark chocolate chips for a 5-minute "Desk-Side Sundae" that fights the 3 PM sugar crash.',
    cardClass: 'bg-white border-2 border-[#EFE7DA]',
    iconBg: 'bg-terracotta/15',
    iconColor: 'text-terracotta',
    badge: 'bg-terracotta',
  },
  {
    icon: Moon,
    title: "The Midnight Cereal Killer",
    vibe: 'Late-night binge watching without the guilt.',
    products: 'Millet Crunchies',
    hack: 'Swap out greasy potato chips for our roasted millet crunchies during movie night. Toss them with a pinch of Himalayan pink salt, chaat masala, and a squeeze of lime for a desi theater-style snack.',
    cardClass: 'bg-forest-dark text-cream border-2 border-forest',
    iconBg: 'bg-cream/10',
    iconColor: 'text-ochre',
    badge: 'bg-ochre text-charcoal',
  },
  {
    icon: Sunrise,
    title: "The 'I Can't Cook' Breakfast Bowl",
    vibe: 'Zero-effort morning fuel.',
    products: 'Millet Flakes & Noodles',
    hack: 'Turn our wholesome millet flakes into a tropical smoothie bowl base, or whip up a 3-minute spicy street-style stir-fry with our millet noodles loaded with crunchy veggies.',
    cardClass: 'bg-white border-2 border-[#EFE7DA]',
    iconBg: 'bg-ochre/20',
    iconColor: 'text-ochre-dark',
    badge: 'bg-sage',
  },
  {
    icon: Dumbbell,
    title: "The Gym Bro's Secret Weapon",
    vibe: 'Post-workout recovery done right.',
    products: 'High-Protein Boost',
    hack: 'Blend our nutrient-dense millet flour into your morning post-workout protein shake or pancake batter for that slow-release complex carb power without the bloating.',
    cardClass: 'bg-sage-light/40 border-2 border-sage',
    iconBg: 'bg-forest/15',
    iconColor: 'text-forest',
    badge: 'bg-terracotta',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="bg-paper-texture -mt-px">
        {/* ===== Hero: Our Story ===== */}
        <section className="py-14 md:py-20 relative overflow-hidden">
          <div className="container-custom px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Founder avatar */}
              <div className="mx-auto mb-5 md:mb-6 flex items-center justify-center">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-br from-terracotta to-ochre flex items-center justify-center ring-4 ring-white shadow-xl">
                  <span className="font-heading text-3xl md:text-5xl font-extrabold text-cream">MS</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-sage/20 border border-sage/40 rounded-full px-4 py-1.5 mb-4">
                <Mountain className="h-4 w-4 text-forest" />
                <span className="text-xs md:text-sm font-bold text-forest tracking-wide uppercase">Our Story &amp; Mission</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold text-charcoal mb-4 text-balance">
                Hi, I&apos;m <span className="text-terracotta">Madhav Sharma</span>
              </h1>
              <p className="text-base md:text-lg text-charcoal/60 max-w-2xl mx-auto">
                Founder of Millet Mountain · B.Voc in Nutrition &amp; Dietetics · Gut-health advocate with Garhwali roots
              </p>
            </div>
          </div>
        </section>

        {/* ===== The Story ===== */}
        <section className="pb-16 md:pb-20">
          <div className="container-custom px-4">
            <div className="max-w-3xl mx-auto relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-terracotta/10 via-transparent to-sage/10 rounded-[2.5rem] blur-lg" aria-hidden="true"></div>
              <div className="relative bg-white/80 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-[2.5rem] p-7 md:p-12 shadow-sm">
                <Leaf className="h-8 w-8 text-sage mb-5" />
                <div className="space-y-5 text-base md:text-lg text-charcoal/80 leading-relaxed">
                  <p>
                    After a life-altering accident in 2024 left me bedridden and battling severe gut issues, I realized
                    that modern &lsquo;health&rsquo; snacks were failing the very people they claimed to help.
                  </p>
                  <p>
                    Drawing on my B.Voc in Nutrition &amp; Dietetics and my Garhwali heritage, I replaced refined grains
                    with traditional ancient millets — leading to a total personal recovery and the birth of{' '}
                    <strong className="text-terracotta">Millet Mountain</strong>.
                  </p>
                  <p>
                    Today, I am scaling that healing journey into a national movement — combining clinical expertise with
                    the ancient, nutrient-dense power of ancient grains to revolutionize gut health and snacking for the
                    modern consumer.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-8 pt-6 border-t border-[#EFE7DA]">
                  <Heart className="h-5 w-5 text-terracotta fill-terracotta" />
                  <span className="font-heading font-bold text-charcoal">From my bed to your table — one honest bite at a time.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* wave divider */}
        <svg className="wave-divider -mb-px" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,30 C200,60 400,5 600,25 C800,45 1000,65 1200,40 C1330,25 1400,20 1440,35 L1440,70 L0,70 Z" fill="#F1EAD9" />
        </svg>

        {/* ===== Vision & Mission ===== */}
        <section className="section-padding bg-[#F1EAD9]">
          <div className="container-custom px-4">
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
              {/* Vision */}
              <div className="relative group">
                <div className="blob-1 bg-forest text-cream p-8 md:p-10 shadow-lg h-full transition-transform duration-300 group-hover:-rotate-1">
                  <div className="w-14 h-14 blob-2 bg-cream/15 flex items-center justify-center mb-5">
                    <Eye className="h-7 w-7 text-ochre" />
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-4">Our Vision</h2>
                  <p className="text-cream/85 text-base md:text-lg leading-relaxed">
                    To make ancient nutrient-dense millets the cornerstone of modern snacking, building a healthier,
                    gut-conscious nation from the roots up.
                  </p>
                </div>
              </div>

              {/* Mission */}
              <div className="relative group md:mt-8">
                <div className="blob-3 bg-white border-2 border-[#EAE0CC] p-8 md:p-10 shadow-md h-full transition-transform duration-300 group-hover:rotate-1">
                  <div className="w-14 h-14 blob-1 bg-terracotta/15 flex items-center justify-center mb-5">
                    <Target className="h-7 w-7 text-terracotta" />
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-charcoal mb-4">Our Mission</h2>
                  <p className="text-charcoal/70 text-base md:text-lg leading-relaxed">
                    To formulate clean-label, high-protein, 100% whole-grain snacks using traditional millets
                    (Ragi, Jowar, and Bajra) that heal the gut, honor our heritage, and make healthy eating
                    effortlessly enjoyable.
                  </p>
                </div>
              </div>
            </div>

            {/* Credentials strip */}
            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
              {[
                { icon: GraduationCap, label: 'B.Voc Nutrition & Dietetics' },
                { icon: Award, label: 'Clean-Label Formulations' },
                { icon: BookOpen, label: 'Garhwali Grain Heritage' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-2.5 bg-white/70 backdrop-blur-sm border border-[#EAE0CC] rounded-full px-5 py-3">
                  <item.icon className="h-5 w-5 text-forest flex-shrink-0" />
                  <span className="text-xs md:text-sm font-bold text-charcoal">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Kullu craft ===== */}
        <KulluCraft />

        {/* wave back */}
        <svg className="wave-divider -mb-px rotate-180" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,30 C200,60 400,5 600,25 C800,45 1000,65 1200,40 C1330,25 1400,20 1440,35 L1440,70 L0,70 Z" fill="#F1EAD9" />
        </svg>

        {/* ===== Fun Ways to Peak ===== */}
        <section id="peak-hacks" className="section-padding">
          <div className="container-custom px-4">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-ochre/20 border border-ochre/40 rounded-full px-4 py-1.5 mb-4">
                <SparkleIcon />
                <span className="text-xs md:text-sm font-bold text-terracotta-dark tracking-wide uppercase">Millet Magic Hacks</span>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-charcoal mb-4 text-balance">
                How Do You <span className="text-terracotta">Peak?</span>
              </h2>
              <p className="text-charcoal/60 text-base md:text-lg">
                Healthy eating shouldn&apos;t feel like a chore. Here are four playful, delicious ways to work our
                millets into real life.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
              {peakHacks.map((hackCard, index) => {
                const Icon = hackCard.icon
                return (
                  <div key={index} className={`group ${hackCard.cardClass} rounded-[2rem] p-7 md:p-9 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-14 h-14 blob-2 ${hackCard.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-7 w-7 ${hackCard.iconColor}`} />
                      </div>
                      <span className={`${hackCard.badge} text-cream text-[11px] md:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide`}>
                        Hack #{String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl font-extrabold mb-2">{hackCard.title}</h3>
                    <p className="text-sm font-semibold opacity-70 italic mb-1">{hackCard.vibe}</p>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">{hackCard.products}</p>
                    <p className="text-sm md:text-base leading-relaxed opacity-80">
                      &ldquo;{hackCard.hack}&rdquo;
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                Shop the Hacks
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== Connect ===== */}
        <section className="pb-20">
          <div className="container-custom px-4">
            <div className="relative group max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-terracotta to-ochre rounded-[2.5rem] opacity-30 blur-xl group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-forest-dark text-cream rounded-[2.5rem] p-8 md:p-12 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-sage rounded-full filter blur-3xl opacity-20"></div>
                <div className="relative z-10">
                  <h2 className="font-heading text-2xl md:text-4xl font-extrabold mb-3">
                    Let&apos;s <span className="text-ochre">Connect</span>
                  </h2>
                  <p className="text-cream/75 mb-8 max-w-md mx-auto">
                    Questions about gut health, collaborations, or bulk orders? We&apos;d love to hear from you.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <a
                      href="https://www.linkedin.com/in/millet-mountain-774657450"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-cream/10 hover:bg-cream/20 rounded-full font-semibold text-sm transition-colors"
                    >
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                    <a
                      href="https://twitter.com/yourhandle"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-cream/10 hover:bg-cream/20 rounded-full font-semibold text-sm transition-colors"
                    >
                      <Twitter className="h-4 w-4" /> Twitter
                    </a>
                    <a
                      href="mailto:milletmountain23@gmail.com"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-cream/10 hover:bg-cream/20 rounded-full font-semibold text-sm transition-colors"
                    >
                      <Mail className="h-4 w-4" /> Email
                    </a>
                  </div>

                  <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta hover:bg-terracotta-dark text-cream rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg">
                    Get in Touch
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function SparkleIcon() {
  return (
    <svg className="h-4 w-4 text-terracotta" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.09 6.26L20 10.27l-5.91 2.01L12 18.54l-2.09-6.26L4 10.27l5.91-2.01L12 2z" />
    </svg>
  )
}
