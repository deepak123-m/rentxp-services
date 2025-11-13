import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!session) {
      return NextResponse.json({ error: "Not authenticated", message: "Please log in to get a token" }, { status: 401 })
    }

    // Get user role
    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", session.user.email)
      .single()

    return NextResponse.json({
      token: session.access_token,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: profileData?.role || "user",
      },
      message: "Use this token in the Authorization header as 'Bearer token'",
      expires_at: new Date(session.expires_at! * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Error getting token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
