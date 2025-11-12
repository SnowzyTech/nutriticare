"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Briefcase, MapPin, Clock, Loader } from "lucide-react"
import { ApplicationForm } from "@/components/application-form"

interface JobOpening {
  id: string
  title: string
  requirements: string[]
  location: string
  type: string
}

export function CareersSection() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobOpenings = async () => {
      try {
        const response = await fetch("/api/job-openings")
        const data = await response.json()
        setJobOpenings(data.jobOpenings || [])
      } catch (error) {
        console.error("[v0] Fetch job openings error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobOpenings()
  }, [])

  const handleApply = (jobTitle: string) => {
    setSelectedJob(jobTitle)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <section className="mb-16">
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  if (jobOpenings.length === 0) {
    return null
  }

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Team</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're looking for passionate individuals to help us grow and make a difference in people's lives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobOpenings.map((job) => (
          <div key={job.id} className="bg-card rounded-lg p-6 border border-border hover:border-primary transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">{job.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.type}
                  </span>
                </div>
              </div>
              <Briefcase className="w-6 h-6 text-primary" />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-foreground mb-2">Requirements:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={() => handleApply(job.title)} className="w-full">
              Apply Now
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob}</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit your application. We'll review your submission and get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <ApplicationForm
            selectedPosition={selectedJob}
            jobOpenings={jobOpenings}
            onSuccess={() => {
              setIsDialogOpen(false)
              setSelectedJob(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </section>
  )
}
