import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { setCorsHeaders, handleCors } from "@/lib/cors"

export async function POST(request: NextRequest) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    // Extract the refresh token from the Authorization header
    const refreshToken = request.headers.get("authorization")?.split(" ")[1]

    // If no token in header, try to get it from the request body
    let token = refreshToken
    if (!token) {
      const body = await request.json().catch(() => ({}))
      token = body.refresh_token
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No refresh token provided" }, { status: 401 })
    }

    // Create a Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Refresh the session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: token,
    })

    // Update the error handling to be more informative
    if (error || !data.session) {
      console.error("Token refresh error:", error?.message || "No session returned")
      const errorMessage = error?.message || "Failed to refresh session"
      const response = NextResponse.json(
        {
          error: "Unauthorized",
          message: errorMessage,
        },
        { status: 401 },
      )
      return setCorsHeaders(request, response)
    }

    // Enhance the successful response with more information
    const response = NextResponse.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: Math.floor(new Date(data.session.expires_at || 0).getTime() / 1000),
      user: {
        id: data.session.user.id,
        email: data.session.user.email,
        user_metadata: data.session.user.user_metadata,
      },
    })

    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error refreshing session:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request)
}
