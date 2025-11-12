import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NutritiCare - Health & Wellness",
  description: "Premium nutritional supplements for your health journey",
  icons: {
    icon: "/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#1f2937",
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <CartProvider>
          {children}
          <Toaster />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
