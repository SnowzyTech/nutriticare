"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import type { Order } from "@/lib/types"
import { Search, X } from "lucide-react"

export default function AdminOrdersPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "month" | "year">("all")

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
        fetchOrders()
      }
    }

    checkAuth()
  }, [router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders?limit=50")
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...orders]

    // Apply time filter
    if (timeFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      if (timeFilter === "week") {
        filterDate.setDate(now.getDate() - 7)
      } else if (timeFilter === "month") {
        filterDate.setMonth(now.getMonth() - 1)
      } else if (timeFilter === "year") {
        filterDate.setFullYear(now.getFullYear() - 1)
      }

      filtered = filtered.filter((order) => {
        return new Date(order.created_at) >= filterDate
      })
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((order) => {
        const customerName = getCustomerName(order).toLowerCase()
        const customerEmail = getCustomerEmail(order).toLowerCase()
        const orderId = order.id.toLowerCase()
        return customerName.includes(query) || customerEmail.includes(query) || orderId.includes(query)
      })
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, timeFilter])

  if (!isAuthenticated) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "cancelled":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getCustomerName = (order: Order) => {
    const addr = order.shipping_address as any
    return `${addr?.firstName || ""} ${addr?.lastName || ""}`.trim()
  }

  const getCustomerEmail = (order: Order) => {
    const addr = order.shipping_address as any
    return addr?.email || "N/A"
  }

  const getCustomerPhone = (order: Order) => {
    const addr = order.shipping_address as any
    return addr?.phone || "N/A"
  }

  const getCustomerAddress = (order: Order) => {
    const addr = order.shipping_address as any
    return `${addr?.address || ""}, ${addr?.city || ""}, ${addr?.state || ""}`.trim()
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto flex flex-col">
        <AdminHeader />

        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
            <button
              onClick={() => router.push("/admin")}
              className="md:hidden text-sm px-4 py-2 bg-background border border-border rounded-lg text-foreground hover:bg-background/80 transition"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-foreground">Orders</h1>
          </div>

          <div className="bg-card rounded-lg border border-border p-4 md:p-6 mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search by customer name, email, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Time Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTimeFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  timeFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-foreground hover:border-primary"
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setTimeFilter("week")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  timeFilter === "week"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-foreground hover:border-primary"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeFilter("month")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  timeFilter === "month"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-foreground hover:border-primary"
                }`}
              >
                Last Month
              </button>
              <button
                onClick={() => setTimeFilter("year")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  timeFilter === "year"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-foreground hover:border-primary"
                }`}
              >
                Last Year
              </button>
            </div>

            {/* Filter Info */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
              {(searchQuery || timeFilter !== "all") && " (filtered)"}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {orders.length === 0 ? "No orders found yet." : "No orders match your filters."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card rounded-lg border border-border p-6 hover:border-primary transition cursor-pointer"
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                      <p className="text-foreground font-semibold">#{order.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Customer</p>
                      <p className="text-foreground font-medium">{getCustomerName(order)}</p>
                      <p className="text-xs text-muted-foreground">{getCustomerEmail(order)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Amount</p>
                      <p className="text-foreground font-semibold">₦{order.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <p className="text-foreground text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <h3 className="text-sm font-semibold text-foreground mb-4">Customer Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-foreground">{getCustomerPhone(order)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-foreground">{getCustomerEmail(order)}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs text-muted-foreground">Delivery Address</p>
                          <p className="text-foreground">{getCustomerAddress(order)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Payment Method</p>
                          <p className="text-foreground capitalize">{order.payment_method}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
