import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { createDecipheriv, scryptSync } from "crypto"

const allowedOrigins = [
  "https://v0-grocery-testingapp.vercel.app",
  "https://v0-frontend-ecomercetesting-app-atstqv.vercel.app",
  "https://v0-frontend-ecomercetesting-app.vercel.app",
  "https://v0-frontend-ecomercetesting-app-vpil0a.vercel.app",
]

const decryptPassword = (encryptedText: string) => {
  const [ivHex, encrypted] = encryptedText.split(":")
  const key = scryptSync("ismartest", "salt", 32)
  const iv = Buffer.from(ivHex, "hex")
  const decipher = createDecipheriv("aes-256-cbc", key, iv)

  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")


  console.log('pandu decrypted password 2',decrypted)

  return decrypted
}

export async function POST(request: NextRequest) {
  try {
    // console.log("OTP Signin request received")

    // const headers = Object.fromEntries(request.headers.entries())
    // console.log("Request headers:", JSON.stringify(headers, null, 2))

    // const body = await request.json().catch((err) => {
    //   console.error("Error parsing request body:", err)
    //   return null
    // })

    // console.log("Request body received:", JSON.stringify(body, null, 2))

    // if (!body || !body.phone) {
    //   return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    // }

    // const { phone, device_token, device_type = "unknown" } = body
    // const supabase = createServerSupabaseClient()

    // // 🔍 Get all profiles matching the phone number
    // const { data: profiles, error: profileError } = await supabase
    //   .from("profiles")
    //   .select("email, hash_password, id")
    //   .eq("phone", phone)
      

    // if (profileError || !profiles || profiles.length === 0) {
    //   console.error("Profile fetch error:", profileError)
    //   return NextResponse.json(
    //     { error: "User not found for the given phone number" },
    //     { status: 404 }
    //   )
    // }

    // // ✅ Find the first valid user (has both email and hash_password)
    // const profileData = profiles.find(p => p.email && p.hash_password)

    // if (!profileData) {
    //   return NextResponse.json(
    //     { error: "No valid user with complete credentials found for this phone" },
    //     { status: 404 }
    //   )
    // }

    // const email = profileData.email
    const password = decryptPassword("11f3838ed331fce52ce7643298514c37:c8836e3c585e493ecb1e8f9568eeaee5ba3b08b943330aaac7f467eb16a24c76")
    // const userId = profileData.id

    // // 🔐 Sign in with decrypted credentials
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    // if (error) {
    //   console.error("Supabase auth error:", error)
    //   return NextResponse.json({ error: error.message }, { status: 401 })
    // }

    // // 🔁 Upsert device_token
    // if (device_token) {
    //   const { error: upsertError } = await supabaseAdmin.from("device_tokens").upsert(
    //     {
    //       user_id: userId,
    //       device_token,
    //       device_type,
    //     },
    //     { onConflict: "user_id" }
    //   )

    //   if (upsertError) {
    //     console.error("Error upserting device token:", upsertError)
    //   }
    // }

    // // 📄 Get user profile from gc_profiles (optional)
    // const { data: gcProfile, error: gcProfileError } = await supabase
    //   .from("gc_profiles")
    //   .select("*")
    //   .eq("id", userId)
    //   .single()

    // if (gcProfileError) {
    //   console.error("GC Profile fetch error:", gcProfileError)
    // }

    // console.log("OTP-based login successful for user:", data)

    // const response = NextResponse.json({
    //   message: "Signed in successfully",
    //   user: data.user,
    //   profile: gcProfile,
    //   session: data.session,
    // })

    // // ✅ CORS handling
    // const origin = request.headers.get("origin") || ""
    // if (allowedOrigins.includes(origin)) {
    //   response.headers.set("Access-Control-Allow-Origin", origin)
    //   response.headers.set("Access-Control-Allow-Credentials", "true")
    // }

    // return response
  } catch (error) {
    console.error("OTP Signin error:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
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
