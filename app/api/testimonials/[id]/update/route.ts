import { getSupabaseAdmin } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await getSupabaseAdmin()
    const body = await request.json()

    const { customer_name, customer_text, customer_image, rating } = body

    const { data, error } = await supabase
      .from("testimonials")
      .update({
        customer_name,
        customer_text,
        customer_image,
        rating,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("[v0] Testimonial update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("[v0] Testimonial update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
