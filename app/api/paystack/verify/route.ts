import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference } = body

    // Verify payment with Paystack
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY?.trim()
    if (!paystackSecretKey) {
      return NextResponse.json({ error: "Payment service is not configured" }, { status: 500 })
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    })

    const data = await response.json()

    if (!response.ok || !data.data) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    const paymentData = data.data

    // Check if payment was successful
    if (paymentData.status !== "success") {
      return NextResponse.json({ error: "Payment was not successful" }, { status: 400 })
    }

    // Save order to database
    const supabase = await getSupabaseServer()
    const { customerDetails, items } = paymentData.metadata

    // Create order with shipping_address as JSONB containing all customer details
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        total_amount: paymentData.amount / 100, // Convert from kobo to naira
        status: "completed",
        payment_method: "paystack",
        shipping_address: customerDetails, // Store all customer details in JSONB field
        user_id: "guest", // For guest checkout
      })
      .select()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    if (orderData && orderData[0] && items) {
      const orderId = orderData[0].id
      const orderItems = items.map((item: any) => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        console.error("Order items creation error:", itemsError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and order created",
      order: orderData?.[0],
    })
  } catch (error) {
    console.error("Paystack verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
