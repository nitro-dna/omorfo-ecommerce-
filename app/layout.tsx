import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ómorfo - Premium Custom Posters',
  description: 'Discover and purchase high-quality custom posters. From abstract art to vintage designs, find the perfect poster for your space.',
  keywords: 'posters, wall art, custom posters, home decor, art prints, vintage posters, abstract art',
  authors: [{ name: 'ómorfo' }],
  creator: 'ómorfo',
  publisher: 'ómorfo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://posterhub.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ómorfo - Premium Custom Posters',
    description: 'Discover and purchase high-quality custom posters. From abstract art to vintage designs, find the perfect poster for your space.',
    url: 'https://omorfo.com',
    siteName: 'ómorfo',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ómorfo - Premium Custom Posters',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ómorfo - Premium Custom Posters',
    description: 'Discover and purchase high-quality custom posters. From abstract art to vintage designs, find the perfect poster for your space.',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<div className="h-16 bg-white shadow-sm border-b border-primary-200" />}>
              <Header />
            </Suspense>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
