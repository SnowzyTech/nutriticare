import { getSupabaseAdmin } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseAdmin()
    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabase.from("products").update(body).eq("id", id).select()

    if (error) {
      console.error("[v0] Product update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("[v0] Product update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
