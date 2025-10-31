"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroRef = useScrollAnimation();

  const slides = [
    {
      image: "/dietary-supplements.png",
      title: "Healing's blueprint is in nature, not labs",
      description:
        "When you give the body what it truly needs, it knows how to heal itself, and that's why we create natural herbal blends (Products) that help your body detox, restore, and HEAL — from the inside out.",
    },
    {
      image: "/health-wellness.png",
      title: "Backed by Nature. Proven by Science.",
      description:
        "Every formula begins where real healing starts — in nature's own medicine cabinet. We source pure, potent herbs grown in rich African soil and blend them to awaken your body's natural power to heal and renew.",
    },
    {
      image: "/dietary-supplements.png",
      title: "Pure Ingredients. Real Results.",
      description:
        "We don't guess — we prove. Each product is guided by research, tested for results, and refined through modern science so you can trust every dose to do exactly what it says.",
    },
    {
      image: "/health-wellness.png",
      title: "Honesty. Integrity. Wellness.",
      description:
        "No gimmicks. No shortcuts. No empty promises. Just honest wellness — rooted in integrity, crafted with care, and designed to help you feel your best, naturally.",
    },
    {
      image: "/dietary-supplements.png",
      title: "Wellness That's Truly Felt.",
      description:
        "Because you deserve wellness that's not just talked about… but truly felt. Experience the difference that natural, science-backed nutrition can make in your life.",
    },
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
    <section className="relative h-[490px] md:h-[500px] bg-gradient-to-b from-purple-900 via-purple-800 to-slate-900 overflow-hidden mb-16">
      {/* Carousel Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div ref={heroRef.ref} className={`${heroRef.isVisible ? "animate-slide-in-up" : "opacity-0"} relative h-full flex flex-col items-center justify-center text-center px-4`}>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
            <p className="text-lg text-foreground mb-8 max-w-2xl">{slide.description}</p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 cursor-pointer mb-8">Explore Our Shop</Button>
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${index === currentSlide ? "bg-primary" : "bg-primary/40"}`}
          />
        ))}
      </div>
    </section>
  )
}
