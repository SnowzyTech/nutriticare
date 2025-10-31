"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogFilters } from "@/components/blog/blog-filters"
import { BlogGrid } from "@/components/blog/blog-grid"

export default function BlogPage() {
  const [category, setCategory] = useState<string>("All")
  const [search, setSearch] = useState<string>("")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/15 rounded-lg p-12 mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Unlock Your Healthiest Self</h1>
          <p className="text-lg text-muted-foreground">Your guide to a healthier lifestyle.</p>
        </div>

        {/* Filters */}
        <BlogFilters onCategoryChange={setCategory} onSearchChange={setSearch} />

        {/* Blog Grid */}
        <BlogGrid category={category} search={search} />
      </main>
      <Footer />
    </div>
  )
}
