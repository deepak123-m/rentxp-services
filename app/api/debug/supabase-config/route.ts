import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    // Check if Supabase environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    return NextResponse.json({
      success: true,
      config: {
        supabaseUrl: supabaseUrl ? "Set" : "Not set",
        supabaseAnonKey: supabaseAnonKey ? "Set" : "Not set",
        supabaseServiceKey: supabaseServiceKey ? "Set" : "Not set",
        // Don't return the actual keys for security reasons
        supabaseUrlLength: supabaseUrl?.length || 0,
        supabaseAnonKeyLength: supabaseAnonKey?.length || 0,
        supabaseServiceKeyLength: supabaseServiceKey?.length || 0,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
