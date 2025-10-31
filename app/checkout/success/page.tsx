"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const orderId = searchParams.get("orderId")
  const reference = searchParams.get("reference")

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-card">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-200">Processing your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-card">
      <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/10 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>

        <p className="text-gray-400 mb-6">Thank you for your purchase. Your order has been confirmed.</p>

        <div className="bg-card rounded-lg p-4 mb-6 text-left">
          <div className="mb-3">
            <p className="text-sm text-gray-100">Order ID</p>
            <p className="text-lg font-semibold text-gray-200 break-all">{orderId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-100">Payment Reference</p>
            <p className="text-lg font-semibold text-gray-200 break-all">{reference}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          A confirmation email has been sent to your email address with order details.
        </p>

        <Link
          href="/shop"
          className="inline-block w-full bg-primary hover:bg-primary/70 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
