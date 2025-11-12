"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { CareersSection } from "@/components/careers-section"

export default function AboutPage() {
  const heroRef = useScrollAnimation()
  const storyRef = useScrollAnimation()
  const whyRef = useScrollAnimation()
  const textRef = useScrollAnimation()
  const valuesRef = useScrollAnimation()
  const deliveryRef = useScrollAnimation()
  const careersRef = useScrollAnimation()
  const ctaRef = useScrollAnimation()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section ref={heroRef.ref} className={`${heroRef.isVisible ? "animate-slide-in-down" : "opacity-0"} mb-10`}>
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Our Story – Rooted in Nature. Refined by Care.</h1>
            <p className="text-lg text-muted-foreground"></p>
          </div>
        </section>

        {/* Our Story Section */}
        <section ref={storyRef.ref} className={`${storyRef.isVisible ? "animate-slide-in-up" : "opacity-0"} mb-16`}>
          <div className="space-y-6 text-foreground/90 max-w-5xl mx-auto px-4 md:px-2 lg:px-0">
            <p>
              In a world that rushes healing, we choose to slow down. To listen. To study the quiet wisdom of herbs that
              have restored balance for generations.
            </p>
            <p>
              That's where Nutriticare began — with a deep respect for nature's intelligence and a passion to make its
              power accessible to modern living. Each of our blends is made from carefully selected herbs, carefully
              blended to support your body's natural rhythm — not override it.
            </p>
            <p>
              From detox and hormonal balance to weight control to sugar management and men's vitality, every formula is
              100% natural and created with your well-being in mind. Because when you give your body what's pure, it
              gives you back what you've been missing — strength, balance, and calm.
            </p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section ref={whyRef.ref} className={`${whyRef.isVisible ? "animate-slide-in-up" : "opacity-0"} mb-16`}>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Why Choose Us: The Nutriticare Standard
          </h2>
          <div className="bg-card rounded-lg p-8 border border-border mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Purity You Can Feel. Integrity You Can Trust.</h3>
            <p
              ref={textRef.ref}
              className={`${textRef.isVisible ? "animate-slide-in-up" : "opacity-0"} text-foreground/90 mb-6 leading-10`}
            >
              Every bottle, every blend, every cup begins with respect — for your body, for tradition, and for nature
              itself. <br />
              We don't believe in artificial shortcuts. <br /> We believe in craft, consistency, and care — Everything
              we make starts with honesty and ends with results. <br /> We're a team obsessed with helping people heal
              the right way — naturally.
            </p>
          </div>

          {/* Our Promise */}
          <h2 className="text-[28px] font-bold text-foreground mt-12 mb-6 text-center">Our Promise Is Simple</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background rounded-lg p-6 border border-border">
              <h4 className="text-lg font-bold text-foreground mb-3">100% Natural Ingredients</h4>
              <p className="text-muted-foreground text-sm">
                Every leaf and root is real, nothing synthetic. Pure ingredients for pure results.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 border border-border">
              <h4 className="text-lg font-bold text-foreground mb-3">Gentle yet Effective</h4>
              <p className="text-muted-foreground text-sm">
                Powerful results, no side effects, without chemicals. Nature's power, refined by science.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 border border-border">
              <h4 className="text-lg font-bold text-foreground mb-3">Results that Speak</h4>
              <p className="text-muted-foreground text-sm">
                Not promises, but proof from happy customers. Real wellness, truly felt.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 border border-border">
              <h4 className="text-lg font-bold text-foreground mb-3">🚚Delivered Nationwide</h4>
              <p className="text-muted-foreground text-sm">from our hands to your home.</p>
            </div>
          </div>
        </section>

        {/* Delivery Promise */}
        <section
          ref={deliveryRef.ref}
          className={`${deliveryRef.isVisible ? "animate-slide-in-up" : "opacity-0"} mb-16`}
        >
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg lg:p-10 p-8 -mt-6 ">
            <p className="text-foreground/80 max-w-7xl mx-auto">
              Because what you put into your body should never be a compromise.
            </p>
          </div>
        </section>

        <section ref={careersRef.ref} className={`${careersRef.isVisible ? "animate-slide-in-up" : "opacity-0"} mb-16`}>
          <CareersSection />
        </section>

        {/* CTA Section */}
        <section ref={ctaRef.ref} className={`${ctaRef.isVisible ? "animate-slide-in-up" : "opacity-0"}`}>
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to start your health journey?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of satisfied customers and experience the NutritiCare difference.
            </p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90">Explore Our Products</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
