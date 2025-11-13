import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if the notifications table exists
    const { data: notificationsTable, error: notificationsError } = await supabase.rpc("check_table_exists", {
      table_name: "notifications",
    })

    const { data: gcNotificationsTable, error: gcNotificationsError } = await supabase.rpc("check_table_exists", {
      table_name: "gc_notifications",
    })

    // Try to get the column information for the notifications table
    let notificationsColumns = null
    let gcNotificationsColumns = null

    try {
      const { data: columns } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type")
        .eq("table_name", "notifications")
      notificationsColumns = columns
    } catch (e) {
      console.error("Error fetching notifications columns:", e)
    }

    try {
      const { data: columns } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type")
        .eq("table_name", "gc_notifications")
      gcNotificationsColumns = columns
    } catch (e) {
      console.error("Error fetching gc_notifications columns:", e)
    }

    // Try a simple query to the notifications table
    let notificationsQueryResult = null
    let gcNotificationsQueryResult = null

    try {
      const { data, error } = await supabase.from("notifications").select("*").limit(1)

      notificationsQueryResult = {
        success: !error,
        error: error ? error.message : null,
        data: data,
      }
    } catch (e) {
      notificationsQueryResult = {
        success: false,
        error: e instanceof Error ? e.message : String(e),
      }
    }

    try {
      const { data, error } = await supabase.from("gc_notifications").select("*").limit(1)

      gcNotificationsQueryResult = {
        success: !error,
        error: error ? error.message : null,
        data: data,
      }
    } catch (e) {
      gcNotificationsQueryResult = {
        success: false,
        error: e instanceof Error ? e.message : String(e),
      }
    }

    return NextResponse.json({
      tables: {
        notifications: {
          exists: notificationsTable,
          error: notificationsError ? notificationsError.message : null,
          columns: notificationsColumns,
          queryResult: notificationsQueryResult,
        },
        gc_notifications: {
          exists: gcNotificationsTable,
          error: gcNotificationsError ? gcNotificationsError.message : null,
          columns: gcNotificationsColumns,
          queryResult: gcNotificationsQueryResult,
        },
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not set",
      },
    })
  } catch (error) {
    console.error("Error in diagnostic endpoint:", error)
    return NextResponse.json(
      {
        error: "An error occurred while running diagnostics",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
