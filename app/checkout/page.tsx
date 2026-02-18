"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@supabase/ssr"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping")
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          console.warn("[v0] Supabase environment variables not set")
          setIsAuthenticated(false)
          toast({
            title: "Authentication Required",
            description: "Please sign in to proceed with checkout.",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to proceed with checkout.",
            variant: "destructive",
          })
          router.push("/login")
        }
      } catch (error) {
        console.error("[v0] Auth check error:", error)
        setIsAuthenticated(false)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate all required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    setStep("payment")
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate unique reference
      const reference = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Initialize payment with Paystack
      const initResponse = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          amount: total,
          reference,
          customerDetails: formData,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      const initData = await initResponse.json()

      console.log("[v0] Payment init response:", JSON.stringify(initData))
      console.log("[v0] Payment init HTTP status:", initResponse.status)

      if (!initData.success) {
        throw new Error(initData.error || "Failed to initialize payment")
      }

      window.location.href = initData.authorizationUrl
    } catch (error) {
      console.error("[v0] Payment error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Payment failed",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-card rounded-lg p-12 text-center border border-border">
            <p className="text-lg text-muted-foreground mb-6">Your cart is empty</p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90">Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-card rounded-lg p-12 text-center border border-border">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <p className="text-muted-foreground mb-8">
              Order confirmation has been sent to {formData.email}. You can track your order status in the admin
              dashboard.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">Return to Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Steps */}
            <div className="flex-col md:flex gap-4 mb-8">
              <div
                className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition ${
                  step === "shipping"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground"
                }`}
              >
                Customer Details
              </div>
              <div
                className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition ${
                  step === "payment"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground"
                }`}
              >
                Payment
              </div>
            </div>

            {/* Customer Details Form */}
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="bg-card rounded-lg p-8 border border-border space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Customer Details</h2>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                    required
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                  required
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                  required
                />

                <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-3 cursor-pointer">
                  Continue to Payment
                </Button>
              </form>
            )}

            {/* Payment Form */}
            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="bg-card rounded-lg p-8 border border-border space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Payment Information</h2>

                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-3">Delivery to:</p>
                  <p className="text-foreground font-medium">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{formData.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.city}, {formData.state}
                  </p>
                  <p className="text-sm text-muted-foreground">{formData.phone}</p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Click the button below to complete your payment securely via Paystack
                  </p>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep("shipping")} className="flex-1">
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary hover:bg-primary/90 gap-2 py-3 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <span className="inline-block animate-spin">⏳</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" />
                          </svg>
                          Continue Payment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-lg p-6 border border-border h-fit sticky top-20">
            <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-foreground font-medium">₦{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₦{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-yellow-300">₦{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
