"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Product, Review } from "@/lib/types"
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { getProductDescription } from "@/lib/product-descriptions"

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
            <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
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

        <div className="mb-16 p-6 md:p-8 bg-card rounded-lg border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose {product.name}?</h2>
          <div className="space-y-4 text-foreground/90 leading-relaxed whitespace-pre-line">
            <p>{dynamicDescription}</p>
          </div>
        </div>

        {/* Product Details */}
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Image */}
          <div
            className="h-64 sm:h-80 md:h-[490px] lg:h-[550px] w-full bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${product.image_url || "/dietary-supplements.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Details */}
          <div className="mt-0 md:mt-6 flex flex-col justify-start">
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
              <Button variant="outline" size="icon" className="w-full sm:w-auto py-6 bg-transparent">
                <Heart className="w-4 sm:w-5 h-4 sm:h-5" />
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

        <div className="border-b border-border mb-8">
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

        <div className="prose prose-invert max-w-none mb-16">
          {activeTab === "description" && (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
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

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">What Our Customers Say</h2>
          <div className="relative">
            <div
              id="testimonials-container"
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              {testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 w-80 bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {/* <img
                        src={testimonial.customer_image || "/placeholder.svg"}
                        alt={testimonial.customer_name}
                        className="w-16 h-16 rounded-full object-cover"
                      /> */}
                      <div>
                        <h3 className="font-semibold text-foreground">{testimonial.customer_name}</h3>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{testimonial.customer_text}</p>
                  </div>
                ))
              ) : (
                <div className="flex-shrink-0 w-80 bg-card rounded-lg p-6 border border-border text-muted-foreground">
                  No testimonials available yet.
                </div>
              )}
            </div>

            {/* Navigation buttons for testimonials */}
            {testimonials.length > 0 && (
              <>
                <button
                  onClick={() => scrollTestimonials("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-primary hover:bg-primary/90 rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={() => scrollTestimonials("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-primary hover:bg-primary/90 rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8">You Might Also Like</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <a
                  key={relatedProduct.id}
                  href={`/shop/${relatedProduct.slug}`}
                  className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors group"
                >
                  <div
                    className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors"
                    style={{
                      backgroundImage: `url(${relatedProduct.image_url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-primary font-bold">₦{relatedProduct.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-1">
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
                      {/* <span className="text-xs text-muted-foreground">({relatedProduct.review_count})</span> */}
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
