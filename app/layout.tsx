import './globals.css'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Porkast',
  description: 'Build your own podcast feed by theme or topic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
