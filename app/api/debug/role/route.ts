import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Get user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      return NextResponse.json({
        authenticated: false,
        error: sessionError?.message || "No session found",
      })
    }

    const user = sessionData.session.user

    // Get user profile to check role
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user.email)
      .single()

    if (profileError) {
      return NextResponse.json({
        authenticated: true,
        user: user,
        profile: null,
        error: "Error fetching profile: " + profileError.message,
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: user,
      profile: profileData,
      message: "This endpoint helps debug role issues",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
