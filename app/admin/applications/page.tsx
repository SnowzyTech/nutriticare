"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, Download, Mail, Phone, Calendar, Briefcase, Plus, Loader, Trash2, Pencil } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Application {
  id: string
  full_name: string
  email: string
  phone: string
  position: string
  cover_letter: string
  cv_url: string
  status: string
  created_at: string
}

interface JobOpening {
  id: string
  title: string
  requirements: string[]
  location: string
  type: string
}

export default function AdminApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null)
  const { toast } = useToast()

  const [newJob, setNewJob] = useState({
    title: "",
    requirements: [""],
    location: "Lagos",
    type: "Full Time",
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const supabase = getSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.push("/admin/login")
      return
    }

    const { data: userData, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

    if (error || !userData?.is_admin) {
      await supabase.auth.signOut()
      router.push("/admin/login")
      return
    }

    fetchData(session.access_token)
  }

  const fetchData = async (token: string) => {
    try {
      const [appsRes, jobsRes] = await Promise.all([
        fetch("/api/applications", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/job-openings"),
      ])

      if (appsRes.ok) {
        const appsData = await appsRes.json()
        setApplications(appsData.applications || [])
      }

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json()
        setJobOpenings(jobsData.jobOpenings || [])
      }
    } catch (error) {
      console.error("[v0] Fetch data error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const supabase = getSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)))

      toast({
        title: "Success",
        description: "Application status updated",
      })
    } catch (error) {
      console.error("[v0] Update status error:", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const handleEditJob = (job: JobOpening) => {
    setEditingJob(job)
    setNewJob({
      title: job.title,
      requirements: job.requirements,
      location: job.location,
      type: job.type,
    })
    setIsJobDialogOpen(true)
  }

  const handleCreateJob = async () => {
    try {
      const supabase = getSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const url = editingJob ? `/api/job-openings/${editingJob.id}` : "/api/job-openings"
      const method = editingJob ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(newJob),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save job opening")
      }

      const data = await response.json()

      if (editingJob) {
        setJobOpenings((prev) => prev.map((job) => (job.id === editingJob.id ? data.data : job)))
        toast({
          title: "Success",
          description: "Job opening updated successfully",
        })
      } else {
        setJobOpenings((prev) => [data.data, ...prev])
        toast({
          title: "Success",
          description: "Job opening created successfully",
        })
      }

      setIsJobDialogOpen(false)
      setEditingJob(null)
      setNewJob({
        title: "",
        requirements: [""],
        location: "Lagos",
        type: "Full Time",
      })
    } catch (error) {
      console.error("[v0] Save job error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save job opening",
        variant: "destructive",
      })
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job opening? This action cannot be undone.")) {
      return
    }

    try {
      const supabase = getSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const response = await fetch(`/api/job-openings/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete job opening")

      setJobOpenings((prev) => prev.filter((job) => job.id !== jobId))

      toast({
        title: "Success",
        description: "Job opening deleted successfully",
      })
    } catch (error) {
      console.error("[v0] Delete job error:", error)
      toast({
        title: "Error",
        description: "Failed to delete job opening",
        variant: "destructive",
      })
    }
  }

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application)
    setIsDialogOpen(true)
  }

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      return
    }

    try {
      const supabase = getSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete application")

      setApplications((prev) => prev.filter((app) => app.id !== applicationId))

      toast({
        title: "Success",
        description: "Application deleted successfully",
      })

      if (selectedApplication?.id === applicationId) {
        setIsDialogOpen(false)
        setSelectedApplication(null)
      }
    } catch (error) {
      console.error("[v0] Delete application error:", error)
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
      case "reviewed":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400"
      case "accepted":
        return "bg-green-500/20 text-green-700 dark:text-green-400"
      case "rejected":
        return "bg-red-500/20 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Button variant="ghost" size="sm" className="mb-6" onClick={() => router.push("/admin")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Job Applications</h1>
                <p className="text-muted-foreground">Review and manage job applications from candidates</p>
              </div>
              <Button
                onClick={() => {
                  setEditingJob(null)
                  setNewJob({
                    title: "",
                    requirements: [""],
                    location: "Lagos",
                    type: "Full Time",
                  })
                  setIsJobDialogOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Job Opening
              </Button>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Active Job Openings ({jobOpenings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {jobOpenings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No active job openings</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobOpenings.map((job) => (
                      <div key={job.id} className="p-4 border border-border rounded-lg relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditJob(job)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 pr-16">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.location} • {job.type}
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {job.requirements.length} requirement{job.requirements.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {applications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">No applications yet</p>
                  <p className="text-sm text-muted-foreground">Applications will appear here once candidates apply</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{application.full_name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <Briefcase className="w-4 h-4" />
                            {application.position}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={application.status}
                            onValueChange={(value) => handleStatusChange(application.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {application.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {application.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(application.created_at), "MMM dd, yyyy")}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleViewApplication(application)} size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={application.cv_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download CV
                          </a>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteApplication(application.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedApplication.full_name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Position</p>
                    <p className="text-foreground">{selectedApplication.position}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                    <Badge className={getStatusColor(selectedApplication.status)}>{selectedApplication.status}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                    <p className="text-foreground">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                    <p className="text-foreground">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Applied On</p>
                    <p className="text-foreground">
                      {format(new Date(selectedApplication.created_at), "MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Cover Letter</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" asChild>
                    <a href={selectedApplication.cv_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Download CV
                    </a>
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteApplication(selectedApplication.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Application
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isJobDialogOpen}
        onOpenChange={(open) => {
          setIsJobDialogOpen(open)
          if (!open) {
            setEditingJob(null)
            setNewJob({
              title: "",
              requirements: [""],
              location: "Lagos",
              type: "Full Time",
            })
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingJob ? "Edit Job Opening" : "Add New Job Opening"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="jobTitle">Position Title *</Label>
              <Input
                id="jobTitle"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                placeholder="e.g., Video Editor, Content Creator, Sales Closer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This is the job position that will appear to applicants
              </p>
            </div>

            <div>
              <Label>Requirements *</Label>
              {newJob.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={req}
                    onChange={(e) => {
                      const updated = [...newJob.requirements]
                      updated[index] = e.target.value
                      setNewJob({ ...newJob, requirements: updated })
                    }}
                    placeholder={`Requirement ${index + 1}`}
                  />
                  {newJob.requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const updated = newJob.requirements.filter((_, i) => i !== index)
                        setNewJob({ ...newJob, requirements: updated })
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent"
                onClick={() => setNewJob({ ...newJob, requirements: [...newJob.requirements, ""] })}
              >
                Add Requirement
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="type">Job Type *</Label>
                <Select value={newJob.type} onValueChange={(value) => setNewJob({ ...newJob, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part Time">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleCreateJob}
              className="w-full"
              disabled={!newJob.title || newJob.requirements.some((r) => !r)}
            >
              {editingJob ? "Update Job Opening" : "Create Job Opening"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
