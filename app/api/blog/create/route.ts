import { getSupabaseAdmin } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseAdmin()
    const body = await request.json()

    const { title, slug, category, excerpt, content, featured_image, published } = body

    if (!title || !slug || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title,
          slug,
          category,
          author_id: null,
          excerpt,
          content,
          featured_image,
          published: published || false,
          published_at: published ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Blog creation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Blog creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
