import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Get all shop owner documents for a given registration ID (customer only)
export async function GET(request: NextRequest) {
  // Check authentication and role
  const authResponse = await withAuth(request, ["customer"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const supabase = createServerSupabaseClient()

    // Parse query parameters
    const url = new URL(request.url)
    const registrationId = url.searchParams.get("registration_id")

    if (!registrationId) {
      return NextResponse.json({ error: "registration_id is required" }, { status: 400 })
    }

    // Build query
    const { data, error } = await supabase
      .from("shop_owner_documents")
      .select("*")
      .eq("registration_id", registrationId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ shop_owner_documents: data })
  } catch (error) {
    console.error("Error fetching shop owner documents:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Create a new shop owner document (customer only)
export async function POST(request: NextRequest) {
  // Check authentication and role
  const authResponse = await withAuth(request, ["customer"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const supabase = createServerSupabaseClient()

    const body = await request.json()
    const { registration_id, document_type, document_number, document_name, document_url, issue_date, expiry_date } =
      body

    // Validate required fields
    if (!registration_id || !document_type || !document_name || !document_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate enum values
    const validDocumentTypes = [
      "gst_certificate",
      "trade_license",
      "fssai_license",
      "pan_card",
      "aadhar_card",
      "cancelled_cheque",
      "bank_statement",
      "incorporation_certificate",
      "partnership_deed",
      "moa_aoa",
      "udyam_certificate",
      "other",
    ]
    if (!validDocumentTypes.includes(document_type)) {
      return NextResponse.json({ error: "Invalid document_type" }, { status: 400 })
    }

    // Create new shop owner document
    const { data, error } = await supabase
      .from("shop_owner_documents")
      .insert({
        registration_id,
        document_type,
        document_number,
        document_name,
        document_url,
        issue_date,
        expiry_date,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Shop owner document created successfully",
      shop_owner_document: data,
    })
  } catch (error) {
    console.error("Error creating shop owner document:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
