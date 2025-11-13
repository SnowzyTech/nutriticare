import { getSupabaseServer } from "./supabase-server"

/**
 * Check if the current user is authenticated and is an admin
 * This should be used in server components and server actions
 */
export async function requireAdminAuth() {
  const supabase = await getSupabaseServer()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("Unauthorized: No authenticated user found")
  }

  const { data: userData, error } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

  if (error || !userData?.is_admin) {
    throw new Error("Unauthorized: Admin access required")
  }

  return user
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await getSupabaseServer()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}
