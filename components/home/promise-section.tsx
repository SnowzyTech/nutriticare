"use client"

import { Leaf, Beaker, Heart } from "lucide-react"

export function PromiseSection() {
  const cards = [
    {
      icon: Leaf,
      title: "Backed by Nature",
      description:
        "We source pure, potent herbs grown in rich African soil and blend them to awaken your body's natural power to heal and renew.",
      direction: "left" as const,
    },
    {
      icon: Beaker,
      title: "Proven by Science",
      description:
        "We don't guess — we prove. Each product is guided by research, tested for results, and refined through modern science.",
      direction: "right" as const,
    },
    {
      icon: Heart,
      title: "Driven by Truth",
      description:
        "No gimmicks. No shortcuts. No empty promises. Just honest wellness — rooted in integrity, crafted with care.",
      direction: "left" as const,
    },
  ]

  return (
    <section className="py-16 mb-1 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Promise */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Promise</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Backed by Nature. Every formula begins where real healing starts — in nature's own medicine cabinet.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {cards.map((card, index) => {
            const Icon = card.icon
            const animationClass = card.direction === "left" ? "animate-slide-in-left" : "animate-slide-in-right"
            return (
              <div
                key={index}
                className={`group bg-background rounded-lg p-8 border border-border text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-primary/50 cursor-pointer ${animationClass} animate-delay-${(index % 5) + 1}00`}
              >
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/50">
                  <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {card.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
