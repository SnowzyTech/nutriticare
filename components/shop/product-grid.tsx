"use client"

import type React from "react"

import { memo, useEffect, useState } from "react"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"

interface ProductGridProps {
  categories?: string[]
  search?: string
  page?: number
  priceRange?: [number, number]
}

const ProductCard = memo(function ProductCard({
  product,
  index,
  onAddToCart,
}: {
  product: Product
  index: number
  onAddToCart: (e: React.MouseEvent, product: Product) => void
}) {
  return (
    <div
      className={`bg-card rounded-lg overflow-hidden hover:shadow-lg transition h-full flex flex-col group animate-slide-in-up animate-delay-${(index % 5) + 1}00`}
    >
      <Link href={`/shop/${product.slug}`} className="flex-1 flex flex-col">
        <div className="relative h-full bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
          <img
            src={product.image_url || "/dietary-supplements.png"}
            alt={product.name}
            loading="lazy"
            className="w-full h-[200px] xs:h-[380px] sm:h-[380px] md:h-[380px] lg:h-[300px] object-cover group-hover:scale-105 transition"
          />
          {product.original_price && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
              S
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          {product.category && (
            <p className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wide mb-1 sm:mb-2">
              {product.category}
            </p>
          )}
          <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2 line-clamp-2 group-hover:text-foreground transition">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 flex-1 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-base sm:text-lg font-bold text-foreground">₦{product.price.toFixed(2)}</p>
              {product.original_price && (
                <p className="text-xs sm:text-sm text-muted-foreground line-through">
                  ₦{product.original_price.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <Button
          onClick={(e) => onAddToCart(e, product)}
          className="w-full bg-primary hover:bg-primary/90 gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10"
        >
          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
})

export function ProductGrid({ categories = [], search, page = 1, priceRange = [0, 700000] }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()

        if (categories.length > 0) {
          params.append("categories", categories.join(","))
        }

        if (search) params.append("search", search)

        params.append("minPrice", priceRange[0].toString())
        params.append("maxPrice", priceRange[1].toString())

        params.append("page", page.toString())

        const response = await fetch(`/api/products?${params}`)
        const data = await response.json()
        setProducts(data.products)
        setTotal(data.total)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categories, search, page, priceRange])

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url || "/dietary-supplements.png",
    })
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner className="w-8 h-8 mb-4" />
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-1">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} onAddToCart={handleAddToCart} />
        ))}
      </div>

      {total > 12 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" disabled={page === 1}>
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {page} of {Math.ceil(total / 12)}
          </span>
          <Button variant="outline" disabled={page >= Math.ceil(total / 12)}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
