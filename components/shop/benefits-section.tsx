"use client"

import { Zap, Shield, Award, Check, Star } from "lucide-react"

interface BenefitsSectionProps {
  productName: string
}

export function BenefitsSection({ productName }: BenefitsSectionProps) {
  const benefits = [
    { icon: Zap, title: "Fast Results", desc: "Experience noticeable improvements within days, not weeks" },
    { icon: Shield, title: "Natural Formula", desc: "100% natural ingredients, no harmful chemicals or additives" },
    { icon: Award, title: "Science-Backed", desc: "Clinically tested and proven effective by independent studies" },
    { icon: Check, title: "Premium Quality", desc: "Sourced from the finest suppliers worldwide" },
    {
      icon: Star,
      title: "Trusted by Thousands",
      desc: "Join thousands of satisfied customers experiencing real results",
    },
    { icon: Zap, title: "Lifetime Support", desc: "Dedicated customer support available 24/7 for all your needs" },
  ]

  return (
    <div className="py-12 px-6 md:px-8 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl border border-primary/30">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Why {productName} Works</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon
          return (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/40">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-foreground/80">{benefit.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
