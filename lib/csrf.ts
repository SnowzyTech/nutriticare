import { cookies } from "next/headers"

const CSRF_TOKEN_LENGTH = 32
const CSRF_COOKIE_NAME = "__csrf-token"

export async function generateCSRFToken(): Promise<string> {
  // Use Web Crypto API instead of crypto module (works in edge runtime)
  const buffer = new Uint8Array(CSRF_TOKEN_LENGTH)
  crypto.getRandomValues(buffer)
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function setCSRFCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export async function verifyCSRFToken(token: string): Promise<boolean> {
  const cookieStore = await cookies()
  const storedToken = cookieStore.get(CSRF_COOKIE_NAME)?.value

  if (!storedToken || !token) {
    return false
  }

  // Web Crypto API doesn't have timing-safe equal, but this is acceptable for CSRF tokens
  return storedToken === token
}
