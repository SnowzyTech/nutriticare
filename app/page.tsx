"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { FeaturedProducts } from "@/components/home/featured-products"
import { BlogPreview } from "@/components/home/blog-preview"
import { CTASection } from "@/components/home/cta-section"
import { PromiseSection } from "@/components/home/promise-section"
import TestimonialsCarousel from "@/components/home/testimonials-carousel"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export default function Home() {
  const aboutRef = useScrollAnimation()
  const productsRef = useScrollAnimation()
  const promiseRef = useScrollAnimation()
  const blogRef = useScrollAnimation()
  const ctaRef = useScrollAnimation()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HeroCarousel />

      <section
        ref={promiseRef.ref}
        className={`transition-all duration-700 ${promiseRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <PromiseSection />
      </section>
      <section
        ref={productsRef.ref}
        className={`transition-all duration-700 ${productsRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <FeaturedProducts />
      </section>

      <section
        className={`transition-all duration-700 ${
          productsRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <TestimonialsCarousel />
      </section>

      <section
        ref={blogRef.ref}
        className={`transition-all duration-700 ${blogRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <BlogPreview />
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 pt-10" ref={ctaRef.ref}>
        <div
          className={`transition-all duration-700 ${ctaRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <CTASection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
