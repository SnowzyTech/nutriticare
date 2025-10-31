import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseServer()
    const { id } = await params

    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
