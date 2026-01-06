"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-r from-purple-900/20 to-purple-800/10 hover:from-purple-900/30 hover:to-purple-800/20 p-12 rounded-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group cursor-pointer border border-transparent hover:border-primary/30">
        <h2 className="text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
          Contact Us
        </h2>
        <p className="text-muted-foreground group-hover:text-foreground mb-8 max-w-2xl mx-auto transition-colors duration-300">
          Have questions about our products, your order, or our wellness mission? Our dedicated team is ready to assist
          you. We're here to help you on your journey to a healthier you.
        </p>
        <Link href="/contact">
          <Button className="bg-primary hover:bg-primary/90 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/50">
            Contact Us
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
