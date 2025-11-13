import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Simple endpoint to test if the notifications table exists and is working
export async function GET(request: NextRequest) {
  // Check authentication
  const authResponse = await withAuth(request)
  if (authResponse.status === 401) {
    return authResponse
  }

  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Test if the notifications table exists
    const { data, error } = await supabase.from("gc_notifications").select("count(*)", { count: "exact", head: true })

    if (error) {
      // If the table doesn't exist
      if (error.code === "42P01") {
        // undefined_table
        return NextResponse.json({
          success: false,
          error: "Notifications table does not exist yet",
          details: "Please run the database migrations first",
          sqlCode: error.code,
        })
      }

      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
      })
    }

    // Create a test notification
    const { data: notification, error: insertError } = await supabase
      .from("gc_notifications")
      .insert({
        user_id: session.user.id,
        title: "Test Notification",
        message: "This is a test notification created at " + new Date().toISOString(),
        type: "info",
        is_read: false,
        is_test: true,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: "Failed to create test notification",
        details: insertError.message,
      })
    }

    // Get all notifications for the user
    const { data: userNotifications, error: fetchError } = await supabase
      .from("gc_notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (fetchError) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch notifications",
        details: fetchError.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Notifications table exists and is working correctly",
      testNotification: notification,
      recentNotifications: userNotifications,
      notificationCount: userNotifications.length,
    })
  } catch (error) {
    console.error("Error testing notifications table:", error)
    return NextResponse.json({
      success: false,
      error: "An unexpected error occurred",
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
