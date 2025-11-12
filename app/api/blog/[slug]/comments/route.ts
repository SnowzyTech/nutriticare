import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"
import { commentSchema, sanitizeInput } from "@/lib/validation"
import { formLimiter, checkRateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const supabase = await getSupabaseServer()
    const { slug } = await params

    const { data: post, error: postError } = await supabase.from("blog_posts").select("id").eq("slug", slug).single()

    if (postError) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const { data: comments, error: commentsError } = await supabase
      .from("blog_comments")
      .select("*, users(full_name, avatar_url)")
      .eq("post_id", post.id)
      .order("created_at", { ascending: false })

    if (commentsError) {
      return NextResponse.json({ error: commentsError.message }, { status: 500 })
    }

    return NextResponse.json(comments)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const rateLimit = await checkRateLimit(`comment:${ip}`, formLimiter)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many comments. Please try again later." }, { status: 429 })
    }

    const supabase = await getSupabaseServer()
    const { slug } = await params
    const body = await request.json()

    const validationResult = commentSchema.safeParse({ content: body.content })
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid comment: " + validationResult.error.errors[0].message },
        { status: 400 },
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: post, error: postError } = await supabase.from("blog_posts").select("id").eq("slug", slug).single()

    if (postError) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const sanitizedContent = sanitizeInput(validationResult.data.content)

    const { data, error } = await supabase
      .from("blog_comments")
      .insert({
        post_id: post.id,
        user_id: user.id,
        content: sanitizedContent,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
