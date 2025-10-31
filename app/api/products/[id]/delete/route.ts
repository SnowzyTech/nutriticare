import { getSupabaseAdmin } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseAdmin()
    const { id } = await params

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("[v0] Product delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Product delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
