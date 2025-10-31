"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Product } from "@/lib/types"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?limit=4")
        const data = await response.json()
        setProducts(data.products.slice(0, 4))
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const cardColors = [
    "bg-amber-100", // Cream/beige
    "bg-gray-100", // Light gray
    "bg-teal-900", // Teal/dark green
    "bg-yellow-500", // Golden yellow
  ]

  return (
    <section className="py-16 mb-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Most Loved Products</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Link key={product.id} href={`/shop/${product.slug}`}>
                <div
                  className={`rounded-lg overflow-hidden hover:shadow-lg border bg-background transition cursor-pointer h-full flex flex-col animate-slide-in-up animate-delay-${(index % 5) + 1}00`}
                >
                  <div
                    className={`md:h-[320px] h-[300px] ${cardColors[index % cardColors.length]}`}
                    style={{
                      backgroundImage: `url(${product.image_url || "/dietary-supplements.png"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="p-4 flex-1 flex flex-col bg-card rounded-b-lg">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {product.description?.substring(0, 60)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-primary">₦{product.price.toFixed(2)}</p>
                        {product.original_price && (
                          <p className="text-sm text-muted-foreground line-through">
                            ₦{product.original_price.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {/* <Star className="w-4 h-4 fill-primary text-primary" /> */}
                        {/* <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)}</span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
