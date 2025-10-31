import { getSupabaseAdmin } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseAdmin()
    const body = await request.json()

    const { product_id, customer_name, customer_text, customer_image, rating } = body

    if (!product_id || !customer_name || !customer_text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("testimonials")
      .insert([
        {
          product_id,
          customer_name,
          customer_text,
          customer_image: customer_image || "/woman-avatar-3.png",
          rating: rating || 5,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Testimonial creation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Testimonial creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
