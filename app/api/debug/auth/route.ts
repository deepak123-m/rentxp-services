import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get session data
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      return NextResponse.json({
        status: "error",
        message: "Error fetching session",
        error: sessionError,
      })
    }

    if (!sessionData.session) {
      return NextResponse.json({
        status: "unauthenticated",
        message: "No active session found",
      })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", sessionData.session.user.email)
      .single()

    return NextResponse.json({
      status: "authenticated",
      session: {
        user: {
          id: sessionData.session.user.id,
          email: sessionData.session.user.email,
        },
        expires_at: sessionData.session.expires_at,
      },
      profile: profileError ? null : profile,
      profileError: profileError ? profileError.message : null,
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Internal server error",
      error: String(error),
    })
  }
}
