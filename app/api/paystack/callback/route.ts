import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "No reference provided" }, { status: 400 })
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    const verifyData = await verifyResponse.json()

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed", data: verifyData }, { status: 400 })
    }

    // Payment verified successfully
    const paymentData = verifyData.data

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get cart data from metadata
    const cartData = paymentData.metadata?.cart || paymentData.metadata?.items || []
    const customerDetails = paymentData.metadata?.customer || paymentData.metadata?.customerDetails || {}

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: paymentData.metadata?.user_id || null, // Use user_id from metadata if available
        total_amount: paymentData.amount / 100, // Paystack returns amount in kobo
        status: "completed",
        payment_method: "paystack",
        shipping_address: customerDetails,
      })
      .select()
      .single()

    if (orderError) {
      console.error("[v0] Order creation error:", orderError)
      return NextResponse.json({ error: "Failed to create order", details: orderError }, { status: 500 })
    }

    // Create order items
    if (cartData.length > 0) {
      const orderItems = cartData.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        console.error("[v0] Order items creation error:", itemsError)
        // Order was created but items failed - still return success
      }
    }

    // Redirect to success page with order ID
    return NextResponse.redirect(new URL(`/checkout/success?orderId=${order.id}&reference=${reference}`, request.url))
  } catch (error) {
    console.error("[v0] Callback error:", error)
    return NextResponse.redirect(new URL(`/checkout/failed?error=${encodeURIComponent(String(error))}`, request.url))
  }
}
