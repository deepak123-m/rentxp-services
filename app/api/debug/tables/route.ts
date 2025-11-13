import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Query to get all tables in the public schema
    const { data: tables, error: tablesError } = await supabase.rpc("get_tables")

    if (tablesError) {
      // If the RPC function doesn't exist, try a direct query
      const { data: fallbackTables, error: fallbackError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")

      if (fallbackError) {
        return NextResponse.json(
          {
            error: "Failed to get tables",
            details: {
              rpcError: tablesError,
              fallbackError: fallbackError,
            },
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        tables: fallbackTables.map((t) => t.table_name),
        method: "fallback",
      })
    }

    return NextResponse.json({
      tables,
      method: "rpc",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
