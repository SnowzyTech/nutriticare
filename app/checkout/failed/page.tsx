"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function CheckoutFailedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const error = searchParams.get("error") || "Payment failed. Please try again."

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="w-16 h-16 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>

        <p className="text-gray-600 mb-6">Unfortunately, your payment could not be processed.</p>

        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700 break-words">{error}</p>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Please check your payment details and try again, or contact support if the problem persists.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go Back
          </button>
          <Link
            href="/checkout"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Retry Payment
          </Link>
        </div>
      </div>
    </div>
  )
}
