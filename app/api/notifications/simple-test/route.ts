import { createServerSupabaseClient } from "@/lib/auth"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  console.log("GET /api/notifications/simple-test - Starting request")

  try {
    const supabase = createServerSupabaseClient()
    console.log("GET /api/notifications/simple-test - Created Supabase client")

    // Create a test notification without a user_id
    console.log("GET /api/notifications/simple-test - Creating test notification")
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        title: "Simple Test Notification",
        message: "This is a simple test notification",
        type: "info",
        is_read: false,
      })
      .select()

    if (error) {
      console.error("GET /api/notifications/simple-test - Error creating notification:", error)
      return NextResponse.json(
        {
          error: "Error creating notification: " + error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: "Test notification created successfully",
      notification: data && data.length > 0 ? data[0] : null,
    })
  } catch (error) {
    console.error("GET /api/notifications/simple-test - Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Unexpected error: " + (error instanceof Error ? error.message : String(error)),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
