import { Leaf, Beaker, Heart } from "lucide-react"

export function PromiseSection() {
  return (
    <section className="py-16 mb-16 bg-card/50">
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
          <div className="bg-background rounded-lg p-8 border border-border text-center hover:shadow-lg transition">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Backed by Nature</h3>
            <p className="text-muted-foreground">
              We source pure, potent herbs grown in rich African soil and blend them to awaken your body's natural power
              to heal and renew.
            </p>
          </div>

          {/* Proven by Science */}
          <div className="bg-background rounded-lg p-8 border border-border text-center hover:shadow-lg transition">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Beaker className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Proven by Science</h3>
            <p className="text-muted-foreground">
              We don't guess — we prove. Each product is guided by research, tested for results, and refined through
              modern science.
            </p>
          </div>

          {/* Driven by Truth */}
          <div className="bg-background rounded-lg p-8 border border-border text-center hover:shadow-lg transition">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Driven by Truth</h3>
            <p className="text-muted-foreground">
              No gimmicks. No shortcuts. No empty promises. Just honest wellness — rooted in integrity, crafted with
              care.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Our Story</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-4">
            In a world that rushes healing, we choose to slow down. To listen. To study the quiet wisdom of herbs that
            have restored balance for generations.
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            That's where Nutriticare began — with a deep respect for nature's intelligence and a passion to make its
            power accessible to modern living. Each of our blends is made from carefully selected herbs, carefully
            blended to support your body's natural rhythm — not override it.
          </p>
        </div>
      </div>
    </section>
  )
}
