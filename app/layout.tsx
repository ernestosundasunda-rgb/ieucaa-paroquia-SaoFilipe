import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Direção da Juventude · IEUCAA Paróquia de São Filipe',
  description:
    'Direção da Juventude da Paróquia de São Filipe Igreja Evangélica Unida, Comunhão Anglicana em Angola. Uma juventude que participa, serve e transforma.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className={`${manrope.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}