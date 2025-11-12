import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const updateJobOpeningSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long").trim().optional(),
  requirements: z
    .array(z.string().min(1, "Requirement cannot be empty").max(500, "Requirement too long").trim())
    .min(1, "At least one requirement is needed")
    .max(20, "Too many requirements")
    .optional(),
  location: z.string().min(1, "Location is required").max(100, "Location too long").trim().optional(),
  type: z
    .enum(["Full Time", "Part Time", "Contract", "Internship"], {
      errorMap: () => ({ message: "Invalid job type" }),
    })
    .optional(),
  is_active: z.boolean().optional(),
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
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return { isAdmin: false, error: "Invalid or expired token" }
    }

    // Check if user is an admin
    const { data: userData, error: userError } = await supabase
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
      return NextResponse.json({ error: "Invalid job opening ID format" }, { status: 400 })
    }

    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate the update data
    const validationResult = updateJobOpeningSchema.safeParse(body)
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]
      return NextResponse.json(
        { error: `Validation failed: ${firstError.path.join(".")} - ${firstError.message}` },
        { status: 400 },
      )
    }

    // Check if job opening exists
    const { data: existingJob, error: fetchError } = await supabase
      .from("job_openings")
      .select("id")
      .eq("id", id)
      .single()

    if (fetchError || !existingJob) {
      return NextResponse.json({ error: "Job opening not found" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("job_openings")
      .update(validationResult.data)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Update job opening error:", error)
      return NextResponse.json({ error: "Failed to update job opening" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Update job opening error:", error)
    return NextResponse.json({ error: "Failed to update job opening" }, { status: 500 })
  }
}

// DELETE job opening (admin only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid job opening ID format" }, { status: 400 })
    }

    const authResult = await verifyAdminAuth(request)
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: 401 })
    }

    const { data: existingJob, error: fetchError } = await supabase
      .from("job_openings")
      .select("id")
      .eq("id", id)
      .single()

    if (fetchError || !existingJob) {
      return NextResponse.json({ error: "Job opening not found" }, { status: 404 })
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase.from("job_openings").update({ is_active: false }).eq("id", id)

    if (error) {
      console.error("[v0] Delete job opening error:", error)
      return NextResponse.json({ error: "Failed to delete job opening" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Job opening deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete job opening error:", error)
    return NextResponse.json({ error: "Failed to delete job opening" }, { status: 500 })
  }
}
