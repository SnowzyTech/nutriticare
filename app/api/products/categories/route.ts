import { getSupabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from("products")
      .select("category", { count: "exact", head: false })
      .then((result) => {
        if (result.error) return result
        // Extract unique categories and sort them
        const uniqueCategories = Array.from(new Set(result.data?.map((item: any) => item.category) || []))
          .filter((cat) => cat) // Remove null/empty values
          .sort() as string[]
        return { data: uniqueCategories, error: null }
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ categories: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
