import { Heart } from "lucide-react"
import { SignupForm } from "@/components/auth/signup-form"
import Image from "next/image"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-card flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mt-[-30px]">
          <div className=" flex items-center justify-center mb-4">
            {/* <Heart className="w-7 h-7 text-primary-foreground fill-primary-foreground" /> */}
             <Image src="/logo.png" alt="NutritiCare Logo" width={250} height={200} className="h-50 w-50" />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-lg p-8 border border-border mt-[-47px] mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Create Your Account</h2>
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
