"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Product, Review } from "@/lib/types"
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { getProductDescription } from "@/lib/product-descriptions"
import { Spinner } from "@/components/ui/spinner"

interface Testimonial {
  id: string
  product_id: string
  customer_name: string
  customer_text: string
  customer_image: string
  rating: number
  created_at: string
}

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addItem } = useCart()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"description">("description")
  const [testimonialScroll, setTestimonialScroll] = useState(0)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/by-slug?slug=${slug}`)
        if (!response.ok) {
          throw new Error("Failed to fetch product")
        }
        const data = await response.json()
        setProduct(data)

        // Fetch reviews
        const reviewsResponse = await fetch(`/api/products/${data.id}/reviews`)
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json()
          setReviews(reviewsData)
        }

        const testimonialsResponse = await fetch(`/api/products/${data.id}/testimonials`)
        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json()
          setTestimonials(testimonialsData)
        }

        const relatedResponse = await fetch(`/api/products?categories=${encodeURIComponent(data.category)}&limit=8`)
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json()
          // Filter out current product and limit to 4
          const filtered = relatedData.products.filter((p: Product) => p.id !== data.id).slice(0, 4)
          setRelatedProducts(filtered)
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        setError("Failed to load product. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  useEffect(() => {
    if (testimonials.length === 0) return

    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)
      // Scroll to next testimonial
      const container = document.getElementById("testimonials-container")
      if (container) {
        const scrollAmount = 320
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image_url || "/dietary-supplements.png",
      })
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      })
      setQuantity(1)
    }
  }

  const scrollTestimonials = (direction: "left" | "right") => {
    const container = document.getElementById("testimonials-container")
    if (container) {
      const scrollAmount = 320
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
        setTestimonialScroll(Math.max(0, testimonialScroll - scrollAmount))
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
        setTestimonialScroll(testimonialScroll + scrollAmount)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center h-96">
            <Spinner className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-lg">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-foreground">{error || "Product not found"}</p>
        </main>
        <Footer />
      </div>
    )
  }

  const dynamicDescription = getProductDescription(product.slug, product.description)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex gap-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-primary">
            Home
          </a>
          <span>/</span>
          <a href="/shop" className="hover:text-primary">
            Products
          </a>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="mb-16 p-6 md:p-8 bg-card rounded-lg border border-border animate-slide-in-up animate-delay-100">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose {product.name}?</h2>
          <div className="space-y-4 text-foreground/90 leading-relaxed whitespace-pre-line">
            <p>{dynamicDescription}</p>
          </div>
        </div>

        {/* Product Details */}
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Image */}
          <div
            className="h-[450px] sm:h-[520px] md:h-[520px] lg:h-[550px] w-full bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg overflow-hidden animate-slide-in-left animate-delay-200"
            style={{
              backgroundImage: `url(${product.image_url || "/dietary-supplements.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Details */}
          <div className="mt-0 md:mt-6 flex flex-col justify-start animate-slide-in-right animate-delay-300">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 sm:w-5 h-4 sm:h-5 ${
                      i < Math.round(product.rating) ? "fill-primary text-primary" : "fill-primary text-primary"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
                ₦{product.price.toLocaleString()}
              </p>
              {product.original_price && (
                <p className="text-base sm:text-lg text-muted-foreground line-through">
                  ₦{product.original_price.toLocaleString()}
                </p>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8">
              <div className="flex items-center border border-border rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 sm:px-4 py-2 text-muted-foreground hover:text-foreground"
                >
                  −
                </button>
                <span className="px-4 sm:px-6 py-2 text-foreground text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 sm:px-4 py-2 text-muted-foreground hover:text-foreground"
                >
                  +
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                className="flex-1 sm:flex-none md:flex-1 bg-primary hover:bg-primary/90 gap-2 py-6 cursor-pointer text-sm sm:text-base"
              >
                <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
                Add to Cart
              </Button>
            </div>

            {/* Stock Status */}
            <div className="p-4 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground">
                {product.stock > 0 ? (
                  <span className="text-green-500">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-border mb-8 animate-slide-in-up animate-delay-400">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`cursor-pointer py-4 border-b-2 font-semibold transition-colors ${
                activeTab === "description"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Description
            </button>
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-16 animate-slide-in-up animate-delay-500">
          {activeTab === "description" && (
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
              {product.description || "No description available"}
            </p>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="font-semibold text-foreground">{review.title}</p>
                  </div>
                  {review.verified_purchase && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Verified Purchase</span>
                  )}
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16 animate-slide-in-down animate-delay-600">
          <h2 className="text-2xl font-bold text-foreground mb-8">What Our Customers Say</h2>
          <div className="relative">
            <div
              id="testimonials-container"
              className="flex gap-6 overflow-x-auto pb-6 scroll-smooth scrollbar-hide"
              style={{
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style jsx>{`
                #testimonials-container::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 w-80 bg-card rounded-lg p-6  hover:border-primary transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{testimonial.customer_text}</p>

                    <h3 className="font-semibold text-foreground text-end pt-5">{testimonial.customer_name}</h3>
                  </div>
                ))
              ) : (
                <div className="flex-shrink-0 w-80 bg-card rounded-lg p-6 border border-border text-muted-foreground">
                  No testimonials available yet.
                </div>
              )}
            </div>

            <div className="mt-6 md:mt-8 border-t border-primary-foreground" />

            {/* Navigation buttons for testimonials */}
            {testimonials.length > 0 && (
              <>
                <button
                  onClick={() => scrollTestimonials("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-primary hover:bg-primary/90 rounded-full md:p-2 p-1 ml-2 transition-colors"
                >
                  <ChevronLeft className="md:w-5 w-4 h-4 md:h-5 text-foreground" />
                </button>
                <button
                  onClick={() => scrollTestimonials("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-primary hover:bg-primary/90 rounded-full md:p-2 p-1 mr-2 transition-colors"
                >
                  <ChevronRight className="md:w-5 w-4 h-4 md:h-5 text-foreground" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="animate-slide-in-up animate-delay-700">
          <h2 className="text-2xl font-bold text-foreground mb-8">You Might Also Like</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 m-5 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              {relatedProducts.map((relatedProduct, index) => (
                <a
                  key={relatedProduct.id}
                  href={`/shop/${relatedProduct.slug}`}
                  className={`rounded-lg overflow-hidden hover:border-primary transition-colors group animate-slide-in-up animate-delay-${(index % 5) + 1}00`}
                >
                  <div
                    className="h-[500px] bg-card group-hover:from-primary/30 group-hover:to-primary/20 transition-colors"
                    style={{
                      backgroundImage: `url(${relatedProduct.image_url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="pt-4 w-full">
                    <div className="flex w-full items-center lg:gap-10 md:gap-22 gap-44 justify-center">
                      <h3 className="font-semibold w-full lg:text-[22px] text-[20px] text-foreground mb-2 line-clamp-2  transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-primary text-[22px] lg:text-[22px] font-bold mb-2">
                        ₦{relatedProduct.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 ">
                      <div className="flex gap-1 text-2xl">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.round(relatedProduct.rating)
                                ? "fill-primary text-primary"
                                : "fill-primary text-primary"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No related products available.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
