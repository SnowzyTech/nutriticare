"use client"

import { Leaf, Beaker, Heart } from "lucide-react"

export function PromiseSection() {
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
          {/* Backed by Nature */}
          <div className="group bg-background rounded-lg p-8 border border-border text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-primary/50 cursor-pointer">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/50">
              <Leaf className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
              Backed by Nature
            </h3>
            <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              We source pure, potent herbs grown in rich African soil and blend them to awaken your body's natural power
              to heal and renew.
            </p>
          </div>

          {/* Proven by Science */}
          <div className="group bg-background rounded-lg p-8 border border-border text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-primary/50 cursor-pointer">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/50">
              <Beaker className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
              Proven by Science
            </h3>
            <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              We don't guess — we prove. Each product is guided by research, tested for results, and refined through
              modern science.
            </p>
          </div>

          {/* Driven by Truth */}
          <div className="group bg-background rounded-lg p-8 border border-border text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-primary/50 cursor-pointer">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/50">
              <Heart className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
              Driven by Truth
            </h3>
            <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              No gimmicks. No shortcuts. No empty promises. Just honest wellness — rooted in integrity, crafted with
              care.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
