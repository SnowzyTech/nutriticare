import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-16 mb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-r from-purple-900/20 to-purple-800/10 p-12 rounded-lg">
        <h2 className="text-3xl font-bold text-foreground mb-4">Contact Us</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Have questions about our products, your order, or our wellness mission? Our dedicated team is ready to assist
          you. We're here to help you on your journey to a healthier you.
        </p>
        <Link href="/contact">
          <Button className="bg-primary hover:bg-primary/90">Contact Us</Button>
        </Link>
      </div>
    </section>
  )
}
