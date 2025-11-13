import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Get all notifications for the current user
 */
export async function GET(request: NextRequest) {
  console.log("GET /api/notifications - Starting request")

  try {
    // Check authentication
    const authResponse = await withAuth(request)
    if (authResponse.status === 401) {
      console.log("GET /api/notifications - Authentication failed")
      return authResponse
    }

    const supabase = createServerSupabaseClient()
    console.log("GET /api/notifications - Created Supabase client")

    // Get current user
    const sessionResponse = await supabase.auth.getSession()
    console.log("GET /api/notifications - Session response received")

    const session = sessionResponse?.data?.session

    if (!session) {
      console.log("GET /api/notifications - No session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user?.id
    if (!userId) {
      console.log("GET /api/notifications - No user ID in session")
      return NextResponse.json({ error: "User ID not found in session" }, { status: 401 })
    }

    console.log("GET /api/notifications - User ID:", userId)

    // Parse query parameters
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const unreadOnly = url.searchParams.get("unread") === "true"

    console.log("GET /api/notifications - Query params:", { limit, offset, unreadOnly })

    // Build query - explicitly select all fields to avoid any issues
    console.log("GET /api/notifications - Building query")
    let query = supabase
      .from("notifications")
      .select("id, user_id, title, message, type, reference_id, reference_type, is_read, created_at, updated_at", {
        count: "exact",
      })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by read status if requested
    if (unreadOnly) {
      query = query.eq("is_read", false)
    }

    console.log("GET /api/notifications - Executing query")
    const { data, error, count } = await query
    console.log("GET /api/notifications - Query executed")

    if (error) {
      console.error("GET /api/notifications - Query error:", error)
      return NextResponse.json(
        {
          error: "Query error: " + error.message,
          details: error,
          code: error.code,
        },
        { status: 500 },
      )
    }

    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : []
    console.log(`GET /api/notifications - Query successful, found ${safeData.length} notifications`)

    // Get unread count - with safer handling
    console.log("GET /api/notifications - Getting unread count")
    let unreadCount = 0
    try {
      const { count: unreadResult, error: countError } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false)

      if (countError) {
        console.error("GET /api/notifications - Unread count error:", countError)
      } else {
        unreadCount = unreadResult || 0
        console.log(`GET /api/notifications - Unread count: ${unreadCount}`)
      }
    } catch (countError) {
      console.error("GET /api/notifications - Unread count exception:", countError)
      // Continue despite count error
    }

    // Return the response with safe values
    return NextResponse.json({
      notifications: safeData,
      count: count || 0,
      unreadCount: unreadCount,
      limit,
      offset,
    })
  } catch (error) {
    console.error("GET /api/notifications - Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Unexpected error: " + (error instanceof Error ? error.message : String(error)),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

/**
 * Create a new notification
 * This endpoint is typically used by the system or admins to send notifications to users
 */
export async function POST(request: NextRequest) {
  console.log("POST /api/notifications - Starting request")

  try {
    // Check authentication and role
    const authResponse = await withAuth(request, ["admin"])
    if (authResponse.status === 401 || authResponse.status === 403) {
      console.log("POST /api/notifications - Authentication or authorization failed")
      return authResponse
    }

    const supabase = createServerSupabaseClient()
    console.log("POST /api/notifications - Created Supabase client")

    // Parse request body
    const body = await request.json()
    console.log("POST /api/notifications - Request body received")

    const { user_id, title, message, type = "info", reference_id, reference_type } = body

    // Validate input
    if (!user_id || !title || !message) {
      console.log("POST /api/notifications - Validation failed")
      return NextResponse.json({ error: "User ID, title, and message are required" }, { status: 400 })
    }

    // Create notification
    console.log("POST /api/notifications - Creating notification")
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id,
        title,
        message,
        type,
        reference_id,
        reference_type,
        is_read: false,
      })
      .select()

    if (error) {
      console.error("POST /api/notifications - Insert error:", error)
      return NextResponse.json(
        {
          error: "Insert error: " + error.message,
          details: error,
          code: error.code,
        },
        { status: 500 },
      )
    }

    // Ensure data is an array and has at least one item
    const safeData = Array.isArray(data) ? data : []
    if (safeData.length === 0) {
      console.error("POST /api/notifications - No notification returned after insert")
      return NextResponse.json(
        {
          error: "No notification returned after insert",
        },
        { status: 500 },
      )
    }

    console.log("POST /api/notifications - Notification created successfully")
    return NextResponse.json({
      message: "Notification created successfully",
      notification: safeData[0],
    })
  } catch (error) {
    console.error("POST /api/notifications - Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Unexpected error: " + (error instanceof Error ? error.message : String(error)),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
