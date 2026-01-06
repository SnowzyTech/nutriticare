"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Chioma Okafor",
    image: "/nigerian-woman-professional-headshot.jpg",
    text: "The Premium Protein Powder has completely transformed my fitness journey. I noticed significant muscle gains within 2 weeks of consistent use. Highly recommended!",
    rating: 5,
    // product: "Premium Protein Powder",
  },
  {
    id: 2,
    name: "Tunde Adeyemi",
    image: "/nigerian-man-professional-headshot.jpg",
    text: "I actually bought this for my Dad who has diabetes. But can't walk a distance due to pains on his foot. He now moves around freely without those pains again. You can't imagine how happy the entire family is honestly.",
    rating: 5,
    // product: "Multivitamin Complex",
  },
  {
    id: 3,
    name: "Aminata Hassan",
    image: "/nigerian-woman-smiling-portrait.jpg",
    text: "I've tried many supplements, but this one stands out. The results are noticeable within just two weeks!.",
    rating: 5,
    // product: "Omega-3 Fish Oil",
  },
  {
    id: 4,
    name: "Chukwu Emeka",
    image: "/nigerian-man-smiling-portrait.jpg",
    text: "My sugar level used to be a roller coaster! Every time I ate a regular swallow like Semo or Wheat, I knew I was risking a dangerous spike. But after switching to FONIO MILL, my last reading was perfectly stable. I’m eating the foods I love with any soup I want, and my sugar stays low! It’s truly a game-changer; my only regret is not finding this HUNGRY RICE sooner",
    rating: 5,
    // product: "Vitamin D3 Supplements",
  },
  {
    id: 5,
    name: "Zainab Ibrahim",
    image: "/nigerian-woman-happy-portrait.jpg",
    text: "I have been suffering from terrible neuropathy for years, and nothing the doctor gave me ever stopped that constant tingling and burning. After using the Neurovive Balm for just a few days, I felt a calm I hadn't experienced in years. It’s amazing how fast this works!",
    rating: 5,
    // product: "Collagen Powder",
  },
]

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const getVisibleIndices = () => {
    return [currentIndex, (currentIndex + 1) % testimonials.length, (currentIndex + 2) % testimonials.length]
  }

  const visibleIndices = getVisibleIndices()

  return (
    <section className="w-full pb-7 bg-gradient-to-b from-background to-secondary px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-3">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied customers experiencing the benefits
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="flex items-center justify-center gap-4">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="flex-shrink-0 z-10 p-2 rounded-full border border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Testimonial Cards Container */}
            <div className="overflow-hidden flex-1">
              <div className="flex gap-6 transition-transform duration-500 ease-out">
                {visibleIndices.map((index) => {
                  const testimonial = testimonials[index]
                  const position = visibleIndices.indexOf(index)
                  const isActive = position === 0
                  const isPartial = position === 2

                  return (
                    <div
                      key={testimonial.id}
                      className={`flex-shrink-0 transition-all duration-500 ${
                        isPartial ? "w-1/3 opacity-100" : "w-full md:w-[40%]"
                      }`}
                    >
                      <div className="bg-card rounded-lg p-6 h-full border border-border shadow-lg hover:shadow-xl transition-shadow">
                        {/* Rating */}
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-foreground mb-6 leading-relaxed line-clamp-4">{testimonial.text}</p>

                        {/* User Info */}
                        <div className="flex items-center gap-4">
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                          />
                          <div>
                            <p className="font-semibold text-foreground">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.product}</p>
                          </div>
                        </div>

                        {/* Learn More Button */}
                        {/* <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                          Learn More
                        </Button> */}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="flex-shrink-0 z-10 p-2 rounded-full border border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Indicator Dots */}
          {/* <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-8" : "bg-border w-2 hover:bg-muted-foreground"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div> */}

           <div className="mt-15 md:max-w-5xl max-w-2xl w-[93%] flex justify-center mx-auto items-center md:mt-16 border-t border-yellow-300" />

          {/* Counter */}
          <div className="text-center mt-6 text-muted-foreground">
            {/* <p>
              {currentIndex + 1} / {testimonials.length}
            </p> */}
          </div>
        </div>
      </div>
    </section>
  )
}
