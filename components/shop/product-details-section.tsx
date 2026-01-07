"use client"

import { useState } from "react"
import { Heart, Leaf, AlertCircle, TrendingUp, Beaker } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductDetailsSectionProps {
  productName: string
  description: string
}

export function ProductDetailsSection({ productName, description }: ProductDetailsSectionProps) {
  const [activeTab, setActiveTab] = useState<"usage" | "ingredients">("usage")

  const tabs = [
    { id: "usage", label: "Why It Works", icon: TrendingUp },
    { id: "ingredients", label: "Key Benefits", icon: Beaker },
  ]

  // Parse description into key benefits (3 sections for 3-column layout)
  const getDescriptionCards = () => {
    const lines = description.split("\n").filter((line) => line.trim())
    // Group into 3 cards
    const cardsPerColumn = Math.ceil(lines.length / 3)
    const cards = []

    for (let i = 0; i < 3; i++) {
      const startIdx = i * cardsPerColumn
      const endIdx = Math.min(startIdx + cardsPerColumn, lines.length)
      const content = lines.slice(startIdx, endIdx).join("\n")

      cards.push({
        icon: [AlertCircle, Heart, Leaf][i],
        title: ["Key Problem", "Our Solution", "Your Results"][i],
        content: content,
      })
    }

    return cards
  }

  const cards = getDescriptionCards()

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="border-b border-border/30">
        <div className="flex gap-2 md:gap-8 overflow-x-auto pb-0">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            const isActive = activeTab === (tab.id as typeof activeTab)
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "pb-4 px-2 md:px-0 font-semibold text-sm md:text-base whitespace-nowrap border-b-2 transition-colors flex items-center gap-2",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/60 hover:text-foreground",
                )}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "usage" && (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex gap-3 items-start">
                <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">How This Works</h4>
                  <p className="text-sm text-foreground/80 whitespace-pre-line">{description.substring(0, 300)}...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ingredients" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cards.map((card, index) => {
                const CardIcon = card.icon
                return (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20"
                  >
                    <div className="flex gap-3 items-start">
                      <CardIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground text-sm mb-1">{card.title}</h4>
                        <p className="text-xs text-foreground/80">{card.content.split("\n")[0]}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200/50">
              <div className="flex gap-3 items-start">
                <Heart className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">100% Natural & Safe</h4>
                  <p className="text-sm text-green-800/80 dark:text-green-100/80">
                    No artificial additives, fillers, or harmful chemicals. All ingredients are naturally sourced and
                    lab tested.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
