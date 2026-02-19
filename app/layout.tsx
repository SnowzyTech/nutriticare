import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { ChatbotWidget } from "@/components/chatbot-widget"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NutritiCare - Natural Herbal & Wellness Store",
  description:
    "Nutriticare is a specialised herbal and wellness store offering natural herbal and wellness products designed to support body balance and long-term wellbeing.  Shop Nutriticare for natural herbal teas and balms that support weight loss, blood-sugar balance, and everyday wellness. Fast delivery across Nigeria; pay on delivery..",
  keywords: [
    "nutritional supplements",
    "diabetic care",
    "weight loss tea",
    "kidney detox",
    "prostate health",
    "natural wellness",
    "NutritiCare",
  ],


   verification: {
    google: 'XPGuAoGE8UxiLP0N1iUV0Yh9Iu5965K702ALUm9FpG0',
  },

  authors: [{ name: "NutritiCare" }],
  openGraph: {
    title: "NutritiCare - Health & Wellness",
    description: "Premium nutritional supplements for your health journey",
    url: "https://nutriticare.com", // Replace with actual domain
    siteName: "NutritiCare",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutritiCare - Health & Wellness",
    description: "Premium nutritional supplements for your health journey",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#cf1282", // Primary brand color
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
          <ChatbotWidget />
        </CartProvider>
      </body>
    </html>
  )
}
