import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: number
}

export function StatsCard({ label, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
              {trend > 0 ? "+" : ""}
              {trend}% from last month
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  )
}
