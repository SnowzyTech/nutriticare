"use server"

import { getSupabaseServer, getSupabaseAdmin } from "./supabase-server"
import { requireAdminAuth } from "./auth"

// BLOG ACTIONS
export async function createBlogPost(formData: {
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  featured_image: string
  published: boolean
}) {
  await requireAdminAuth()

  const supabase = await getSupabaseAdmin()

  if (!formData.title || !formData.slug || !formData.category) {
    throw new Error("Missing required fields: title, slug, category")
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert([
      {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image: formData.featured_image,
        published: formData.published,
        published_at: formData.published ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    throw new Error(`Failed to create blog post: ${error.message}`)
  }

  return data[0]
}

export async function updateBlogPost(
  slug: string,
  formData: {
    title: string
    slug: string
    category: string
    excerpt: string
    content: string
    featured_image: string
    published: boolean
  },
) {
  await requireAdminAuth()

  const supabase = await getSupabaseAdmin()

  if (!formData.title || !formData.slug || !formData.category) {
    throw new Error("Missing required fields: title, slug, category")
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      excerpt: formData.excerpt,
      content: formData.content,
      featured_image: formData.featured_image,
      published: formData.published,
      published_at: formData.published ? new Date().toISOString() : null,
    })
    .eq("slug", slug)
    .select()

  if (error) {
    throw new Error(`Failed to update blog post: ${error.message}`)
  }

  return data[0]
}

export async function deleteBlogPost(slug: string) {
  await requireAdminAuth()

  const supabase = await getSupabaseAdmin()

  const { error } = await supabase.from("blog_posts").delete().eq("slug", slug)

  if (error) {
    throw new Error(`Failed to delete blog post: ${error.message}`)
  }

  return { success: true }
}

// PRODUCT ACTIONS
export async function createProduct(formData: {
  name: string
  slug: string
  description: string
  category: string
  price: number
  original_price?: number
  image_url: string
  stock: number
}) {
  await requireAdminAuth()

  const supabase = await getSupabaseAdmin()

  if (!formData.name || !formData.slug || !formData.category || !formData.price) {
    throw new Error("Missing required fields: name, slug, category, price")
  }

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        original_price: formData.original_price,
        image_url: formData.image_url,
        stock: formData.stock || 0,
        rating: 0,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`)
  }

  return data[0]
}

export async function updateProduct(
  productId: string,
  formData: {
    name: string
    slug: string
    description: string
    category: string
    price: number
    original_price?: number
    image_url: string
    stock: number
  },
) {
  await requireAdminAuth()

  const supabase = await getSupabaseAdmin()

  if (!formData.name || !formData.slug || !formData.category || !formData.price) {
    throw new Error("Missing required fields: name, slug, category, price")
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      original_price: formData.original_price,
      image_url: formData.image_url,
      stock: formData.stock,
    })
    .eq("id", productId)
    .select()

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`)
  }

  return data[0]
}

export async function deleteProduct(productId: string) {
  await requireAdminAuth()

  const supabase = await getSupabaseAdmin()

  const { error } = await supabase.from("products").delete().eq("id", productId)

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`)
  }

  return { success: true }
}

// TESTIMONIAL ACTIONS
export async function createTestimonial(formData: {
  product_id: string
  customer_name: string
  customer_text: string
  customer_image?: string
  rating: number
}) {
  if (!formData.product_id || !formData.customer_name || !formData.customer_text) {
    throw new Error("Missing required fields: product_id, customer_name, customer_text")
  }

  const supabase = await getSupabaseServer()

  const { data, error } = await supabase
    .from("testimonials")
    .insert([
      {
        product_id: formData.product_id,
        customer_name: formData.customer_name,
        customer_text: formData.customer_text,
        customer_image: formData.customer_image || "/woman-avatar-3.png",
        rating: formData.rating || 5,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    throw new Error(`Failed to create testimonial: ${error.message}`)
  }

  return data[0]
}

export async function updateTestimonial(
  testimonialId: string,
  formData: {
    customer_name: string
    customer_text: string
    customer_image: string
    product_id: string
    rating: number
  },
) {
  await requireAdminAuth()

  const supabase = await getSupabaseAdmin()

  const { data, error } = await supabase
    .from("testimonials")
    .update({
      customer_name: formData.customer_name,
      customer_text: formData.customer_text,
      customer_image: formData.customer_image,
      product_id: formData.product_id,
      rating: formData.rating,
    })
    .eq("id", testimonialId)
    .select()

  if (error) {
    throw new Error(`Failed to update testimonial: ${error.message}`)
  }

  return data[0]
}

export async function deleteTestimonial(testimonialId: string) {
  await requireAdminAuth()

  const supabase = await getSupabaseAdmin()

  const { error } = await supabase.from("testimonials").delete().eq("id", testimonialId)

  if (error) {
    throw new Error(`Failed to delete testimonial: ${error.message}`)
  }

  return { success: true }
}
