import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

const allowedOrigins = [
  "https://v0-grocery-testingapp.vercel.app",
  "https://v0-frontend-ecomercetesting-app-atstqv.vercel.app",
  "https://v0-frontend-ecomercetesting-app.vercel.app",
  "https://v0-frontend-ecomercetesting-app-vpil0a.vercel.app",
]

export async function POST(request: NextRequest) {
  try {
    console.log("Vendor signin request received")

    const headers = Object.fromEntries(request.headers.entries())
    console.log("Request headers:", JSON.stringify(headers, null, 2))

    const body = await request.json().catch((err) => {
      console.error("Error parsing request body:", err)
      return null
    })

    console.log("Request body received:", JSON.stringify(body, null, 2))

    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { email, password, device_token, device_type = "unknown" } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if(data){
      console.log('sucessss',data)
    }

    if (error) {
      console.error("Supabase auth error:", error)
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    const userId = data.user.id

    // 🔁 Upsert device_token
    if (device_token) {
      const { error: upsertError } = await supabaseAdmin.from("device_tokens").upsert(
        {
          user_id: userId,
          device_token,
          device_type,
        },
        { onConflict: "user_id" },
      )

      if (upsertError) {
        console.error("Error upserting device token:", upsertError)
      }
    }

    // 📄 Get vendor profile
    const { data: vendor, error: vendorError } = await supabase.from("vendors").select("*").eq("email", data.user.email).single()

    if (vendorError) {
      console.error("Vendor fetch error:", vendorError)
    }

    console.log("Login successful for vendor:", data)

    const response = NextResponse.json({
      message: "Signed in successfully",
      user: data.user,
      vendor,
      session: data.session,
    })

    const origin = request.headers.get("origin") || ""
    if (allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
      response.headers.set("Access-Control-Allow-Credentials", "true")
    }

    return response
  } catch (error) {
    console.error("Vendor signin error:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// ✅ Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || ""

  if (allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  return new NextResponse(null, { status: 204 })
}
