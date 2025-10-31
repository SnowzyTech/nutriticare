"use client"

export function AdminHeader() {
  return (
    <header className="bg-card border-b border-border px-4 md:px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-foreground">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">Welcome back to NutritiCare</p>
      </div>
    </header>
  )
}
