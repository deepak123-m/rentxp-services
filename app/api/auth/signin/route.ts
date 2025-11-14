import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { createCipheriv, randomBytes, scryptSync } from "crypto"

const allowedOrigins = [
  "https://v0-grocery-testingapp.vercel.app",
  "https://v0-frontend-ecomercetesting-app-atstqv.vercel.app",
  "https://v0-frontend-ecomercetesting-app.vercel.app",
  "https://v0-frontend-ecomercetesting-app-vpil0a.vercel.app",
  "http://localhost:3000",
]

const encryptPassword = (password: string) => {
  const key = scryptSync("ismartest", "salt", 32)
  const iv = randomBytes(16)
  const cipher = createCipheriv("aes-256-cbc", key, iv)

  let encrypted = cipher.update(password, "utf8", "hex")
  encrypted += cipher.final("hex")

  return iv.toString("hex") + ":" + encrypted
}

export async function POST(request: NextRequest) {
  try {
    console.log("Signin request received")

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

    // 🔐 Encrypt & update password/email in 'profiles' if null
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from("profiles")
      .select("hash_password, email")
      .eq("id", userId)
      .single()

    if (profileCheckError) {
      console.error("Error checking profiles table:", profileCheckError)
    } else {
      const updates: Record<string, any> = {}

      if (!existingProfile.hash_password) {
        updates.hash_password = encryptPassword(password)
      }

      if (!existingProfile.email) {
        updates.email = data.user.email
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase.from("profiles").update(updates).eq("id", userId)

        if (updateError) {
          console.error("Error updating profiles table:", updateError)
        } else {
          console.log("Profiles table updated with encrypted password and/or email")
        }
      }
    }

    // 📄 Get user profile from gc_profiles (optional)
    const { data: profile, error: profileError } = await supabase
      .from("gc_profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (profileError) {
      console.error("Profile fetch error:", profileError)
    }

    console.log("Login successful for user:", data)

    const response = NextResponse.json({
      message: "Signed in successfully",
      user: data.user,
      profile,
      session: data.session,
    })

    // ✅ CORS handling
    const origin = request.headers.get("origin") || ""
    if (allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
      response.headers.set("Access-Control-Allow-Credentials", "true")
    }

    return response
  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

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
