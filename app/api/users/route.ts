import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from("users")
      .select("id, email, full_name, is_admin, created_at, updated_at")
      .order("full_name", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
