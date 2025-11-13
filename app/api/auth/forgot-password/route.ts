import { supabaseAdmin } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"
import { scryptSync, createCipheriv, randomBytes } from "crypto"

const allowedOrigins = [
  "https://v0-grocery-testingapp.vercel.app",
  "https://v0-frontend-ecomercetesting-app-atstqv.vercel.app",
  "https://v0-frontend-ecomercetesting-app.vercel.app",
  "https://v0-frontend-ecomercetesting-app-vpil0a.vercel.app",
  "http://localhost:3000",
  "https://ismart.today",
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
    const body = await request.json()

    const { phone_number, new_password } = body

    if (!phone_number || !new_password) {
      return NextResponse.json({ error: "Phone number and new password are required" }, { status: 400 })
    }

    // 🔍 Find user by phone number in `profiles`
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("phone", phone_number)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = profile.id

    // 🔐 Update password in Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: new_password,
    })

    if (authError) {
      return NextResponse.json({ error: "Failed to update password in auth", details: authError.message }, { status: 500 })
    }

    // 🔏 Encrypt and update in `profiles` table
    const encrypted = encryptPassword(new_password)

    const { error: updateProfileError } = await supabaseAdmin
      .from("profiles")
      .update({ hash_password: encrypted })
      .eq("id", userId)

    if (updateProfileError) {
      console.error("Failed to update hash_password in profiles", updateProfileError)
    }

    const response = NextResponse.json({ message: "Password updated successfully" })

    // ✅ Handle CORS
    const origin = request.headers.get("origin") || ""
    if (allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
      response.headers.set("Access-Control-Allow-Credentials", "true")
    }

    return response
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
