import { type NextRequest, NextResponse } from "next/server"
import type { UserRole } from "@/lib/supabase"
import { createClient } from "@/lib/supabase/client"
import { supabaseAdmin } from "@/lib/supabase"
import { setCorsHeaders } from "@/lib/cors"
import { createCipheriv, randomBytes, scryptSync } from "crypto"

// 🔐 Password encryption helper
const encryptPassword = (password: string): string => {
  const iv = randomBytes(16)
  const key = scryptSync("ismartest", "salt", 32)
  const cipher = createCipheriv("aes-256-cbc", key, iv)

  let encrypted = cipher.update(password, "utf8", "hex")
  encrypted += cipher.final("hex")

  return `${iv.toString("hex")}:${encrypted}`
}

export async function POST(request: NextRequest) {
  try {
    // const {
    //   email,
    //   password,
    //   full_name,
    //   role = "customer",
    //   phone,
    //   address,
    //   device_token,
    //   device_type,
    // } = await request.json()

    const email = "PO@ismart.today"
    const password = "po@ismart.today"
    const phone = "8712409013"

    // if (!email || !password || !full_name) {
    //   const response = NextResponse.json({ error: "Email, password, and full name are required" }, { status: 400 })
    //   return setCorsHeaders(request, response)
    // }

    // const validRoles: UserRole[] = ["admin", "vendor", "customer", "delivery"]
    // if (!validRoles.includes(role as UserRole)) {
    //   const response = NextResponse.json({ error: "Invalid role" }, { status: 400 })
    //   return setCorsHeaders(request, response)
    // }

    // ✅ Check if email or phone already exists
    // const { data: existingUsers, error: checkError } = await supabaseAdmin
    //   .from("profiles")
    //   .select("id")
    //   .or(`email.eq.${email},phone.eq.${phone}`)

    // if (checkError) {
    //   console.error("Error checking existing user:", checkError.message)
    // }

    // if (existingUsers && existingUsers.length > 0) {
    //   const response = NextResponse.json({ error: "A user with this email or phone already exists" }, { status: 409 })
    //   return setCorsHeaders(request, response)
    // }

    const supabase = createClient()

    // 👤 Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      phone,
   
    })


    console.log('vendordata',authData)

    
      // if (profileError) {
      //   const response = NextResponse.json({ error: profileError.message }, { status: 500 })
      //   return setCorsHeaders(request, response)
      // }

      // 📱 Save device token if available
      // if (device_token) {
      //   await supabaseAdmin.from("device_tokens").delete().eq("user_id", authData.user.id)

      //   await supabaseAdmin.from("device_tokens").insert({
      //     user_id: authData.user.id,
      //     device_token,
      //     device_type: device_type || "unknown",
      //   })
      // }

      // // 🔑 Sign in and return tokens
      // const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // })

      // if (sessionError) {
      //   const response = NextResponse.json(
      //     { message: "User created but couldn't retrieve tokens", user: authData.user },
      //     { status: 201 },
      //   )
      //   return setCorsHeaders(request, response)
      // }

      const response = NextResponse.json({
        message: "User created successfully",
        user:authData,
      })
      return setCorsHeaders(request, response)
    }

   
   catch (error) {
    console.error("Signup error:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }

}




// import { type NextRequest, NextResponse } from "next/server"
// import type { UserRole } from "@/lib/supabase"
// import { createClient } from "@/lib/supabase/client"
// import { supabaseAdmin } from "@/lib/supabase"
// import { setCorsHeaders } from "@/lib/cors"
// import { createCipheriv, randomBytes, scryptSync } from "crypto"

// // 🔐 Password encryption helper
// const encryptPassword = (password: string): string => {
//   const iv = randomBytes(16)
//   const key = scryptSync("ismartest", "salt", 32)
//   const cipher = createCipheriv("aes-256-cbc", key, iv)

//   let encrypted = cipher.update(password, "utf8", "hex")
//   encrypted += cipher.final("hex")

//   return `${iv.toString("hex")}:${encrypted}`
// }

// export async function POST(request: NextRequest) {
//   try {
//     const {
//       email,
//       password,
//       full_name,
//       role = "customer",
//       phone,
//       address,
//       device_token,
//       device_type,
//     } = await request.json()

//     if (!email || !password || !full_name) {
//       const response = NextResponse.json({ error: "Email, password, and full name are required" }, { status: 400 })
//       return setCorsHeaders(request, response)
//     }

//     const validRoles: UserRole[] = ["admin", "vendor", "customer", "delivery"]
//     if (!validRoles.includes(role as UserRole)) {
//       const response = NextResponse.json({ error: "Invalid role" }, { status: 400 })
//       return setCorsHeaders(request, response)
//     }

//     // ✅ Check if email or phone already exists
//     const { data: existingUsers, error: checkError } = await supabaseAdmin
//       .from("profiles")
//       .select("id")
//       .or(`email.eq.${email},phone.eq.${phone}`)

//     if (checkError) {
//       console.error("Error checking existing user:", checkError.message)
//     }

//     if (existingUsers && existingUsers.length > 0) {
//       const response = NextResponse.json({ error: "A user with this email or phone already exists" }, { status: 409 })
//       return setCorsHeaders(request, response)
//     }

//     const supabase = createClient()

//     // 👤 Create user in Supabase Auth
//     const { data: authData, error: authError } = await supabase.auth.signUp({
//       email,
//       password,
//       phone,
//       options: {
//         data: { full_name, role },
//       },
//     })

//     if (authError) {
//       const response = NextResponse.json({ error: authError.message }, { status: 400 })
//       return setCorsHeaders(request, response)
//     }

//     if (authData.user) {
//       const encryptedPassword = encryptPassword(password)

//       // 📝 Insert into profiles with email & encrypted password
//       const { error: profileError } = await supabaseAdmin.from("profiles").insert({
//         id: authData.user.id,
//         role,
//         full_name,
//         phone,
//         address,
//         email,
//         hash_password: encryptedPassword,
//         new_onboard:true,
//       })

//       if (profileError) {
//         const response = NextResponse.json({ error: profileError.message }, { status: 500 })
//         return setCorsHeaders(request, response)
//       }

//       // 📱 Save device token if available
//       if (device_token) {
//         await supabaseAdmin.from("device_tokens").delete().eq("user_id", authData.user.id)

//         await supabaseAdmin.from("device_tokens").insert({
//           user_id: authData.user.id,
//           device_token,
//           device_type: device_type || "unknown",
//         })
//       }

//       // 🔑 Sign in and return tokens
//       const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       })

//       if (sessionError) {
//         const response = NextResponse.json(
//           { message: "User created but couldn't retrieve tokens", user: authData.user },
//           { status: 201 },
//         )
//         return setCorsHeaders(request, response)
//       }

//       const response = NextResponse.json({
//         message: "User created successfully",
//         user: authData.user,
//         tokens: {
//           access_token: sessionData.session?.access_token,
//           refresh_token: sessionData.session?.refresh_token,
//           expires_at: sessionData.session?.expires_at,
//         },
//       })
//       return setCorsHeaders(request, response)
//     }

//     const response = NextResponse.json({ message: "User created successfully", user: authData.user })
//     return setCorsHeaders(request, response)
//   } catch (error) {
//     console.error("Signup error:", error)
//     const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
//     return setCorsHeaders(request, response)
//   }
// }