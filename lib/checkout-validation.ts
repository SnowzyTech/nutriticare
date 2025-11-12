import { z } from "zod"

// Validate checkout data
export const checkoutSchema = z.object({
  email: z.string().email("Invalid email"),
  amount: z.number().positive("Amount must be positive"),
  reference: z.string().min(1, "Reference is required"),
  customerDetails: z.object({
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    phone: z.string().min(5, "Phone number is required").max(20),
    address: z.string().min(5, "Address is required").max(255),
    city: z.string().min(2, "City is required").max(100),
    state: z.string().min(2, "State is required").max(100),
    email: z.string().email("Invalid email"),
  }),
  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        quantity: z.number().positive(),
        price: z.number().positive(),
      }),
    )
    .min(1, "At least one item is required"),
})
