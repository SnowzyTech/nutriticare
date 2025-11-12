import { getSupabaseAdmin } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"
import { testimonialSchema, sanitizeInput } from "@/lib/validation"
import { testimonialLimiter, checkRateLimit } from "@/lib/rate-limit"
import { verifyCSRFToken } from "@/lib/csrf"

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const rateLimit = await checkRateLimit(`testimonial:${ip}`, testimonialLimiter)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many testimonials. Please try again later." }, { status: 429 })
    }

    const csrfToken = request.headers.get("x-csrf-token")
    if (!csrfToken || !(await verifyCSRFToken(csrfToken))) {
      return NextResponse.json({ error: "CSRF token validation failed" }, { status: 403 })
    }

    const body = await request.json()
    const { product_id, customer_name, customer_text, customer_image, rating } = body

    const validationResult = testimonialSchema.safeParse({
      product_id,
      customer_name,
      customer_text,
      rating,
    })

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid input: " + validationResult.error.errors[0].message }, { status: 400 })
    }

    const supabase = await getSupabaseAdmin()

    const sanitizedName = sanitizeInput(validationResult.data.customer_name)
    const sanitizedText = sanitizeInput(validationResult.data.customer_text)

    // Verify product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", validationResult.data.product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("testimonials")
      .insert([
        {
          product_id: validationResult.data.product_id,
          customer_name: sanitizedName,
          customer_text: sanitizedText,
          customer_image: customer_image || "/woman-avatar-3.png",
          rating: validationResult.data.rating || 5,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Testimonial creation error:", error)
      return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Testimonial creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
