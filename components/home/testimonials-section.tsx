"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  role: string
  image: string
  text: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Health & Wellness Coach",
    image: "/woman-avatar-3.png",
    text: "Nutriticare has transformed how I approach nutrition. The products are premium quality and the customer service is exceptional. Highly recommended!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Fitness Enthusiast",
    image: "/woman-avatar-3.png",
    text: "As someone who takes fitness seriously, I appreciate the transparency in ingredients and sourcing. These supplements have made a real difference.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Nutritionist",
    image: "/woman-avatar-3.png",
    text: "I recommend Nutriticare products to my clients. The science-backed formulations and quality control are top-notch. Trust this brand completely.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Corporate Executive",
    image: "/woman-avatar-3.png",
    text: "Perfect for maintaining wellness while managing a busy lifestyle. The products are effective and delivery is always prompt. Great value for money.",
    rating: 5,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    role: "Life Coach",
    image: "/woman-avatar-3.png",
    text: "I've been using Nutriticare for 2 years now. The consistency in quality and innovation in their product line keeps me coming back. Outstanding!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const currentTestimonial = testimonials[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section className="py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from real customers who have transformed their health journey with Nutriticare
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          {/* Main Testimonial Card */}
          <div
            key={currentTestimonial.id}
            className="bg-card rounded-2xl shadow-xl p-10 md:p-16 border border-border animate-slide-in-up"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Customer Image */}
              <div className="flex justify-center md:justify-start">
                <div className="relative w-48 h-48 rounded-xl overflow-hidden border-4 border-primary/20 shadow-lg">
                  <Image
                    src={currentTestimonial.image || "/placeholder.svg"}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="md:col-span-2">
                {/* Rating Stars */}
                <div className="flex gap-1.5 mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-lg md:text-xl text-foreground mb-8 leading-relaxed">
                  <p>"{currentTestimonial.text}"</p>
                </blockquote>

                {/* Customer Name & Role */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-xl font-bold text-foreground">{currentTestimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentTestimonial.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={handlePrevious}
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-primary w-8" : "bg-muted hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            {currentIndex + 1} / {testimonials.length}
          </div>
        </div>
      </div>
    </section>
  )
}
