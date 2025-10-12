import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { SpeedInsights } from '@vercel/speed-insights/next'
import AppShell from '@/components/AppShell'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Prevents invisible text during loading
})

export const metadata = {
  title: 'Daybreak - Flow State Productivity',
  description: 'Capture the golden hour of productivity. Deep work made easy and rewarding.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Providers>
          <AppShell>
            {children}
          </AppShell>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}
