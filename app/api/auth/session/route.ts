import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { setCorsHeaders, handleCors } from "@/lib/cors"

export async function GET(request: NextRequest) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    // Extract the access token from the Authorization header
    const accessToken = request.headers.get("authorization")?.split(" ")[1]

    if (!accessToken) {
      const response = NextResponse.json({ authenticated: false, message: "No access token provided" }, { status: 401 })
      return setCorsHeaders(request, response)
    }

    // Create a Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get user from token
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken)

    if (error || !user) {
      const response = NextResponse.json(
        {
          authenticated: false,
          message: "Invalid or expired token",
        },
        { status: 401 },
      )
      return setCorsHeaders(request, response)
    }

    // Return session information
    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
    })

    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error checking session:", error)
    const response = NextResponse.json(
      {
        authenticated: false,
        message: "An unexpected error occurred",
      },
      { status: 500 },
    )
    return setCorsHeaders(request, response)
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request)
}
