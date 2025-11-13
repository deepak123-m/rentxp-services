import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Get all notifications directly, bypassing the auth middleware
 * This is for debugging purposes only
 */
export async function GET(request: NextRequest) {
  console.log("GET /api/notifications-direct - Starting request")

  try {
    // Create a direct Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    console.log("GET /api/notifications-direct - Created Supabase client")

    // Parse query parameters
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const userId = url.searchParams.get("userId")

    console.log("GET /api/notifications-direct - Query params:", { limit, offset, userId })

    // Build query - explicitly select all fields to avoid any issues
    console.log("GET /api/notifications-direct - Building query")
    let query = supabase
      .from("notifications")
      .select("id, user_id, title, message, type, reference_id, reference_type, is_read, created_at, updated_at", {
        count: "exact",
      })

    // Add user filter if provided
    if (userId) {
      query = query.eq("user_id", userId)
    }

    query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

    console.log("GET /api/notifications-direct - Executing query")
    const { data, error, count } = await query
    console.log("GET /api/notifications-direct - Query executed")

    if (error) {
      console.error("GET /api/notifications-direct - Query error:", error)
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
    console.log(`GET /api/notifications-direct - Query successful, found ${safeData.length} notifications`)

    // Return the response with safe values
    return NextResponse.json({
      notifications: safeData,
      count: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error("GET /api/notifications-direct - Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Unexpected error: " + (error instanceof Error ? error.message : String(error)),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
