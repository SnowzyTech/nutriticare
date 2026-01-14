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
import { ProductImageGallery } from "@/components/shop/product-image-gallery"
import { ProductDetailsSection } from "@/components/shop/product-details-section"
import { BenefitsSection } from "@/components/shop/benefits-section"
import { ComparisonSection } from "@/components/shop/comparison-section"
import { TrustBadge } from "@/components/shop/trust-badge"
import { getProductGalleryImages } from "@/lib/product-gallery-images"

interface Testimonial {
  id: string
  product_id: string
  customer_name: string
  customer_text: string
  customer_image: string
  rating: number
  created_at: string
}

function WhyChooseSection({ productName, description }: { productName: string; description: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const parseDescriptionIntoCards = (text: string) => {
    const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim())
    const cards = []

    // Group sentences into 3 cards max
    const cardsPerGroup = Math.ceil(sentences.length / 3)
    for (let i = 0; i < 3 && i * cardsPerGroup < sentences.length; i++) {
      const cardText = sentences.slice(i * cardsPerGroup, (i + 1) * cardsPerGroup).join(" ")
      if (cardText.trim()) {
        cards.push({
          icon: i === 0 ? "Zap" : i === 1 ? "Shield" : "Award",
          title: extractTitle(cardText),
          description: cardText,
        })
      }
    }
    return cards.length > 0 ? cards : getDefaultCards()
  }

  const extractTitle = (text: string) => {
    const words = text.split(" ").slice(0, 3).join(" ")
    return words.length > 25 ? words.substring(0, 25) + "..." : words
  }

  const getDefaultCards = () => [
    {
      icon: "Zap",
      title: "Powerful Formula",
      description: "Scientifically formulated for maximum effectiveness and proven results.",
    },
    {
      icon: "Shield",
      title: "100% Natural",
      description: "Pure, natural ingredients from trusted sources around the world.",
    },
    {
      icon: "Award",
      title: "Quality Assured",
      description: "Rigorously tested for purity and potency by experts.",
    },
  ]

  const sentences = description.split(/(?<=[.!?])\s+/).filter((s) => s.trim())
  const descriptionCards = parseDescriptionIntoCards(description)

  const iconMap: Record<string, any> = {
    Zap: require("lucide-react").Zap,
    Shield: require("lucide-react").Shield,
    Award: require("lucide-react").Award,
    Lightbulb: require("lucide-react").Lightbulb,
  }

  return (
    <div className="mb-16 m-0 md:m-1 max-w-full overflow-hidden rounded-2xl">
      {/* Header Section */}
      <div className="relative w-full px-6 md:px-10 py-8 md:py-12 bg-gradient-to-r from-yellow-300/40 via-yellow-500/5 to-primary/10 border border-primary/20">
        <div className="absolute top-0 left-0 w-1 h-20 bg-gradient-to-b from-yellow-400 to-transparent"></div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          {`Why Choose ${productName}?`}
          <span className="text-yellow-400 text-2xl">✨</span>
        </h2>
        <p className="text-foreground/70 text-sm md:text-base">Discover the benefits that make all the difference</p>
      </div>

      {/* Cards Grid Section */}
      <div className="px-2  md:px-10 py-12 md:py-16 bg-gradient-to-b from-card/40 to-background">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          {descriptionCards.map((card, index) => {
            const IconComponent = iconMap[card.icon]
            return (
              <div
                key={index}
                className="group relative h-full animate-slide-in-up transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Card Background with yellow accent on hover */}
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                    hoveredIndex === index
                      ? "bg-gradient-to-br from-yellow-500/20 via-primary/15 to-yellow-400/10 border border-yellow-400/40"
                      : "bg-gradient-to-br from-card/50 to-card/40 border border-primary/25"
                  }`}
                ></div>

                {/* Yellow glow effect on hover */}
                <div
                  className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 blur-xl ${
                    hoveredIndex === index ? "opacity-30" : "opacity-0"
                  } bg-gradient-to-r from-yellow-400 to-yellow-300`}
                ></div>

                {/* Card Content */}
                <div className="relative h-full flex flex-col p-5 md:p-6 transition-transform duration-500 group-hover:scale-[1.02]">
                  {/* Icon with yellow background on hover */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg mb-4 transition-all duration-500 ${
                      hoveredIndex === index
                        ? "bg-yellow-400/25 border border-yellow-400/50 shadow-lg shadow-yellow-400/25"
                        : "bg-primary/15 border border-yellow-300/30"
                    }`}
                  >
                    <IconComponent
                      className={`w-6 h-6 md:w-7 md:h-7 transition-colors duration-500 ${
                        hoveredIndex === index ? "text-yellow-400" : "text-yellow-500"
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-semibold text-sm md:text-base leading-snug mb-3 transition-colors duration-500 ${
                      hoveredIndex === index ? "text-yellow-400" : "text-foreground"
                    }`}
                  >
                    {card.title}
                  </h3>

                  {/* Description with span elements */}
                  <p className="text-[15px] md:text-[16px] text-foreground/75 leading-relaxed flex-grow">
                    <span className="block mb-1">{card.description}</span>
                  </p>

                  <div className="mt-4 flex flex-col gap-1">
                    {/* Permanent base line */}
                    <div className="h-0.5 w-full bg-yellow-400/60 rounded-full"></div>

                    {/* Expanding hover line on top */}
                    <div
                      className={`h-1 rounded-full transition-all duration-500 bg-gradient-to-r from-yellow-400 to-yellow-300 ${
                        hoveredIndex === index ? "w-full opacity-100" : "w-0 opacity-0"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
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
  const [selectedImage, setSelectedImage] = useState<string>("")

  useEffect(() => {
    if (!slug) return

    setSelectedImage("")
    setLoading(true)
    setError(null)

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/by-slug?slug=${slug}`)
        if (!response.ok) {
          throw new Error("Failed to fetch product")
        }
        const data = await response.json()
        setProduct(data)

        const [reviewsResponse, testimonialsResponse, relatedResponse] = await Promise.all([
          fetch(`/api/products/${data.id}/reviews`),
          fetch(`/api/products/${data.id}/testimonials`),
          fetch(`/api/products?categories=${encodeURIComponent(data.category)}&limit=8`),
        ])

        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json()
          setReviews(reviewsData)
        }

        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json()
          setTestimonials(testimonialsData)
        }

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json()
          const filtered = relatedData.products.filter((p: Product) => p.id !== data.id).slice(0, 4)
          setRelatedProducts(filtered)
        }

        setSelectedImage(data.image_url)
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
      const container = document.getElementById("testimonials-container")
      if (container) {
        const scrollAmount = 320
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }, 5000)

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
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
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
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Why Choose Section */}
        <div className="w-full">
          <WhyChooseSection productName={product.name} description={dynamicDescription} />
        </div>

        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <ProductImageGallery
            images={getProductGalleryImages(slug)}
            mainImage={selectedImage || product?.image_url}
            originalImage={product?.image_url || ""} // Added originalImage prop to keep track of the original product image
            onImageSelect={setSelectedImage}
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
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                ₦{product.price.toLocaleString()}
              </p>
              {product.original_price && (
                <p className="text-base sm:text-lg text-muted-foreground line-through">
                  ₦{product.original_price.toLocaleString()}
                </p>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-8">
              <div className="flex items-center border border-border rounded-lg w-f">
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
                className="flex-1 flex w-full md:mt-0 mt-3 sm:flex-none md:flex-1 bg-primary hover:bg-primary/90 gap-2 py-6 cursor-pointer text-sm sm:text-base"
              >
                <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
                Add to Cart
              </Button>
            </div>

            <TrustBadge />

            {/* Stock Status */}
            <div className="p-4 bg-card rounded-lg mt-6">
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

        <div className="mb-16">
          <ProductDetailsSection title={product.name} productName={product.name} description={dynamicDescription} />
        </div>

        <div className="mb-16">
          <BenefitsSection productName={product.name} />
        </div>

        <div className="mb-16">
          <ComparisonSection />
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
                          className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
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

        {/* Testimonials Section */}
        <div className="animate-slide-in-down animate-delay-600">
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
                    className="flex-shrink-0 w-80 bg-card rounded-lg p-6 hover:border-primary transition-colors shadow-sm"
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

        {/* Related Products Section */}
        <div className="animate-slide-in-up animate-delay-700 mt-14">
          <h2 className="text-2xl font-bold text-foreground mb-8">You Might Also Like</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct.id}
                  className={`rounded-lg overflow-hidden transition-colors group animate-slide-in-up animate-delay-${(index % 5) + 1}00`}
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
                    <div className="flex w-full items-center lg:gap-10 md:gap-22 gap-20 justify-center">
                      <h3 className="font-semibold w-full lg:text-[22px] text-[15px] md:text-[18px] text-foreground mb-2 line-clamp-2 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-yellow-300 text-[15px] lg:text-[22px] md:text-[18px] font-bold mb-2">
                        ₦{relatedProduct.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 mb-4">
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
                    <a href={`/shop/${relatedProduct.slug}`} className="w-full">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white py-2">Select</Button>
                    </a>
                  </div>
                </div>
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
