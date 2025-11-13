import { createServerSupabaseClient } from "@/lib/auth"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    console.log("GET /api/debug/simple-notifications-test - Starting request")

    const supabase = createServerSupabaseClient()
    console.log("GET /api/debug/simple-notifications-test - Created Supabase client")

    // Just check if the table exists and is accessible
    console.log("GET /api/debug/simple-notifications-test - Testing table access")
    const { data, error, count } = await supabase.from("notifications").select("*", { count: "exact" }).limit(1)

    if (error) {
      console.error("GET /api/debug/simple-notifications-test - Query error:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
          errorCode: error.code,
          hint: error.hint || "No hint provided",
        },
        { status: 500 },
      )
    }

    // Test inserting a record
    console.log("GET /api/debug/simple-notifications-test - Testing insert")
    const { data: insertData, error: insertError } = await supabase
      .from("notifications")
      .insert({
        user_id: null, // Using null since we don't have a user ID in this test
        title: "Test Notification",
        message: "This is a test notification",
        type: "info",
        is_read: false,
      })
      .select()

    if (insertError) {
      console.error("GET /api/debug/simple-notifications-test - Insert error:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: "Insert error: " + insertError.message,
          details: insertError,
          errorCode: insertError.code,
          hint: insertError.hint || "No hint provided",
          // Still return the select results
          selectSuccess: true,
          count: count || 0,
          data: data || [],
        },
        { status: 500 },
      )
    }

    console.log(`GET /api/debug/simple-notifications-test - Tests successful`)

    return NextResponse.json({
      success: true,
      selectSuccess: true,
      count: count || 0,
      data: data || [],
      insertSuccess: true,
      insertedData: insertData || [],
    })
  } catch (error) {
    console.error("GET /api/debug/simple-notifications-test - Unexpected error:", error)
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
