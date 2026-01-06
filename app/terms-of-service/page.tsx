"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { FileText, ShoppingCart, Package, AlertCircle, Scale, XCircle } from "lucide-react"

export default function TermsOfServicePage() {
  const heroRef = useScrollAnimation()
  const contentRef = useScrollAnimation()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section ref={heroRef.ref} className={`${heroRef.isVisible ? "animate-slide-in-down" : "opacity-0"} mb-12`}>
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-8 md:p-12 text-center">
            <div className="flex justify-center mb-4">
              <FileText className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground text-sm">Last Updated: January 2025</p>
          </div>
        </section>

        {/* Content Section */}
        <section
          ref={contentRef.ref}
          className={`${contentRef.isVisible ? "animate-slide-in-up" : "opacity-0"} space-y-12`}
        >
          {/* Introduction */}
          <div className="prose prose-slate max-w-none">
            <p className="text-foreground/90 leading-relaxed">
              Welcome to NutritiCare. By accessing our website and purchasing our products, you agree to be bound by
              these Terms of Service. Please read them carefully before making a purchase.
            </p>
          </div>

          {/* Products and Orders */}
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <ShoppingCart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Products and Orders</h2>
                <div className="space-y-4 text-foreground/90">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Product Information</h3>
                    <p className="leading-relaxed">
                      We strive to provide accurate product descriptions and images. However, we do not warrant that
                      product descriptions, images, or other content is accurate, complete, reliable, current, or
                      error-free.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Order Acceptance</h3>
                    <p className="leading-relaxed">
                      We reserve the right to refuse or cancel any order for any reason, including product availability,
                      errors in pricing or product information, or suspected fraudulent activity.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Pricing</h3>
                    <p className="leading-relaxed">
                      All prices are listed in Nigerian Naira (NGN) and are subject to change without notice. We are not
                      responsible for typographical errors in pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping and Delivery */}
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <Package className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Shipping and Delivery</h2>
                <ul className="space-y-3 text-foreground/90">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>We ship nationwide across Nigeria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Delivery times vary depending on your location and may take 3-7 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Shipping costs are calculated at checkout based on your delivery address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      We are not responsible for delays caused by courier services or circumstances beyond our control
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Risk of loss and title for products pass to you upon delivery to the carrier</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Returns and Refunds */}
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <XCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Returns and Refunds</h2>
                <p className="text-foreground/90 leading-relaxed mb-4">
                  Due to the nature of our herbal wellness products, we have specific return and refund policies:
                </p>
                <ul className="space-y-2 text-foreground/90">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Products must be unopened and in original packaging for returns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Returns must be initiated within 7 days of delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Refunds will be processed within 14 business days after receiving the returned item</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Shipping costs are non-refundable unless the return is due to our error</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Damaged or defective products will be replaced or refunded at no additional cost</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Health Disclaimer */}
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Health Disclaimer</h2>
                <p className="text-foreground/90 leading-relaxed mb-4">
                  Our products are natural herbal supplements intended to support general wellness. Please note:
                </p>
                <ul className="space-y-2 text-foreground/90">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Our products are not intended to diagnose, treat, cure, or prevent any disease</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Consult with a healthcare professional before using our products, especially if you are pregnant,
                      nursing, or taking medication
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Results may vary from person to person</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Discontinue use if you experience any adverse reactions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <Scale className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
                <p className="text-foreground/90 leading-relaxed">
                  All content on this website, including text, graphics, logos, images, and software, is the property of
                  NutritiCare and is protected by Nigerian and international copyright laws. You may not reproduce,
                  distribute, or create derivative works without our express written permission.
                </p>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
            <p className="text-foreground/90 leading-relaxed">
              NutritiCare shall not be liable for any indirect, incidental, special, consequential, or punitive damages
              arising out of your use of our products or website. Our total liability shall not exceed the amount paid
              by you for the product in question.
            </p>
          </div>

          {/* Governing Law */}
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">Governing Law</h2>
            <p className="text-foreground/90 leading-relaxed">
              These Terms of Service are governed by and construed in accordance with the laws of the Federal Republic
              of Nigeria. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the
              Nigerian courts.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Questions About Our Terms?</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-foreground/90">
              <p>
                <strong>Email:</strong> support@nutriticare.com
              </p>
              <p>
                <strong>Phone:</strong> +234 (0) 123 456 7890
              </p>
              <p>
                <strong>Address:</strong> Lagos, Nigeria
              </p>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="font-semibold text-lg text-foreground mb-3">Changes to Terms</h3>
            <p className="text-foreground/90 leading-relaxed">
              We reserve the right to update these Terms of Service at any time. Changes will be effective immediately
              upon posting to the website. Your continued use of our website and products after changes are posted
              constitutes your acceptance of the modified terms.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
