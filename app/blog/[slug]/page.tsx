"use client"

import { useEffect, useState } from "react"
import { useParams } from 'next/navigation'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { BlogPost } from "@/lib/types"
import { Facebook, Twitter, Linkedin } from 'lucide-react'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`)
        if (!response.ok) {
          throw new Error("Failed to fetch blog post")
        }
        const data = await response.json()
        setPost(data)

        const categoryParam = data.category ? `&category=${data.category}` : ""
        const relatedResponse = await fetch(`/api/blog?limit=6${categoryParam}`)

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json()
          // Filter out current post and limit to 3
          const filtered = relatedData.posts.filter((p: BlogPost) => p.id !== data.id).slice(0, 3)
          setRelatedPosts(filtered)
        }
      } catch (error) {
        console.error("Failed to fetch blog post:", error)
        setError("Failed to load blog post. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin mb-4">
              <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full"></div>
            </div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-foreground">{error || "Blog post not found"}</p>
        </main>
        <Footer />
      </div>
    )
  }

  const authorName = post.author?.full_name || post.author?.email || "Unknown Author"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex gap-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-primary">
            Home
          </a>
          <span>/</span>
          <a href="/blog" className="hover:text-primary">
            Blog
          </a>
          <span>/</span>
          <span>{post.title}</span>
        </div>

        {/* Article Header */}
        <article>
          <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mb-8 pb-8 border-b border-border">
            {/* <span>By {authorName}</span> */}
            {/* <span>•</span> */}
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
            <span>•</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">{post.category}</span>
          </div>

          {/* Featured Image */}
          <div
            className="h-96 rounded-lg mb-12 bg-gradient-to-br from-primary/20 to-primary/10"
            style={{
              backgroundImage: `url(${post.featured_image || "/health-wellness.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</div>
          </div>

          {/* Share Section */}
          <div className="border-t border-b border-border py-8 mb-12">
            <p className="text-foreground font-semibold mb-4">Share this post:</p>
            <div className="flex gap-4">
              <button className="p-2 bg-card rounded-lg hover:bg-primary/20 transition">
                <Facebook className="w-5 h-5 text-foreground" />
              </button>
              <button className="p-2 bg-card rounded-lg hover:bg-primary/20 transition">
                <Twitter className="w-5 h-5 text-foreground" />
              </button>
              <button className="p-2 bg-card rounded-lg hover:bg-primary/20 transition">
                <Linkedin className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </article>

        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
          {relatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <a
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors group"
                >
                  <div
                    className="h-40 bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors"
                    style={{
                      backgroundImage: `url(${relatedPost.featured_image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                    <button className="text-primary text-sm font-medium hover:underline">Read More →</button>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No related articles available.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
