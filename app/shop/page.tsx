"use client"

import { Metadata } from 'next'
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductFilters } from "@/components/shop/product-filters"
import { ProductGrid } from "@/components/shop/product-grid"
import { Search } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

// Metadata must be exported from a server component
export const metadata: Metadata = {
  title: 'Shop - NutritiCare | Premium Herbal Supplements',
  description: 'Browse our collection of premium herbal supplements, wellness products, and natural remedies. Find products for weight loss, blood sugar balance, kidney health, prostate support, and more.',
  keywords: ['herbal supplements', 'wellness products', 'natural remedies', 'health products', 'dietary supplements'],
  openGraph: {
    title: 'Shop NutritiCare Herbal Supplements',
    description: 'Discover premium natural herbal supplements for your wellness journey.',
    url: 'https://nutriticare.com/shop',
    siteName: 'NutritiCare',
    type: 'website',
  },
}

export default function ShopPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 700000])
  const [search, setSearch] = useState<string>("")
  const contentRef = useScrollAnimation()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" ref={contentRef.ref}>
        <div className={`${contentRef.isVisible ? "animate-slide-in-down" : "opacity-0"}`}>
          <h1 className="text-4xl font-bold text-foreground mb-3 text-center">Our Products</h1>
          <h2 className="text-center text-lg text-foreground/90">Your Wellness Journey Starts Here.</h2>
          <p className="text-center mb-8 mt-2 text-foreground/90 text-sm"> Explore our natural herbal solutions — each one crafted to help your body find its balance again.</p>

          {/* Search Bar */}
          <div className="mb-8 flex gap-4">
            <div className="flex-1 flex items-center bg-card rounded-lg px-4 py-3 border border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent ml-3 outline-none text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          {/* Filters and Products */}
          <div className="flex flex-col md:flex-row gap-8">
            <ProductFilters onCategoryChange={setCategories} onPriceChange={setPriceRange} />
            <div className="flex-1">
              <ProductGrid categories={categories} search={search} priceRange={priceRange} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
