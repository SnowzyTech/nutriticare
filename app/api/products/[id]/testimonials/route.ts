import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseServer()
    const { id } = await params

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("product_id", id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
