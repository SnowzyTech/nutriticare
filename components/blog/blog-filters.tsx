"use client"

interface BlogFiltersProps {
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
}

export function BlogFilters({ onCategoryChange, onSearchChange }: BlogFiltersProps) {
  const categories = ["All", "Nutrition", "Fitness", "Recipes", "Mental Health", "Product Spotlights"]

  return (
    <div className="space-y-6 mb-8">
      {/* Search */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search articles..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className="px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary transition"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
