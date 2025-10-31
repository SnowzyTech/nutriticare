import { getSupabaseAdmin } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseAdmin()
    const body = await request.json()

    const { name, slug, description, category, price, original_price, image_url, stock } = body

    if (!name || !slug || !category || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          slug,
          description,
          category,
          price,
          original_price,
          image_url,
          stock: stock || 0,
          rating: 0,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Product creation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Product creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
