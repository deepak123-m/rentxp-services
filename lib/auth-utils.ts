import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function getAuthUser(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    const authHeader = req.headers.get("authorization")
    if (!authHeader) return null

    const token = authHeader.replace("Bearer ", "")
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      console.error("Error getting auth user:", error)
      return null
    }

    return data.user
  } catch (error) {
    console.error("Exception in getAuthUser:", error)
    return null
  }
}

export async function checkUserRole(req: NextRequest, allowedRoles: string[] = []) {
  try {
    const user = await getAuthUser(req)
    if (!user) return { isAuthorized: false, user: null }

    // If no roles are required, just being authenticated is enough
    if (!allowedRoles || allowedRoles.length === 0) {
      return { isAuthorized: true, user }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    const { data, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (error || !data) {
      console.error("Error fetching user role:", error)
      return { isAuthorized: false, user: user }
    }

    // If no role is found, default to 'user'
    const userRole = (data.role || "user").toLowerCase()

    // Convert all roles to lowercase for case-insensitive comparison
    const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase())

    // Add both singular and plural forms of roles
    const expandedAllowedRoles = [...normalizedAllowedRoles]
    normalizedAllowedRoles.forEach((role) => {
      if (role.endsWith("s")) {
        expandedAllowedRoles.push(role.slice(0, -1)) // Add singular form
      } else {
        expandedAllowedRoles.push(role + "s") // Add plural form
      }
    })

    return {
      isAuthorized: expandedAllowedRoles.includes(userRole),
      user: user,
      role: userRole,
    }
  } catch (error) {
    console.error("Exception in checkUserRole:", error)
    return { isAuthorized: false, user: null, error }
  }
}

export async function getUserFromRequest(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    const authHeader = req.headers.get("authorization")
    if (!authHeader) return null

    const token = authHeader.replace("Bearer ", "")
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      console.error("Error getting user from request:", error)
      return null
    }

    return data.user
  } catch (error) {
    console.error("Exception in getUserFromRequest:", error)
    return null
  }
}

export async function getUserRole(supabase: any, email: string) {
  try {
    const { data, error } = await supabase.from("profiles").select("role").eq("email", email).single()

    if (error) {
      console.error("Error fetching user role:", error)
      return null
    }

    return data?.role || null
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

export async function validateToken(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return { user: null, error: "Authorization header missing" }
    }

    const token = authHeader.replace("Bearer ", "")
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      console.error("Error validating token:", error)
      return { user: null, error: error?.message || "Invalid token" }
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error("Exception in validateToken:", error)
    return { user: null, error: error instanceof Error ? error.message : String(error) }
  }
}
