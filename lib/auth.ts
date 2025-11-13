import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import type { UserRole } from "./supabase"
import { checkUserRole } from "./auth-utils"

// Create a Supabase client for server components
export function createServerSupabaseClient() {
  try {
    const cookieStore = cookies()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing Supabase environment variables")
    }

    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}

// Middleware to check if user is authenticated
export async function withAuth(request: NextRequest, requiredRoles?: UserRole[]) {
  try {
    const { isAuthorized, user } = await checkUserRole(request, requiredRoles || [])

    if (!isAuthorized) {
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      } else {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    // User is authenticated and has required role
    return NextResponse.next()
  } catch (error) {
    console.error("Error in withAuth:", error)
    return NextResponse.json(
      {
        error: "Authentication error: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}
