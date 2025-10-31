"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import type { Order } from "@/lib/types"

export default function AdminOrdersPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

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

          {loading ? (
            <div className="text-center py-12">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No orders found yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => (
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
