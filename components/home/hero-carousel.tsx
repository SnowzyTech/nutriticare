"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ChevronLeft, ChevronRight, Leaf, Sparkles, Activity } from "lucide-react"

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const heroRef = useScrollAnimation()

  const slides = [
    {
      title: "Nature holds the blueprint for healing — not the labs",
      subtitle: "PREMIUM HERBAL SOLUTIONS",
      description:
        " When you give the body what it truly needs, it knows how to heal itself, and that’s why we create natural herbal blends (Products) that help your body detox, restore, and HEAL — from the inside out.",
      icon: <Leaf className="w-8 h-8 text-primary mb-4" />,
    },
    // {
    //   title: "Detoxify your system with the power of plants",
    //   subtitle: "INNER RADIANCE",
    //   description:
    //     "Experience the transformative effects of our botanical detox blends. Cleanse your body and reclaim your natural energy levels through organic, lab-tested ingredients.",
    //   icon: <Sparkles className="w-8 h-8 text-primary mb-4" />,
    // },
    // {
    //   title: "Restore balance to your body naturally",
    //   subtitle: "VITALITY & WELLNESS",
    //   description:
    //     "Our formulas are designed to support your body's innate wisdom. Find your center and improve your daily wellness with our targeted nutritional support.",
    //   icon: <Activity className="w-8 h-8 text-primary mb-4" />,
    // },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[600px] md:h-[600px] bg-background overflow-hidden mb-10 group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--secondary)_0%,_transparent_70%)] opacity-30 pointer-events-none" />

      {/* Carousel Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          <div
            ref={heroRef.ref}
            className={`${heroRef.isVisible ? "animate-slide-in-up" : "opacity-0"} relative h-full flex flex-col items-center justify-center text-center px-6`}
          >
            <div className="mb-6 flex flex-col items-center">
              {slide.icon}
              <span className="text-primary tracking-[0.3em] text-xs font-bold uppercase mb-4 animate-pulse">
                {slide.subtitle}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold text-foreground mb-6 text-balance leading-tight max-w-5xl tracking-tight">
              {slide.title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl leading-relaxed text-pretty">
              {slide.description}
            </p>

            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-10 py-7 transition-all hover:scale-105 shadow-[0_0_20px_rgba(206,18,128,0.3)]">
                Explore Our Shop
              </Button>
            </Link>
          </div>
        </div>
      ))}

     

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-1.5 transition-all rounded-full ${
              i === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
