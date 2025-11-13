import { createServerSupabaseClient } from "@/lib/auth"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    console.log("GET /api/debug/notifications-raw - Starting request")

    const supabase = createServerSupabaseClient()
    console.log("GET /api/debug/notifications-raw - Created Supabase client")

    // Simple query with no filters
    const { data, error } = await supabase.from("notifications").select("*").limit(10)

    if (error) {
      console.error("GET /api/debug/notifications-raw - Query error:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    console.log(`GET /api/debug/notifications-raw - Query successful, found ${data?.length || 0} notifications`)

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      data: data || [],
    })
  } catch (error) {
    console.error("GET /api/debug/notifications-raw - Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
