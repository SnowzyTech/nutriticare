"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Loader } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const contentRef = useScrollAnimation()
  const { toast } = useToast()

  useEffect(() => {}, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      setSubmitted(true)
      toast({
        title: "Success",
        description: "Your message has been sent successfully!",
      })

      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" })
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error("[v0] Contact form error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" ref={contentRef.ref}>
        <div className={`${contentRef.isVisible ? "animate-slide-in-up" : "opacity-0"}`}>
          <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground mb-12">
            We'd love to hear from you. Please fill out the form below or use our contact details to get in touch.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-foreground font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-foreground font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter the subject of your message"
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message"
                    rows={6}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || submitted}
                  className="bg-primary hover:bg-primary/90 py-3 w-full gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : submitted ? (
                    "Message Sent!"
                  ) : (
                    "Submit Message"
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-card rounded-lg p-4 sm:p-8 border border-border space-y-8">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Contact Information</h2>

                <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">Our Address</h3>
                    <p className="text-muted-foreground text-sm sm:text-base break-words">
                      123 Wellness Way, Healthville, CA 90210
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-muted-foreground text-sm sm:text-base break-words">+1 (234) 567-890</p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground text-sm sm:text-base break-words">
                      Mynutriticaresuppport@gmail.com
                    </p>
                  </div>
                </div>

              
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
