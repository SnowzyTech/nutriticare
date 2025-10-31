"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const verifyResponse = await fetch("/api/admin/verify-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        const errorMessage = verifyData.error || "Login failed"
        setError(errorMessage)
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // If verification passed, sign in with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        toast({
          title: "Login Failed",
          description: authError.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (data.user) {
        toast({
          title: "Success",
          description: "Admin logged in successfully",
        })
        setTimeout(() => {
          router.push("/admin")
        }, 500)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className=" flex items-center justify-center mb-[-50px]">
            <Image src="/logo.png" alt="NutritiCare Logo" width={250} height={200} className="h-50 w-50" />
          </div>

          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard Login</h1>
          <p className="text-muted-foreground mt-2">Welcome back, please log in to your account.</p>
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-lg p-8 border border-border">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-foreground font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nutriticare.com"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full cursor-pointer bg-primary hover:bg-primary/90 py-3 text-lg">
              {loading ? "Logging In..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Demo credentials: admin@nutriticare.com / admin@123
          </p>
        </div>
      </div>
    </div>
  )
}
