"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

export function SignupForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (error) {
        setError(error.message)
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Account created successfully! Redirecting to home...",
        })
        router.push("/")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignup} className="space-y-6 w-full max-w-md">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div>
        <label className="block text-foreground font-medium mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-foreground font-medium mb-2">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
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
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
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

      <div>
        <label className="block text-foreground font-medium mb-2">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 py-3 text-lg cursor-pointer">
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <p className="text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
          Sign In
        </Link>
      </p>
    </form>
  )
}
