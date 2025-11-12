import { type NextRequest, NextResponse } from "next/server"
import { generateCSRFToken } from "@/lib/csrf"

export async function GET(request: NextRequest) {
  try {
    const token = await generateCSRFToken()

    const response = NextResponse.json({ token, success: true })

    // Set CSRF token in HTTP-only cookie
    response.cookies.set("__csrf-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("CSRF token generation error:", error)
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 })
  }
}
