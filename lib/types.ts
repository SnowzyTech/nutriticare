export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price?: number
  category: string
  image_url: string
  images: string[]
  stock: number
  rating: number
  review_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  title?: string
  comment: string
  verified_purchase: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author_id: string
  author?: {
    id: string
    full_name?: string
    email: string
  }
  category: string
  featured_image: string
  published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export interface BlogComment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  payment_method: string
  shipping_address: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
  }
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  is_admin: boolean
  created_at: string
  updated_at: string
}
