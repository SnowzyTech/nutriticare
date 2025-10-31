import { getSupabaseAdmin } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseAdmin()
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("[v0] Testimonials fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Testimonials fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
