import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "6")

    const supabase = await getSupabaseServer()

    let query = supabase.from("blog_posts").select("*").eq("published", true)

    // Filter by category
    if (category && category !== "All") {
      query = query.eq("category", category)
    }

    // Filter by search
    if (search) {
      query = query.ilike("title", `%${search}%`)
    }

    // Sort by published_at descending
    query = query.order("published_at", { ascending: false })

    const { data: posts, error } = await query

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
    }

    // Pagination
    const total = posts?.length || 0
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedData = posts?.slice(start, end) || []

    return NextResponse.json({
      posts: paginatedData,
      total,
      page,
      limit,
    })
  } catch (error) {
    console.error("[v0] Blog API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
