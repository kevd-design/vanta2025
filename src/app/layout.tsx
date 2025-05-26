import "./globals.css"
import { Open_Sans, Gilda_Display } from "next/font/google"
import { generateSiteMetadata } from './(site)/components/common/SiteMetadata'
import type { Metadata } from 'next'

const openSans = Open_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-open-sans',
})

const gildaDisplay = Gilda_Display({
  weight: ['400'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-gilda-display',
})

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata({
    path: '/'
  })
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${gildaDisplay.variable} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  )
}