import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Downloader App',
  description: 'Download videos from various platforms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-24">
          {children}
        </main>
        
      </body>
    </html>
  )
}
