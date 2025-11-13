import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import type { Database } from "@/types/supabase"
import { getAuthUser } from "@/lib/auth-utils"

// Set an address as default
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

  // If address is already default, return success
  if (existingAddress.is_default) {
    return NextResponse.json(existingAddress)
  }

  // Update all addresses to not be default
  const { error: updateAllError } = await supabase
    .from("user_addresses")
    .update({ is_default: false })
    .eq("user_id", userId)

  if (updateAllError) {
    return NextResponse.json({ message: "Error updating addresses", error: updateAllError.message }, { status: 500 })
  }

  // Set this address as default
  const { data: updatedAddress, error: updateError } = await supabase
    .from("user_addresses")
    .update({
      is_default: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", addressId)
    .eq("user_id", userId)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json(
      { message: "Error setting address as default", error: updateError.message },
      { status: 500 },
    )
  }

  return NextResponse.json(updatedAddress)
}
