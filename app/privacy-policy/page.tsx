"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Shield, Lock, Eye, Database, Mail, UserCheck } from "lucide-react"

export default function PrivacyPolicyPage() {
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
              <Shield className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm">Last Updated: January 2026</p>
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
              At NutritiCare, we are committed to protecting your privacy and ensuring the security of your personal
              information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you visit our website or make a purchase from us.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <Database className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
                <div className="space-y-4 text-foreground/90">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                    <p className="leading-relaxed">
                      When you place an order or create an account, we collect information such as your name, email
                      address, phone number, shipping address, and payment details.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Health Information</h3>
                    <p className="leading-relaxed">
                      If you choose to share health-related information in forms or surveys, we collect and store this
                      data securely to better serve your wellness needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <UserCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
                <ul className="space-y-3 text-foreground/90">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Process and fulfill your orders, including shipping and customer service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Communicate with you about your orders, products, and services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Send you marketing communications (with your consent)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Improve our website, products, and customer service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Prevent fraud and enhance security</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
                <p className="text-foreground/90 leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your personal information from
                  unauthorized access, disclosure, or destruction. This includes:
                </p>
                <ul className="space-y-2 text-foreground/90">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>SSL encryption for data transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Secure payment processing through trusted payment gateways</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Regular security audits and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Restricted access to personal data by authorized personnel only</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <Eye className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
                <p className="text-foreground/90 leading-relaxed mb-4">You have the right to:</p>
                <ul className="space-y-2 text-foreground/90">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Access the personal information we hold about you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Request correction of inaccurate information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Request deletion of your personal data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Opt-out of marketing communications at any time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Object to processing of your personal data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-6 md:p-8">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                <p className="text-foreground/90 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us
                  at:
                </p>
                <div className="space-y-2 text-foreground/90">
                  <p>
                    <strong>Email:</strong> support@nutriticare.com
                  </p>
                  <p>
                    <strong>Phone:</strong>09163447732
                  </p>
                  <p>
                    <strong>Address:</strong> Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="font-semibold text-lg text-foreground mb-3">Policy Updates</h3>
            <p className="text-foreground/90 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal
              requirements. We will notify you of any significant changes by posting the new policy on this page and
              updating the "Last Updated" date.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
