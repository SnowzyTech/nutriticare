"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { BlogComment } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface BlogCommentsProps {
  slug: string
}

export function BlogComments({ slug }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}/comments`)
        const data = await response.json()
        setComments(data)
      } catch (error) {
        console.error("Failed to fetch comments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [slug])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([comment, ...comments])
        setNewComment("")
      }
    } catch (error) {
      console.error("Failed to submit comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Comments</h2>

      {/* Existing Comments */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">User</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leave a Comment */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Leave a Comment</h3>
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            rows={4}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary resize-none"
          />
          <Button type="submit" disabled={submitting || !newComment.trim()} className="bg-primary hover:bg-primary/90">
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      </div>
    </div>
  )
}
