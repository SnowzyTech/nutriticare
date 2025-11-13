"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { BlogPost } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"

interface BlogGridProps {
  category?: string
  search?: string
  page?: number
}

export function BlogGrid({ category, search, page = 1 }: BlogGridProps) {
  const [posts, setPostsState] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (category && category !== "All") params.append("category", category)
        if (search) params.append("search", search)
        params.append("page", page.toString())

        const response = await fetch(`/api/blog?${params}`)
        const data = await response.json()
        setPostsState(data.posts)
        setTotal(data.total)
      } catch (error) {
        console.error("Failed to fetch blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [category, search, page])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner className="w-8 h-8 mb-4" />
        <p className="text-muted-foreground">Loading blogs...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post, index) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <div
              className={`bg-card rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col group animate-slide-in-up animate-delay-${(index % 5) + 1}00`}
            >
              <div
                className="md:h-60 h-56 bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-105 transition"
                style={{
                  backgroundImage: `url(${post.featured_image || "/health-wellness.png"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{post.category}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">Read More →</button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {total > 6 && (
        <div className="flex items-center justify-center gap-4">
          <button
            className="px-4 py-2 border border-border rounded hover:bg-card disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-muted-foreground">
            Page {page} of {Math.ceil(total / 6)}
          </span>
          <button
            className="px-4 py-2 border border-border rounded hover:bg-card disabled:opacity-50"
            disabled={page >= Math.ceil(total / 6)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
