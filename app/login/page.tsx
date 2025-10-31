import { Heart } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-card flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center">
            <Image src="/logo.png" alt="NutritiCare Logo" width={250} height={200} className="h-50 w-50" />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-background rounded-lg p-8 border border-border mt-[-40px] mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Sign In</h2>
          <p className="text-muted-foreground text-center mb-8">Welcome back to NutritiCare</p>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
