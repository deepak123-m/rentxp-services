import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Mark a notification as read
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication
  const authResponse = await withAuth(request)
  if (authResponse.status === 401) {
    return authResponse
  }

  try {
    const notificationId = params.id
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the notification exists and belongs to the user
    const { data: notification, error: fetchError } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", notificationId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    if (notification.user_id !== session.user.id) {
      return NextResponse.json({ error: "You can only mark your own notifications as read" }, { status: 403 })
    }

    // Mark the notification as read
    const { error: updateError } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)

    if (updateError) {
      console.error("Error marking notification as read:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Notification marked as read",
      notificationId,
    })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
