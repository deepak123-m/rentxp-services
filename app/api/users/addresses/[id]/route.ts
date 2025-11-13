import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import type { Database } from "@/types/supabase"
import { getAuthUser } from "@/lib/auth-utils"

// Get a specific address
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  const addressId = params.id

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

  // Get the address
  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("id", addressId)
    .eq("user_id", userId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ message: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Error fetching address", error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Update an address
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  const addressId = params.id

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

    // Validate address type if provided
    if (addressData.address_type) {
      const validTypes = ["home", "work", "other"]
      if (!validTypes.includes(addressData.address_type.toLowerCase())) {
        return NextResponse.json(
          { message: `Invalid address type. Must be one of: ${validTypes.join(", ")}` },
          { status: 400 },
        )
      }
    }

    // Check if address exists and belongs to user
    const { data: existingAddress, error: fetchError } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("id", addressId)
      .eq("user_id", userId)
      .single()

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json({ message: "Address not found" }, { status: 404 })
      }

      return NextResponse.json({ message: "Error fetching address", error: fetchError.message }, { status: 500 })
    }

    // If making this address default, update other default addresses
    if (addressData.is_default === true && !existingAddress.is_default) {
      await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId).eq("is_default", true)
    }

    // Update address with updated timestamp
    const updateData = {
      ...addressData,
      updated_at: new Date().toISOString(),
    }

    const { data: updatedAddress, error: updateError } = await supabase
      .from("user_addresses")
      .update(updateData)
      .eq("id", addressId)
      .eq("user_id", userId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ message: "Error updating address", error: updateError.message }, { status: 500 })
    }

    return NextResponse.json(updatedAddress)
  } catch (error) {
    return NextResponse.json({ message: "Error processing request", error: (error as Error).message }, { status: 500 })
  }
}

// Delete an address
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  const addressId = params.id

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

  // Check if address exists and belongs to user
  const { data: existingAddress, error: fetchError } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("id", addressId)
    .eq("user_id", userId)
    .single()

  if (fetchError) {
    if (fetchError.code === "PGRST116") {
      return NextResponse.json({ message: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Error fetching address", error: fetchError.message }, { status: 500 })
  }

  // Delete the address
  const { error } = await supabase.from("user_addresses").delete().eq("id", addressId).eq("user_id", userId)

  if (error) {
    return NextResponse.json({ message: "Error deleting address", error: error.message }, { status: 500 })
  }

  // If the deleted address was default, set the most recently created address as default
  if (existingAddress.is_default) {
    const { data: addresses } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (addresses && addresses.length > 0) {
      await supabase.from("user_addresses").update({ is_default: true }).eq("id", addresses[0].id)
    }
  }

  return NextResponse.json({ message: "Address deleted successfully" })
}
