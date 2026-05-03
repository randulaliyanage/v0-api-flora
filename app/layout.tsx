import type { Metadata } from 'next'
import { Noto_Serif, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/context/AuthContext'
import { OrderProvider } from '@/context/OrderContext'
import { Toaster } from 'sonner'
import './globals.css'

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: '--font-noto-serif',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'API Flora | Curated Blooms for Every Occasion',
  description: 'AI-driven boutique floral delivery in Sri Lanka. Create custom bouquets, browse curated arrangements, and experience premium flower delivery.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${plusJakartaSans.variable} bg-parchment`}>
      <body className="bg-[#fcf9f5] min-h-screen font-sans antialiased">
        <AuthProvider>
          <OrderProvider>
            {children}
            <Toaster richColors position="top-right" />
          </OrderProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
