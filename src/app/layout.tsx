import { Cormorant_Garamond, DM_Sans, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/components/providers/ReduxProvider"
import { cn } from "@/lib/utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "FashionHub — Premium Ladies' Fashion Bangladesh",
  description:
    "Discover curated lawn suits, kurtas, sarees & more from top brands like Aarong, Yellow, Khas, Sapphire, and Sana Safinaz.",
  keywords: [
    "fashion",
    "ladies fashion",
    "lawn suits",
    "kurta",
    "saree",
    "Bangladesh fashion",
    "Pakistani lawn",
    "Aarong",
    "Yellow fashion",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", cormorant.variable, dmSans.variable, fontMono.variable, "font-sans")}
    >
      <body>
        <ReduxProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
