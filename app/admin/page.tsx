"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { StatsCard } from "@/components/admin/stats-card"
import { Package, ShoppingCart, FileText, Briefcase } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalBlogs: 0,
    totalApplications: 0,
  })
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [topBlogs, setTopBlogs] = useState<any[]>([])
  const [topOrders, setTopOrders] = useState<any[]>([])
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
        return
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", session.user.id)
        .single()

      if (error || !userData?.is_admin) {
        // Sign out non-admin user
        await supabase.auth.signOut()
        router.push("/admin/login")
        return
      }

      setIsAuthenticated(true)
      fetchStats(supabase)
    }

    checkAuth()
  }, [router])

  const fetchStats = async (supabase: any) => {
    try {
      const [productsRes, ordersRes, blogsRes, applicationsRes, topProductsRes, topBlogsRes, topOrdersRes] =
        await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("orders").select("id", { count: "exact", head: true }),
          supabase.from("blog_posts").select("id", { count: "exact", head: true }),
          supabase.from("job_applications").select("id", { count: "exact", head: true }),
          supabase.from("products").select("*").order("created_at", { ascending: false }).limit(4),
          supabase
            .from("blog_posts")
            .select("id, title, slug, category, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("orders")
            .select("id, total_amount, status, created_at, shipping_address")
            .order("created_at", { ascending: false })
            .limit(2),
        ])

      console.log("[v0] Products count:", productsRes.count)
      console.log("[v0] Orders count:", ordersRes.count)
      console.log("[v0] Blogs count:", blogsRes.count)
      console.log("[v0] Applications count:", applicationsRes.count)
      console.log("[v0] Applications response:", applicationsRes)

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalBlogs: blogsRes.count || 0,
        totalApplications: applicationsRes.count || 0,
      })

      setTopProducts(topProductsRes.data || [])
      setTopBlogs(topBlogsRes.data || [])
      setTopOrders(topOrdersRes.data || [])
    } catch (error) {
      console.error("[v0] Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const getCustomerName = (order: any) => {
    const addr = order.shipping_address as any
    return `${addr?.firstName || ""} ${addr?.lastName || ""}`.trim() || "Unknown"
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto flex flex-col">
        <AdminHeader />

        <div className="p-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard label="Total Products" value={stats.totalProducts.toString()} icon={Package} trend={0} />
            <StatsCard label="Total Orders" value={stats.totalOrders.toString()} icon={ShoppingCart} trend={0} />
            <StatsCard label="Total Blogs" value={stats.totalBlogs.toString()} icon={FileText} trend={0} />
            <StatsCard
              label="Total Applications"
              value={stats.totalApplications.toString()}
              icon={Briefcase}
              trend={0}
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Top Blog Posts</h2>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : topBlogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No blog posts yet</div>
              ) : (
                <div className="space-y-4">
                  {topBlogs.map((blog) => (
                    <div key={blog.id} className="p-4 bg-background rounded-lg">
                      <p className="font-medium text-foreground line-clamp-2">{blog.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">{blog.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Orders</h2>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : topOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No orders yet</div>
              ) : (
                <div className="space-y-4">
                  {topOrders.map((order) => (
                    <div key={order.id} className="p-4 bg-background rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{getCustomerName(order)}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            order.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : order.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-muted-foreground">₦{order.total_amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
