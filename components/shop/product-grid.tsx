"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-1">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg overflow-hidden hover:shadow-lg transition h-full flex flex-col group animate-slide-in-up animate-delay-${(index % 5) + 1}00`}
          >
            <Link href={`/shop/${product.slug}`} className="flex-1 flex flex-col">
              <div className="relative h-full bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                <div
                  className="w-full h-[300px] group-hover:scale-105 transition"
                  style={{
                    backgroundImage: `url(${product.image_url || "/dietary-supplements.png"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                {product.original_price && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    SALE
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                {product.category && (
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">{product.category}</p>
                )}
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold text-primary">₦{product.price.toFixed(2)}</p>
                    {product.original_price && (
                      <p className="text-sm text-muted-foreground line-through">₦{product.original_price.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <Button
                onClick={(e) => handleAddToCart(e, product)}
                className="w-full bg-primary hover:bg-primary/90 gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
