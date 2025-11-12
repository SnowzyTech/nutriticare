import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"
import { apiLimiter, checkRateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServer()

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const rateLimit = await checkRateLimit(`products:${ip}`, apiLimiter)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)

    const categoriesParam = searchParams.get("categories")
    const search = searchParams.get("search")
    const minPrice = Number.parseInt(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "700000")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = 12

    if (page < 1 || isNaN(page)) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 })
    }

    if (minPrice < 0 || maxPrice > 10000000 || minPrice > maxPrice) {
      return NextResponse.json({ error: "Invalid price range" }, { status: 400 })
    }

    let query = supabase.from("products").select("*")

    if (categoriesParam) {
      const categories = categoriesParam.split(",").filter((c) => c.length > 0 && c.length < 50)
      if (categories.length === 0) {
        return NextResponse.json({ error: "Invalid categories" }, { status: 400 })
      }
      query = query.in("category", categories)
    }

    if (search) {
      if (search.length > 100) {
        return NextResponse.json({ error: "Search query too long" }, { status: 400 })
      }
      query = query.ilike("name", `%${search}%`)
    }

    query = query.gte("price", minPrice).lte("price", maxPrice)

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      products: data,
      total: count,
      page,
      limit,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
