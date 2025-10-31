"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface ProductFiltersProps {
  onCategoryChange: (categories: string[]) => void
  onPriceChange: (range: [number, number]) => void
}

export function ProductFilters({ onCategoryChange, onPriceChange }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 700000])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    dietary: false,
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/products/categories")
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleCategoryChange = (categoryName: string) => {
    const updated = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((c) => c !== categoryName)
      : [...selectedCategories, categoryName]
    setSelectedCategories(updated)
    onCategoryChange(updated)
  }

  const handlePriceChange = (newMax: number) => {
    const newRange: [number, number] = [priceRange[0], newMax]
    setPriceRange(newRange)
    onPriceChange(newRange)
  }

  const dietary = ["Vegan", "Gluten-free"]

  return (
    <div className="w-full md:w-64 space-y-6">
      {/* Categories */}
      <div className="bg-card rounded-lg p-4">
        <button onClick={() => toggleSection("category")} className="flex items-center justify-between w-full mb-4">
          <h3 className="font-semibold text-foreground">Categories</h3>
          <ChevronDown className={`w-4 h-4 transition ${expandedSections.category ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.category && (
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories available</p>
            ) : (
              categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    className="w-4 h-4 rounded border-border bg-background"
                  />
                  <span className="text-sm text-muted-foreground hover:text-foreground">{cat}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="bg-card rounded-lg p-4">
        <button onClick={() => toggleSection("price")} className="flex items-center justify-between w-full mb-4">
          <h3 className="font-semibold text-foreground">Price Range</h3>
          <ChevronDown className={`w-4 h-4 transition ${expandedSections.price ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="700000"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(Number.parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₦{priceRange[0].toLocaleString()}</span>
              <span>₦{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Dietary Needs */}
      <div className="bg-card rounded-lg p-4">
        <button onClick={() => toggleSection("dietary")} className="flex items-center justify-between w-full mb-4">
          <h3 className="font-semibold text-foreground">Dietary Needs</h3>
          <ChevronDown className={`w-4 h-4 transition ${expandedSections.dietary ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.dietary && (
          <div className="space-y-3">
            {dietary.map((diet) => (
              <label key={diet} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border bg-background" />
                <span className="text-sm text-muted-foreground hover:text-foreground">{diet}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
