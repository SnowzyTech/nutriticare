import DOMPurify from "isomorphic-dompurify"
import { z } from "zod"

// Sanitize user input to prevent XSS attacks
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return ""
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
}

// Validate contact form data
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
})

// Validate testimonial data
export const testimonialSchema = z.object({
  product_id: z.string().uuid("Invalid product ID"),
  customer_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  customer_text: z
    .string()
    .min(10, "Testimonial must be at least 10 characters")
    .max(1000, "Testimonial must be less than 1000 characters"),
  rating: z.number().min(1).max(5).optional(),
})

// Validate blog comment
export const commentSchema = z.object({
  content: z
    .string()
    .min(5, "Comment must be at least 5 characters")
    .max(1000, "Comment must be less than 1000 characters"),
})

// Validate file upload
export const fileUploadSchema = z.object({
  file: z.object({
    size: z.number().max(5 * 1024 * 1024, "File must be less than 5MB"),
    type: z.enum(["image/jpeg", "image/png", "image/webp"], {
      errorMap: () => ({ message: "Only JPEG, PNG, and WebP images are allowed" }),
    }),
  }),
})
