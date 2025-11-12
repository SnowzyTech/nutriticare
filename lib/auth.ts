import { getSupabaseServer } from "./supabase-server"

/**
 * Check if the current user is authenticated and is an admin
 * This should be used in server components and server actions
 */
export async function requireAdminAuth() {
  const supabase = await getSupabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Unauthorized: No session found")
  }

  const { data: userData, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

  if (error || !userData?.is_admin) {
    throw new Error("Unauthorized: Admin access required")
  }

  return session.user
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await getSupabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  return session.user
}
