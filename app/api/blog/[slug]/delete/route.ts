import { getSupabaseAdmin } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const supabase = await getSupabaseAdmin()
    const { slug } = await params

    const { error } = await supabase.from("blog_posts").delete().eq("slug", slug)

    if (error) {
      console.error("[v0] Blog delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Blog delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
