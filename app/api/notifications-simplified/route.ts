import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Get all notifications with a simplified approach
 */
export async function GET(request: NextRequest) {
  console.log("GET /api/notifications-simplified - Starting request")

  try {
    // Create a direct Supabase client using the same approach as your successful POST request
    const cookieStore = cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Get the session token from cookies
    const accessToken = cookieStore.get("sb-access-token")?.value
    const refreshToken = cookieStore.get("sb-refresh-token")?.value

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: "No authentication tokens found" }, { status: 401 })
    }

    // Create client with existing session
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    })

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      console.error("GET /api/notifications-simplified - User error:", userError)
      return NextResponse.json({ error: "Authentication error" }, { status: 401 })
    }

    const userId = userData.user.id
    console.log("GET /api/notifications-simplified - User ID:", userId)

    // Parse query parameters
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    // Simple query with minimal options
    console.log("GET /api/notifications-simplified - Executing query")
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("GET /api/notifications-simplified - Query error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Ensure data is an array
    const notifications = Array.isArray(data) ? data : []
    console.log(`GET /api/notifications-simplified - Found ${notifications.length} notifications`)

    // Get unread count with a simple query
    const { count: unreadCount, error: countError } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (countError) {
      console.error("GET /api/notifications-simplified - Count error:", countError)
    }

    return NextResponse.json({
      notifications,
      count: notifications.length,
      unreadCount: unreadCount || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error("GET /api/notifications-simplified - Unexpected error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
