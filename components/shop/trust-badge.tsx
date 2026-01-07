"use client"

import { Check, Award, Shield, Star, Zap } from "lucide-react"

export function TrustBadge() {
  return (
    <div className="p-6 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl border border-primary/30">
      <div className="flex items-center gap-3 mb-4 border p-4 rounded border-yellow-500 bg-yellow-300/30">
        <Check className="w-13 h-13 text-yellow-300 p-2 rounded-full  border" />
        <h3 className="text-lg font-bold text-foreground">30-Day Money Back Guarantee</h3>
      </div>
      <p className="text-sm text-foreground/80 mt-10 mb-6">
        Try Nutriticare risk-free. 
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <Award className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xs font-semibold text-foreground">GUARANTEED QUALITY</p>
        </div>
        <div className="text-center">
          <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xs font-semibold text-foreground">PREMIUM QUALITY</p>
        </div>
        <div className="text-center">
          <Star className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xs font-semibold text-foreground">A+ RATING</p>
        </div>
        <div className="text-center">
          <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xs font-semibold text-foreground">MONEY BACK GUARANTEE</p>
        </div>
      </div>
    </div>
  )
}
