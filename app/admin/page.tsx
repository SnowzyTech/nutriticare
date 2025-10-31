"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { StatsCard } from "@/components/admin/stats-card"
import { Package, ShoppingCart, FileText } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalBlogs: 0,
  })
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
        fetchStats(supabase)
      }
    }

    checkAuth()
  }, [router])

  const fetchStats = async (supabase: any) => {
    try {
      const [productsRes, ordersRes, blogsRes, topProductsRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("products").select("*").order("created_at", { ascending: false }).limit(4),
      ])

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalBlogs: blogsRes.count || 0,
      })

      setTopProducts(blogsRes.data || [])
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto flex flex-col">
        <AdminHeader />

        <div className="p-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard label="Total Products" value={stats.totalProducts.toString()} icon={Package} trend={0} />
            <StatsCard label="Total Orders" value={stats.totalOrders.toString()} icon={ShoppingCart} trend={0} />
            <StatsCard label="Total Blogs" value={stats.totalBlogs.toString()} icon={FileText} trend={0} />
          </div>

          {/* Top Products */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Top Products</h2>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : topProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No products yet</div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales || 0} sales</p>
                    </div>
                    <p className="font-bold text-primary">₦{product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
