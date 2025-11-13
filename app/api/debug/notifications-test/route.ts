import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Try to get the table structure
    const { data: structure, error: structureError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_schema", "public")
      .eq("table_name", "notifications")

    // Try to count records
    const { count, error: countError } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })

    // Try to get one record
    const { data: sampleRecord, error: sampleError } = await supabase.from("notifications").select("*").limit(1)

    return NextResponse.json({
      tableExists: !structureError,
      structure: structure || [],
      structureError: structureError ? structureError.message : null,
      count,
      countError: countError ? countError.message : null,
      sampleRecord: sampleRecord && sampleRecord.length > 0 ? sampleRecord[0] : null,
      sampleError: sampleError ? sampleError.message : null,
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
