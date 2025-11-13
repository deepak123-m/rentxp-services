import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Get a specific shop owner registration by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const registrationId = params.id
    const supabase = createServerSupabaseClient()

    // Get registration with related data
    const { data: registration, error: registrationError } = await supabase
      .from("shop_owner_registrations")
      .select("*, approved_by(*), sales_officer_id(*)")
      .eq("id", registrationId)
      .single()

    if (registrationError) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // Get documents for this registration
    const { data: documents, error: documentsError } = await supabase
      .from("shop_owner_documents")
      .select("*")
      .eq("registration_id", registrationId)
      .order("created_at", { ascending: false })

    if (documentsError) {
      console.error("Error fetching documents:", documentsError)
      // Continue without documents if there's an error
    }

    return NextResponse.json({
      registration,
      documents: documents || [],
    })
  } catch (error) {
    console.error("Error fetching shop owner registration:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Update a shop owner registration (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and role
  const authResponse = await withAuth(request, ["admin"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const registrationId = params.id
    const supabase = createServerSupabaseClient()

    const body = await request.json()
    const {
      merchant_segment,
      merchant_sub_segment,
      shop_name,
      shop_display_name,
      shop_phone,
      shop_email,
      shop_website,
      shop_gstin,
      owner_name,
      owner_phone,
      owner_email,
      sales_officer_id,
    } = body

    // Update shop owner registration
    const { data, error } = await supabase
      .from("shop_owner_registrations")
      .update({
        merchant_segment,
        merchant_sub_segment,
        shop_name,
        shop_display_name,
        shop_phone,
        shop_email,
        shop_website,
        shop_gstin,
        owner_name,
        owner_phone,
        owner_email,
        sales_officer_id,
      })
      .eq("id", registrationId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Shop owner registration updated successfully",
      registration: data,
    })
  } catch (error) {
    console.error("Error updating shop owner registration:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Delete a shop owner registration (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and role
  const authResponse = await withAuth(request, ["admin"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const registrationId = params.id
    const supabase = createServerSupabaseClient()

    // Delete shop owner registration
    const { error } = await supabase.from("shop_owner_registrations").delete().eq("id", registrationId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Shop owner registration deleted successfully",
      id: registrationId,
    })
  } catch (error) {
    console.error("Error deleting shop owner registration:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
