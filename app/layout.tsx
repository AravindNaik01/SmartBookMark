import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { Header } from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Bookmark App',
  description: 'Manage your bookmarks with ease.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* We will implement Header logic inside Header component (client/server split) */}
          <Header />
          <main className="flex-1 container mx-auto py-8">
            {children}
          </main>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
