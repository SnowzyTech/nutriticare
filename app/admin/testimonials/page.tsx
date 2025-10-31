"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Search, Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Testimonial {
  id: string
  product_id: string
  customer_name: string
  customer_text: string
  customer_image: string
  rating: number
  created_at: string
}

interface Product {
  id: string
  name: string
}

export default function AdminTestimonialsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    product_id: "",
    customer_name: "",
    customer_text: "",
    customer_image: "/woman-avatar-3.png",
    rating: 5,
  })

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
        fetchTestimonials()
        fetchProducts()
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const filtered = testimonials.filter(
      (testimonial) =>
        testimonial.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        testimonial.customer_text.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredTestimonials(filtered)
  }, [searchQuery, testimonials])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials?limit=100")
      const data = await response.json()
      setTestimonials(data || [])
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=100")
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormData({
      product_id: "",
      customer_name: "",
      customer_text: "",
      customer_image: "/woman-avatar-3.png",
      rating: 5,
    })
    setShowDialog(true)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id)
    setFormData({
      product_id: testimonial.product_id,
      customer_name: testimonial.customer_name,
      customer_text: testimonial.customer_text,
      customer_image: testimonial.customer_image,
      rating: testimonial.rating,
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        const response = await fetch(`/api/testimonials/${id}/delete`, {
          method: "DELETE",
        })
        if (response.ok) {
          fetchTestimonials()
          toast({
            title: "Success",
            description: "Testimonial deleted successfully",
          })
        }
      } catch (error) {
        console.error("Failed to delete testimonial:", error)
        toast({
          title: "Error",
          description: "Failed to delete testimonial",
          variant: "destructive",
        })
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.product_id || !formData.customer_name || !formData.customer_text) {
      alert("Please fill in all required fields")
      return
    }

    try {
      if (editingId) {
        const response = await fetch(`/api/testimonials/${editingId}/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          fetchTestimonials()
          setShowDialog(false)
          toast({
            title: "Success",
            description: "Testimonial updated successfully",
          })
        }
      } else {
        const response = await fetch("/api/testimonials/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          fetchTestimonials()
          setShowDialog(false)
          toast({
            title: "Success",
            description: "Testimonial created successfully",
          })
        }
      }
    } catch (error) {
      console.error("Failed to save testimonial:", error)
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      })
    }
  }

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product"
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto flex flex-col">
        <AdminHeader />

        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => router.push("/admin")}
                className="md:hidden text-sm px-4 py-2 bg-background border border-border rounded-lg text-foreground hover:bg-background/80 transition"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Testimonials</h1>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-primary hover:bg-primary/90 gap-2 w-full md:w-auto cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Testimonial
            </Button>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search testimonials by customer name or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">Loading testimonials...</div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? "No testimonials match your search"
                : "No testimonials found. Create your first testimonial!"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition p-4"
                >
                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={testimonial.customer_image || "/placeholder.svg"}
                      alt={testimonial.customer_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{testimonial.customer_name}</h3>
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{testimonial.customer_text}</p>

                  {/* Product */}
                  <p className="text-xs text-muted-foreground mb-4 bg-background px-2 py-1 rounded w-fit">
                    {getProductName(testimonial.product_id)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="flex-1 p-2 cursor-pointer border border-border hover:bg-background rounded transition flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4 text-primary" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="flex-1 p-2 cursor-pointer bg-primary/70 hover:bg-primary/85 border border-border rounded transition flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Testimonial" : "Create New Testimonial"}</DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update the testimonial details below"
                    : "Create a new testimonial by filling in the details below"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Product *</label>
                  <select
                    value={formData.product_id}
                    onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Testimonial Text *</label>
                  <textarea
                    value={formData.customer_text}
                    onChange={(e) => setFormData({ ...formData, customer_text: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary h-24"
                    placeholder="Enter testimonial text"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number.parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Customer Image URL</label>
                  <input
                    type="text"
                    value={formData.customer_image}
                    onChange={(e) => setFormData({ ...formData, customer_image: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    placeholder="/woman-avatar-3.png"
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => setShowDialog(false)}
                    className="bg-background cursor-pointer border border-border text-foreground hover:bg-background/80"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="cursor-pointer bg-primary hover:bg-primary/90">
                    {editingId ? "Update Testimonial" : "Create Testimonial"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
