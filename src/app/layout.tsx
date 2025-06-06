import "./globals.css"
import { Open_Sans, Gilda_Display } from "next/font/google"
import { generateSiteMetadata } from './components/common/SiteMetadata'
import type { Metadata } from 'next'
import {preloadModule} from 'react-dom'


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

const bridgeScript = 'https://core.sanity-cdn.com/bridge.js'

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
  preloadModule(bridgeScript, {as: 'script'})
  return (
    <html lang="en" className={`${openSans.variable} ${gildaDisplay.variable} antialiased`}>
    <script src={bridgeScript} async type="module" />
      <body>
        {children}
      </body>
    </html>
  )
}