import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (error || !post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("[v0] Blog slug API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
