import { type NextRequest, NextResponse } from "next/server"
import { checkoutSchema } from "@/lib/checkout-validation"
import { formLimiter, checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const rateLimit = await checkRateLimit(`checkout:${ip}`, formLimiter)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many payment attempts. Please try again later." }, { status: 429 })
    }

    const body = await request.json()

    const validationResult = checkoutSchema.safeParse(body)
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors)
      return NextResponse.json(
        { error: "Invalid checkout data: " + validationResult.error.errors[0].message },
        { status: 400 },
      )
    }

    const { email, amount, reference, customerDetails, items } = validationResult.data

    const amountInKobo = Math.round(amount * 100)
    if (amountInKobo < 100 || amountInKobo > 50000000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nutriticare.com"
    const callbackUrl = `${baseUrl}/api/paystack/callback`

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY?.trim()

    if (!paystackSecretKey) {
      console.error("[v0] PAYSTACK_SECRET_KEY is not set or empty")
      return NextResponse.json({ error: "Payment service is not configured" }, { status: 500 })
    }

    // Log key prefix for debugging (safe - only shows first 10 chars)
    console.log("[v0] Paystack key prefix:", paystackSecretKey.substring(0, 10))
    console.log("[v0] Paystack key length:", paystackSecretKey.length)

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerDetails.email,
        amount: amountInKobo,
        reference,
        callback_url: callbackUrl,
        metadata: {
          customerDetails,
          items,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[v0] Paystack API error:", JSON.stringify(data))
      console.error("[v0] Paystack HTTP status:", response.status)
      return NextResponse.json(
        { error: data.message || "Payment initialization failed", details: data },
        { status: response.status },
      )
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    })
  } catch (error) {
    console.error("Paystack initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}
