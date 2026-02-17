import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { Header } from '@/components/Header'
import { LoginResultHandler } from '@/components/LoginResultHandler'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export const metadata: Metadata = {
  title: 'Markly',
  description: 'Save and organize your favorite links.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <LoginResultHandler />
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
