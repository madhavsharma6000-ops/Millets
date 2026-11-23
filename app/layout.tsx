import type { Metadata } from 'next'
import { Baloo_2, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Analytics from '@/components/Analytics'
import AuthProvider from '@/components/AuthProvider'
import LayoutWrapper from '@/components/layout/LayoutWrapper'

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://milletmountain.com'
const siteDescription =
  'Nourishment from the peaks. 100% natural millet superfoods — whole grain flours, cookies, flakes and quick-cook mixes, sustainably sourced from hill farmers.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Millet Mountain | Taste and Health in a Bite',
    template: '%s | Millet Mountain',
  },
  description: siteDescription,
  keywords: ['millet', 'millet flour', 'ragi cookies', 'millet flakes', 'ancient grains', 'whole grain', 'healthy snacks', 'gluten-free', 'Millet Mountain'],
  authors: [{ name: 'Millet Mountain' }],
  creator: 'Millet Mountain',
  publisher: 'Millet Mountain',
  icons: { icon: '/logo.png', apple: '/logo.png' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Millet Mountain | Taste and Health in a Bite',
    description: siteDescription,
    siteName: 'Millet Mountain',
    images: [{ url: '/logo.png', width: 500, height: 500, alt: 'Millet Mountain' }],
  },
  twitter: {
    card: 'summary',
    title: 'Millet Mountain | Taste and Health in a Bite',
    description: siteDescription,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Set GOOGLE_SITE_VERIFICATION in your env to add the Search Console tag.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${baloo.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <Analytics />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
