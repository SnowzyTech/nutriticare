"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Search, X } from "lucide-react"
import type { Product } from "@/lib/types"
import { createProduct, updateProduct, deleteProduct } from "@/lib/server-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function AdminProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "Vitamins & Minerals",
    price: "",
    original_price: "",
    image_url: "",
    stock: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

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
        await Promise.all([fetchProducts(), fetchCategories()])
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }, [searchQuery, products])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/products/categories")
      const data = await response.json()
      const defaultCategories = [
        "Detox & Cleanse",
        "Women's Wellness",
        "Men's Health",
        "Weight Management",
        "Diabetics Care",
      ]
      setAvailableCategories(data.categories?.length > 0 ? data.categories : defaultCategories)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      // Fallback to default categories
      setAvailableCategories([
        "Detox & Cleanse",
        "Women's Wellness",
        "Men's Health",
        "Weight Management",
        "Diabetics Care",
      ])
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=100")
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "Image size is too large. Upload an image smaller than 5MB",
        variant: "destructive",
      })
      return null
    }

    const formDataUpload = new FormData()
    formDataUpload.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })
      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to upload image",
          variant: "destructive",
        })
        return null
      }

      if (data.url) {
        return data.url
      }
      return null
    } catch (error) {
      console.error("Image upload failed:", error)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let imageUrl = formData.image_url
    if (imageFile) {
      setUploading(true)
      const uploadedUrl = await handleImageUpload(imageFile)
      setUploading(false)
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      } else {
        return
      }
    }

    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      category: formData.category,
      price: Number.parseFloat(formData.price),
      original_price: formData.original_price ? Number.parseFloat(formData.original_price) : undefined,
      image_url: imageUrl,
      stock: Number.parseInt(formData.stock) || 0,
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await createProduct(payload)
      }
      await Promise.all([fetchProducts(), fetchCategories()])
      setShowDialog(false)
      setEditingId(null)
      setFormData({
        name: "",
        slug: "",
        description: "",
        category: "Vitamins & Minerals",
        price: "",
        original_price: "",
        image_url: "",
        stock: "",
      })
      toast({
        title: "Success",
        description: editingId ? "Product updated successfully" : "Product created successfully",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save product"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id)
        await Promise.all([fetchProducts(), fetchCategories()])
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete product"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      category: product.category,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      image_url: product.image_url || "",
      stock: product.stock?.toString() || "0",
    })
    setShowDialog(true)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto flex flex-col">
        <AdminHeader />

        <div className="p-4 md:p-8 mt-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => router.push("/admin")}
                className="md:hidden cursor-pointer text-sm px-4 py-2 bg-background border border-border rounded-lg text-foreground hover:bg-background/80 transition"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Products</h1>
            </div>
            <Button
              onClick={() => {
                setEditingId(null)
                setFormData({
                  name: "",
                  slug: "",
                  description: "",
                  category: "Vitamins & Minerals",
                  price: "",
                  original_price: "",
                  image_url: "",
                  stock: "",
                })
                setShowDialog(true)
              }}
              className="bg-primary cursor-pointer hover:bg-primary/90 gap-2 w-full md:w-auto"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </Button>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products by name, slug, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No products match your search" : "No products found. Create your first product!"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold text-primary">₦{product.price.toLocaleString()}</p>
                        {product.original_price && (
                          <p className="text-sm text-muted-foreground line-through">
                            ₦{product.original_price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          product.stock > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 p-2 hover:bg-background border cursor-pointer rounded transition flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4  h-4 text-primary" />
                        <span className="text-sm">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 p-2 bg-primary/70  hover:bg-primary/85 rounded cursor-pointer border border-border transition flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
            <DialogContent className="max-w-2xl">
              <div className="relative">
                <button
                  onClick={() => setShowImagePreview(false)}
                  className="absolute top-2 right-2 p-1 hover:bg-background/80 rounded-full z-10"
                >
                  <X className="w-6 h-6" />
                </button>
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Product preview"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update the product details below"
                    : "Create a new product by filling in the details below"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {formData.image_url && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Product Image</label>
                    <div
                      className="w-full h-48 rounded-lg overflow-hidden cursor-pointer border border-border hover:border-primary transition"
                      onClick={() => {
                        setPreviewImage(formData.image_url)
                        setShowImagePreview(true)
                      }}
                    >
                      <img
                        src={formData.image_url || "/placeholder.svg"}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, image_url: "" })
                          setImageFile(null)
                        }}
                        className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm hover:bg-background/80 transition"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => document.getElementById("product-image-input")?.click()}
                        className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Price (₦)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Original Price (₦) (optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Product Image</label>
                  <input
                    id="product-image-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const maxSize = 5 * 1024 * 1024 // 5MB
                        if (file.size > maxSize) {
                          toast({
                            title: "Error",
                            description: "Image size is too large. Upload an image smaller than 5MB",
                            variant: "destructive",
                          })
                          e.target.value = "" // Clear the input
                          return
                        }

                        setImageFile(file)
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          setFormData({ ...formData, image_url: event.target?.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" onClick={() => setShowDialog(false)} className="bg-muted hover:bg-muted/80">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading} className="bg-primary hover:bg-primary/90">
                    {uploading ? "Uploading..." : editingId ? "Update" : "Create"}
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
