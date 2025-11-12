import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"
import { apiLimiter, checkRateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const rateLimit = await checkRateLimit(`blog:${ip}`, apiLimiter)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "6")

    if (page < 1 || isNaN(page) || limit < 1 || limit > 100 || isNaN(limit)) {
      return NextResponse.json({ error: "Invalid pagination parameters" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    let query = supabase.from("blog_posts").select("*").eq("published", true)

    if (category && category !== "All") {
      if (category.length > 50) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 })
      }
      query = query.eq("category", category)
    }

    if (search) {
      if (search.length > 100) {
        return NextResponse.json({ error: "Search query too long" }, { status: 400 })
      }
      query = query.ilike("title", `%${search}%`)
    }

    query = query.order("published_at", { ascending: false })

    const { data: posts, error } = await query

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
    }

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
