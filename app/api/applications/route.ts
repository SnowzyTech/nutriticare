import { type NextRequest, NextResponse } from "next/server"
import { applicationFormSchema } from "@/lib/contact-validation"
import { createClient } from "@supabase/supabase-js"
import { contactLimiter, checkRateLimit } from "@/lib/rate-limit"

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

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

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Rate limiting
    const rateLimit = await checkRateLimit(`job-application:${ip}`, contactLimiter)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()

    const validationResult = applicationFormSchema.safeParse(body)
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]
      return NextResponse.json(
        { error: `Validation failed: ${firstError.path.join(".")} - ${firstError.message}` },
        { status: 400 },
      )
    }

    const { fullName, email, phone, position, coverLetter, cvUrl } = validationResult.data

    if (!cvUrl.includes("uploadthing.com") && !cvUrl.includes("utfs.io")) {
      return NextResponse.json({ error: "Invalid CV URL. Please upload through the form." }, { status: 400 })
    }

    // Insert application into database
    const { data, error } = await getSupabase()
      .from("job_applications")
      .insert({
        full_name: fullName,
        email,
        phone,
        position,
        cover_letter: coverLetter,
        cv_url: cvUrl,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Application submission error:", error)
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Application submission error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: 401 })
    }

    // Fetch all applications
    const { data, error } = await getSupabase()
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Fetch applications error:", error)
      return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
    }

    return NextResponse.json({ applications: data })
  } catch (error) {
    console.error("[v0] Fetch applications error:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
