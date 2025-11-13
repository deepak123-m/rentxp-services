import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Subscribe to push notifications
 * This endpoint stores the user's push notification subscription details
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const { subscription, device_type, device_token } = body

    // Validate input
    if (!subscription && !device_token) {
      return NextResponse.json(
        {
          error: "Either a web push subscription object or device token is required",
        },
        { status: 400 },
      )
    }

    // Check if push_subscriptions table exists
    const { error: tableCheckError } = await supabase
      .from("push_subscriptions")
      .select("*", { count: "exact", head: true })
      .limit(1)

    if (tableCheckError && tableCheckError.code === "42P01") {
      // Table doesn't exist, create it
      console.log("Push subscriptions table doesn't exist, creating it...")

      // Return helpful error message
      return NextResponse.json(
        {
          error: "Push subscriptions table does not exist yet. Please run the database migrations first.",
          sqlCode: tableCheckError.code,
          hint: "Create a 'push_subscriptions' table in your Supabase database with the following schema: user_id, subscription, device_type, device_token, is_active, created_at, updated_at",
        },
        { status: 500 },
      )
    }

    // Store the subscription in the database
    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          user_id: session.user.id,
          subscription: subscription ? JSON.stringify(subscription) : null,
          device_type: device_type || "web",
          device_token: device_token || null,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id, device_type",
          ignoreDuplicates: false,
        },
      )
      .select()
      .single()

    if (error) {
      console.error("Error storing push subscription:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send a test notification to confirm subscription
    const { error: notificationError } = await supabase.from("notifications").insert({
      user_id: session.user.id,
      title: "Notifications Enabled",
      message: "You have successfully subscribed to notifications!",
      type: "success",
      is_read: false,
    })

    if (notificationError) {
      console.error("Error creating welcome notification:", notificationError)
    }

    return NextResponse.json({
      message: "Successfully subscribed to notifications",
      subscription: data,
    })
  } catch (error) {
    console.error("Error subscribing to notifications:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
