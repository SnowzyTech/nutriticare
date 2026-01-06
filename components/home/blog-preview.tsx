"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { BlogPost } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export function BlogPreview() {
  const [posts, setPostsState] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog?limit=3")
        const data = await response.json()
        setPostsState(data.posts.slice(0, 3))
      } catch (error) {
        console.error("Failed to fetch blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <section className="py-16 mb-0 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">From Our Blog</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div
                  className={`group relative bg-background rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col border border-border animate-slide-in-up animate-delay-${(index % 5) + 1}00`}
                >
                  <div className="relative h-79 overflow-hidden">
                    <div
                      className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 transition-transform duration-500 ease-out"
                      style={{
                        backgroundImage: `url(${post.featured_image || "/health-wellness.png"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                    <Button variant="link" className="text-primary p-0 justify-start">
                      Read More →
                    </Button>
                  </div>

                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <div
                      className="absolute inset-0 transform translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"
                      style={{
                        backgroundImage: `url(${post.featured_image || "/health-wellness.png"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <Button
                      size="lg"
                      className="relative text-white cursor-pointer z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      View Blog
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
