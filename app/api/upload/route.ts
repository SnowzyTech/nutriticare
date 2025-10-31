import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const supabase = await getSupabaseAdmin()
    const buffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage.from("images").upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      console.error("[v0] Supabase upload error:", error)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    const { data: publicData } = supabase.storage.from("images").getPublicUrl(fileName)

    return NextResponse.json({ url: publicData.publicUrl }, { status: 200 })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
