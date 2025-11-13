import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client with anonymous key (for client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a Supabase client with service role key (for server-side)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Types based on your database schema
export type Article = {
  id: string
  name: string
  description?: string
  category_id?: string
  price: number
  mrp?: number
  created_at?: string
  updated_at?: string
}

export type Vendor = {
  id: string
  name: string
  contact_email?: string
  contact_phone?: string
  address?: string
  created_at?: string
  updated_at?: string
}

export type PurchaseOrder = {
  id: string
  vendor_id: string
  total_amount: number
  status: "Created" | "Approved" | "Dispatched" | "Delivered"
  created_at?: string
  updated_at?: string
}

export type GoodsReceiptNote = {
  id: string
  po_id: string
  received_date?: string
  status: "Received" | "Rejected"
  created_at?: string
  updated_at?: string
}

export type InternalOrder = {
  id: string
  customer_name: string
  total_amount: number
  status: "Received" | "Processed" | "Dispatched" | "Delivered"
  created_at?: string
  updated_at?: string
}

export type ReturnOrder = {
  id: string
  order_id: string
  reason?: string
  status: "Received" | "Processed"
  created_at?: string
  updated_at?: string
}

export type UserRole = "admin" | "vendor" | "customer" | "delivery"
