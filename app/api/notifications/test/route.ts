import { createServerSupabaseClient } from "@/lib/auth"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  console.log("GET /api/notifications/test - Starting request")

  try {
    const supabase = createServerSupabaseClient()
    console.log("GET /api/notifications/test - Created Supabase client")

    // Get a list of users to send test notifications to
    console.log("GET /api/notifications/test - Fetching users")
    const { data: users, error: usersError } = await supabase.from("auth.users").select("id").limit(5)

    if (usersError) {
      console.error("GET /api/notifications/test - Error fetching users:", usersError)
      return NextResponse.json(
        {
          error: "Error fetching users: " + usersError.message,
          details: usersError,
        },
        { status: 500 },
      )
    }

    // Safely handle the case where users might be undefined or not an array
    const safeUsers = Array.isArray(users) ? users : []
    console.log(`GET /api/notifications/test - Found ${safeUsers.length} users`)

    // If no users found, create a test notification without a user_id
    if (safeUsers.length === 0) {
      console.log("GET /api/notifications/test - No users found, creating notification without user_id")

      const { data: notification, error: notificationError } = await supabase
        .from("notifications")
        .insert({
          title: "Test Notification",
          message: "This is a test notification without a user ID",
          type: "info",
          is_read: false,
        })
        .select()

      if (notificationError) {
        console.error("GET /api/notifications/test - Error creating notification:", notificationError)
        return NextResponse.json(
          {
            error: "Error creating notification: " + notificationError.message,
            details: notificationError,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        message: "Test notification created without user_id",
        notification: notification && notification.length > 0 ? notification[0] : null,
      })
    }

    // Create a test notification for each user
    console.log("GET /api/notifications/test - Creating test notifications for users")
    const results = []

    for (const user of safeUsers) {
      if (!user || !user.id) {
        console.log("GET /api/notifications/test - Skipping user with no ID")
        continue
      }

      console.log(`GET /api/notifications/test - Creating notification for user ${user.id}`)
      const { data: notification, error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          title: "Test Notification",
          message: `This is a test notification for user ${user.id}`,
          type: "info",
          is_read: false,
        })
        .select()

      if (notificationError) {
        console.error(
          `GET /api/notifications/test - Error creating notification for user ${user.id}:`,
          notificationError,
        )
        results.push({
          user_id: user.id,
          success: false,
          error: notificationError.message,
        })
      } else {
        console.log(`GET /api/notifications/test - Successfully created notification for user ${user.id}`)
        results.push({
          user_id: user.id,
          success: true,
          notification: notification && notification.length > 0 ? notification[0] : null,
        })
      }
    }

    return NextResponse.json({
      message: "Test notifications created",
      results,
    })
  } catch (error) {
    console.error("GET /api/notifications/test - Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Unexpected error: " + (error instanceof Error ? error.message : String(error)),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
