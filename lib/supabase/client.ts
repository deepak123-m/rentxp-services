import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// These environment variables need to be set via the Supabase integration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  // Create a single supabase client for interacting with your database
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
