import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-96 md:h-[500px] bg-gradient-to-r from-primary/30 to-accent/20 overflow-hidden mb-16">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url(/dietary-supplements.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
          Your Journey to a Healthier You Starts Here.
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          NutritiCare offers a wide range of health and wellness products to support your goals. We have everything you
          need to live a healthier life.
        </p>
        <Link href="/shop">
          <Button className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">Shop Now</Button>
        </Link>
      </div>
    </section>
  )
}
