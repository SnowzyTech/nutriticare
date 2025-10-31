"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductFilters } from "@/components/shop/product-filters"
import { ProductGrid } from "@/components/shop/product-grid"
import { Search } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

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
          <h1 className="text-4xl font-bold text-foreground mb-8">All Products</h1>

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
