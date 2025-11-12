"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Search, X } from "lucide-react"
import type { BlogPost } from "@/lib/types"
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/server-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function AdminBlogPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>("")
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Nutrition",
    excerpt: "",
    content: "",
    featured_image: "",
    published: false,
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
        fetchBlogPosts()
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const filtered = blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredPosts(filtered)
  }, [searchQuery, blogPosts])

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch("/api/blog?limit=100")
      const data = await response.json()
      setBlogPosts(data.posts || [])
    } catch (error) {
      console.error("Failed to fetch blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })
      const data = await response.json()
      if (data.url) {
        return data.url
      }
      return null
    } catch (error) {
      console.error("Image upload failed:", error)
      return null
    }
  }

  const handleAddNew = () => {
    setEditingSlug(null)
    setFormData({
      title: "",
      slug: "",
      category: "Nutrition",
      excerpt: "",
      content: "",
      featured_image: "",
      published: false,
    })
    setImageFile(null)
    setShowDialog(true)
  }

  const handleEdit = (post: BlogPost) => {
    setEditingSlug(post.slug)
    setFormData({
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt || "",
      content: post.content || "",
      featured_image: post.featured_image || "",
      published: post.published,
    })
    setImageFile(null)
    setShowDialog(true)
  }

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogPost(slug)
        fetchBlogPosts()
        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete blog post"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.slug) {
      alert("Please fill in all required fields")
      return
    }

    let imageUrl = formData.featured_image
    if (imageFile) {
      setUploading(true)
      const uploadedUrl = await handleImageUpload(imageFile)
      setUploading(false)
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      } else {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        })
        return
      }
    }

    const payload = {
      ...formData,
      featured_image: imageUrl,
    }

    try {
      if (editingSlug) {
        await updateBlogPost(editingSlug, payload)
      } else {
        await createBlogPost(payload)
      }
      fetchBlogPosts()
      setShowDialog(false)
      toast({
        title: "Success",
        description: editingSlug ? "Blog post updated successfully" : "Blog post created successfully",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save blog post"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
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

        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => router.push("/admin")}
                className="md:hidden text-sm px-4 py-2 bg-background border border-border rounded-lg text-foreground hover:bg-background/80 transition"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Blog Posts</h1>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-primary hover:bg-primary/90 gap-2 w-full md:w-auto cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Blog Post
            </Button>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search blog posts by title, slug, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">Loading blog posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No blog posts match your search" : "No blog posts found. Create your first post!"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition"
                >
                  {/* Featured Image */}
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Post Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>

                    {/* Category and Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs px-2 py-1 rounded bg-background text-muted-foreground">
                        {post.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          post.published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="flex-1 p-2 cursor-pointer border border-border hover:bg-background rounded transition flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                        <span className="text-sm">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="flex-1 p-2 cursor-pointer bg-primary/70  hover:bg-primary/85 border border-border rounded transition flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 " />
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
                <img src={previewImage || "/placeholder.svg"} alt="Blog preview" className="w-full h-auto rounded-lg" />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSlug ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
                <DialogDescription>
                  {editingSlug
                    ? "Update the blog post details below"
                    : "Create a new blog post by filling in the details below"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSave} className="space-y-4">
                {formData.featured_image && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Featured Image</label>
                    <div
                      className="w-full h-48 rounded-lg overflow-hidden cursor-pointer border border-border hover:border-primary transition"
                      onClick={() => {
                        setPreviewImage(formData.featured_image)
                        setShowImagePreview(true)
                      }}
                    >
                      <img
                        src={formData.featured_image || "/placeholder.svg"}
                        alt="Blog preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, featured_image: "" })
                          setImageFile(null)
                        }}
                        className="cursor-pointer flex-1 px-3 py-2 bg-background border border-border rounded text-sm hover:bg-background/80 transition"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => document.getElementById("blog-image-input")?.click()}
                        className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    placeholder="Enter blog post title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    placeholder="blog-post-slug"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option>Nutrition</option>
                    <option>Fitness</option>
                    <option>Recipes</option>
                    <option>Mental Health</option>
                    <option>Product Spotlights</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary h-20"
                    placeholder="Brief excerpt for the blog post"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary h-32"
                    placeholder="Enter blog post content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Featured Image</label>
                  <input
                    id="blog-image-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setImageFile(file)
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          setFormData({ ...formData, featured_image: event.target?.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-foreground">
                    Publish this post
                  </label>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => setShowDialog(false)}
                    className="bg-background cursor-pointer border border-border text-foreground hover:bg-background/80"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading} className="cursor-pointer bg-primary hover:bg-primary/90">
                    {uploading ? "Uploading..." : editingSlug ? "Update Post" : "Create Post"}
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
