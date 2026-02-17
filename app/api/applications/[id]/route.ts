import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

const statusSchema = z.object({
  status: z.enum(["pending", "reviewed", "accepted", "rejected"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
})

async function verifyAdminAuth(request: NextRequest): Promise<{ isAdmin: boolean; userId?: string; error?: string }> {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return { isAdmin: false, error: "No authorization token provided" }
    }

    const token = authHeader.substring(7)

    // Verify the JWT token with Supabase
    const {
      data: { user },
      error: authError,
    } = await getSupabase().auth.getUser(token)

    if (authError || !user) {
      return { isAdmin: false, error: "Invalid or expired token" }
    }

    // Check if user is an admin
    const { data: userData, error: userError } = await getSupabase()
      .from("users")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (userError || !userData?.is_admin) {
      return { isAdmin: false, error: "User is not an admin" }
    }

    return { isAdmin: true, userId: user.id }
  } catch (error) {
    console.error("[v0] Admin verification error:", error)
    return { isAdmin: false, error: "Authentication verification failed" }
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid application ID format" }, { status: 400 })
    }

    const authResult = await verifyAdminAuth(request)
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = statusSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid status value. Must be: pending, reviewed, accepted, or rejected" },
        { status: 400 },
      )
    }

    const { status } = validationResult.data

    const { data: existingApp, error: fetchError } = await getSupabase()
      .from("job_applications")
      .select("id")
      .eq("id", id)
      .single()

    if (fetchError || !existingApp) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const { data, error } = await getSupabase().from("job_applications").update({ status }).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Update application status error:", error)
      return NextResponse.json({ error: "Failed to update application status" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Update application status error:", error)
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid application ID format" }, { status: 400 })
    }

    const authResult = await verifyAdminAuth(request)
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: 401 })
    }

    const { data: existingApp, error: fetchError } = await getSupabase()
      .from("job_applications")
      .select("id")
      .eq("id", id)
      .single()

    if (fetchError || !existingApp) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const { error } = await getSupabase().from("job_applications").delete().eq("id", id)

    if (error) {
      console.error("[v0] Delete application error:", error)
      return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Application deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete application error:", error)
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
  }
}
