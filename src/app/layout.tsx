import './globals.css'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@/components/Analytics'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata = {
  metadataBase: new URL('https://heliotrends.app'),
  title: 'HelioTrends - Solar Activity vs Netflix Trends',
  description: 'Dashboard showing the relationship between solar activity and Netflix trending content',
  keywords: 'solar weather, netflix trends, data visualization, real-time dashboard, space weather, correlation analysis, NASA, TMDB',
  authors: [{ name: 'HelioTrends Team' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'HelioTrends',
    description: 'Solar Activity vs Netflix Trends Dashboard',
    type: 'website',
    url: 'https://heliotrends.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HelioTrends',
    description: 'Solar Activity vs Netflix Trends Dashboard',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#8B5CF6" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#f1f5f9',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  backdropFilter: 'blur(10px)',
                },
              }}
            />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}