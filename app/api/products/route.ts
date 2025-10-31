import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServer()
    const { searchParams } = new URL(request.url)

    const categoriesParam = searchParams.get("categories")
    const search = searchParams.get("search")
    const minPrice = Number.parseInt(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "700000")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = 12

    let query = supabase.from("products").select("*")

    if (categoriesParam) {
      const categories = categoriesParam.split(",")
      query = query.in("category", categories)
    }

    if (search) {
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
