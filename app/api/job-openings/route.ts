import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const jobOpeningSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long").trim(),
  requirements: z
    .array(z.string().min(1, "Requirement cannot be empty").max(500, "Requirement too long").trim())
    .min(1, "At least one requirement is needed")
    .max(20, "Too many requirements"),
  location: z.string().min(1, "Location is required").max(100, "Location too long").trim(),
  type: z.enum(["Full Time", "Part Time", "Contract", "Internship"], {
    errorMap: () => ({ message: "Invalid job type" }),
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

// GET all active job openings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("job_openings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Fetch job openings error:", error)
      return NextResponse.json({ error: "Failed to fetch job openings" }, { status: 500 })
    }

    return NextResponse.json({ jobOpenings: data })
  } catch (error) {
    console.error("[v0] Fetch job openings error:", error)
    return NextResponse.json({ error: "Failed to fetch job openings" }, { status: 500 })
  }
}

// POST - Create new job opening (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const validationResult = jobOpeningSchema.safeParse(body)
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]
      return NextResponse.json(
        { error: `Validation failed: ${firstError.path.join(".")} - ${firstError.message}` },
        { status: 400 },
      )
    }

    const { title, requirements, location, type } = validationResult.data

    const { data, error } = await supabase
      .from("job_openings")
      .insert({
        title,
        requirements,
        location,
        type,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Create job opening error:", error)
      return NextResponse.json({ error: "Failed to create job opening" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create job opening error:", error)
    return NextResponse.json({ error: "Failed to create job opening" }, { status: 500 })
  }
}
