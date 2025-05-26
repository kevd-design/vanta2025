import "./globals.css"
import { Open_Sans, Gilda_Display } from "next/font/google"
import Script from "next/script"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`no-js ${openSans.variable} ${gildaDisplay.variable} antialiased`}>
      <head>
        <Script 
          id="js-detection" 
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');})();`
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}