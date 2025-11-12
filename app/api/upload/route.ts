import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-server"
import { fileUploadSchema } from "@/lib/validation"
import { formLimiter, checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const rateLimit = await checkRateLimit(`upload:${ip}`, formLimiter)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many uploads. Please try again later." }, { status: 429 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const validationResult = fileUploadSchema.safeParse({
      file: {
        size: file.size,
        type: file.type,
      },
    })

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "").substring(0, 100)

    if (!sanitizedFileName) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 })
    }

    const supabase = await getSupabaseAdmin()
    const buffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${sanitizedFileName}`

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
