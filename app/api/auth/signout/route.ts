import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { setCorsHeaders } from "@/lib/cors"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out:", error)
      const response = NextResponse.json({ error: error.message }, { status: 500 })
      return setCorsHeaders(request, response)
    }

    // Return success response
    const response = NextResponse.json({ message: "Signed out successfully" })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Sign out error:", error)
    const response = NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
    return setCorsHeaders(request, response)
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  })
}
