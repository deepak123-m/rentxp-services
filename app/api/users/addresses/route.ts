import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import type { Database } from "@/types/supabase"
import { getAuthUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  // Try token-based authentication first
  const user = await getAuthUser(request)

  // If no token or invalid token, fall back to cookie-based session
  let userId: string
  if (user) {
    userId = user.id
  } else {
    // Check if user is authenticated via cookies
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    userId = session.user.id
  }

  // Get all addresses for the user
  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ message: "Error fetching addresses", error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Create a new address
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  // Try token-based authentication first
  const user = await getAuthUser(request)

  // If no token or invalid token, fall back to cookie-based session
  let userId: string
  if (user) {
    userId = user.id
  } else {
    // Check if user is authenticated via cookies
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    userId = session.user.id
  }

  try {
    const addressData = await request.json()

    // Validate required fields
    const requiredFields = ["address_type", "name", "address_line1", "city", "state", "postal_code", "country"]
    const missingFields = requiredFields.filter((field) => !addressData[field])

    if (missingFields.length > 0) {
      return NextResponse.json({ message: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 })
    }

    // Validate address type
    const validTypes = ["home", "work", "other"]
    if (!validTypes.includes(addressData.address_type.toLowerCase())) {
      return NextResponse.json(
        { message: `Invalid address type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 },
      )
    }

    // If this is the first address or is_default is true, update existing default addresses
    if (addressData.is_default) {
      await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId).eq("is_default", true)
    } else {
      // Check if this is the user's first address
      const { count } = await supabase
        .from("user_addresses")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      // If it's the first address, make it default
      if (count === 0) {
        addressData.is_default = true
      }
    }

    // Add user_id and timestamps
    const newAddress = {
      ...addressData,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Insert the address
    const { data, error } = await supabase.from("user_addresses").insert(newAddress).select().single()

    if (error) {
      return NextResponse.json({ message: "Error creating address", error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Error processing request", error: (error as Error).message }, { status: 500 })
  }
}
