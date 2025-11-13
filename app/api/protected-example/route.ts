import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"
import { getAuthUser } from "@/lib/auth-utils"
import { setCorsHeaders, handleCors } from "@/lib/cors"

export async function GET(request: NextRequest) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  // Check authentication
  const authResponse = await withAuth(request)
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    // Get the authenticated user
    const user = await getAuthUser(request)

    // Return protected data
    const response = NextResponse.json({
      message: "This is protected data",
      user: {
        id: user?.id,
        email: user?.email,
        role: user?.user_metadata?.role,
      },
    })

    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error in protected route:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}
