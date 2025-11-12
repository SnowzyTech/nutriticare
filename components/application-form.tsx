"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUploadThing } from "@/lib/uploadthing"
import { Loader2, FileText } from "lucide-react"

interface ApplicationFormProps {
  selectedPosition: string | null
  jobOpenings: { id: string; title: string }[]
  onSuccess: () => void
}

export function ApplicationForm({ selectedPosition, jobOpenings, onSuccess }: ApplicationFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvUrl, setCvUrl] = useState("")

  const { startUpload } = useUploadThing("cvUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        setCvUrl(res[0].url)
        setIsUploading(false)
        toast({
          title: "CV uploaded successfully",
          description: "You can now submit your application",
        })
      }
    },
    onUploadError: (error: Error) => {
      setIsUploading(false)
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      })
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file",
      })
      return
    }

    // Validate file size (8MB)
    if (file.size > 8 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 8MB",
      })
      return
    }

    setCvFile(file)
    setIsUploading(true)
    await startUpload([file])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      position: formData.get("position") as string,
      coverLetter: formData.get("coverLetter") as string,
      cvUrl,
    }

    if (!cvUrl) {
      toast({
        variant: "destructive",
        title: "CV required",
        description: "Please upload your CV before submitting",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application")
      }

      toast({
        title: "Application submitted!",
        description: "We've received your application and will get back to you soon.",
      })

      onSuccess()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Failed to submit application",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" placeholder="Your Name..." required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" placeholder="james@example.com" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+234 800 000 0000" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Select name="position" defaultValue={selectedPosition || undefined} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a position" />
          </SelectTrigger>
          <SelectContent>
            {jobOpenings.map((job) => (
              <SelectItem key={job.id} value={job.title}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover Letter</Label>
        <Textarea
          id="coverLetter"
          name="coverLetter"
          placeholder="Tell us why you're a great fit for this position..."
          rows={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cv">Upload CV (PDF only, max 8MB)</Label>
        <div className="flex items-center gap-4">
          <Input
            id="cv"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            className="flex-1"
          />
          {cvFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>{cvFile.name}</span>
            </div>
          )}
        </div>
        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading CV...</span>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || isUploading || !cvUrl} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  )
}
