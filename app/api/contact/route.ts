import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "snowzytech@gmail.com",
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; word-wrap: break-word;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">This email was sent from your NutritiCare website contact form.</p>
        </div>
      `,
    })

    if (response.error) {
      return NextResponse.json({ error: response.error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("[v0] Email send error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
