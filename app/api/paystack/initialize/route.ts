import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, reference, customerDetails, items } = body

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const callbackUrl = `${baseUrl}/api/paystack/callback`

    // Initialize Paystack payment
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        reference,
        callback_url: callbackUrl,
        metadata: {
          customerDetails,
          items,
          cart: items, // Include as 'cart' for consistency with callback
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.message }, { status: 400 })
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
