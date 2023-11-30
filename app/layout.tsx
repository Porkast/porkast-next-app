import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react';


export const metadata: Metadata = {
  title: 'Porkast | Discover, Subscribe, Share Your Personalized Podcast',
  description: 'Discover, share, and enjoy podcasts like never before with Porkast. Subscribe, search for keywords, and effortlessly build personalized podcast lists from various channels. Create your unique listening experience today.',
  keywords: 'podcasts, podcast app, subscribe, keyword search, playlist, personalized listening, Porkast, RSS',
  icons: {
    icon: '/porkast-logo.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  )
}
