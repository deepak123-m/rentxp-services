import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// GET /api/owner-bank-accounts - Get all bank accounts for a registration
export async function GET(request: NextRequest) {
  try {
    // Get registration_id from query params
    const url = new URL(request.url)
    const registrationId = url.searchParams.get("registration_id")

    if (!registrationId) {
      return NextResponse.json(
        {
          success: false,
          error: "registration_id is required",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    // Validate UUID format
    if (!isValidUUID(registrationId)) {
      console.error("Invalid UUID format:", registrationId)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid registration_id format. Must be a valid UUID.",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    // Fetch bank accounts for the registration
    const { data, error } = await supabaseAdmin
      .from("owner_bank_accounts")
      .select("*")
      .eq("registration_id", registrationId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error fetching bank accounts:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch bank accounts",
          details: error.message,
        },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: data || [],
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error: any) {
    console.error("Unexpected error in GET /api/owner-bank-accounts:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
}

// POST /api/owner-bank-accounts - Create a new bank account
export async function POST(request: NextRequest) {
  console.log("POST /api/owner-bank-accounts - Request received")

  try {
    // Parse JSON data
    let body
    try {
      body = await request.json()
      console.log("Request body parsed:", JSON.stringify(body))
    } catch (e) {
      console.error("Error parsing request body:", e)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    // Extract fields
    const {
      registration_id,
      account_holder_name,
      account_number,
      bank_name,
      branch_name,
      ifsc_code,
      account_type,
      is_primary,
    } = body

    // Validate required fields
    if (!registration_id) {
      console.log("Validation error: registration_id is required")
      return NextResponse.json(
        {
          success: false,
          error: "registration_id is required",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    // Validate UUID format
    /*if (!isValidUUID(registration_id)) {
      console.error("Invalid UUID format:", registration_id)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid registration_id format. Must be a valid UUID.",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }*/

    // Check if the registration exists
    const { data: registrationData, error: registrationError } = await supabaseAdmin
      .from("shop_owner_registrations")
      .select("id")
      .eq("id", registration_id)
      .maybeSingle()

    if (registrationError) {
      console.error("Error checking registration:", registrationError)
      return NextResponse.json(
        {
          success: false,
          error: "Error checking registration",
          details: registrationError.message,
        },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    if (!registrationData) {
      console.error("Registration not found:", registration_id)
      return NextResponse.json(
        {
          success: false,
          error: "Registration not found with the provided ID.",
        },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    if (!account_holder_name) {
      console.log("Validation error: account_holder_name is required")
      return NextResponse.json(
        {
          success: false,
          error: "account_holder_name is required",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    if (!account_number) {
      console.log("Validation error: account_number is required")
      return NextResponse.json(
        {
          success: false,
          error: "account_number is required",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    if (!bank_name) {
      console.log("Validation error: bank_name is required")
      return NextResponse.json(
        {
          success: false,
          error: "bank_name is required",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    if (!ifsc_code) {
      console.log("Validation error: ifsc_code is required")
      return NextResponse.json(
        {
          success: false,
          error: "ifsc_code is required",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    // Prepare data for insertion
    const bankAccountData = {
      registration_id,
      account_holder_name,
      account_number,
      bank_name,
      branch_name: branch_name || null,
      ifsc_code,
      account_type: account_type || null,
      is_primary: is_primary === true,
    }

    console.log("Prepared data for insertion:", JSON.stringify(bankAccountData))

    // If this is set as primary, update any existing primary accounts to non-primary
    if (bankAccountData.is_primary) {
      console.log("Updating existing primary accounts to non-primary")
      try {
        const { error: updateError } = await supabaseAdmin
          .from("owner_bank_accounts")
          .update({ is_primary: false })
          .eq("registration_id", registration_id)
          .eq("is_primary", true)

        if (updateError) {
          console.error("Error updating existing primary accounts:", updateError)
          // Continue with insertion even if this fails
        }
      } catch (updateErr) {
        console.error("Unexpected error updating existing primary accounts:", updateErr)
        // Continue with insertion even if this fails
      }
    }

    // Create the bank account
    console.log("Inserting new bank account")
    const { data, error } = await supabaseAdmin.from("owner_bank_accounts").insert(bankAccountData).select().single()

    if (error) {
      console.error("Database error creating bank account:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create bank account",
          details: error.message,
        },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    console.log("Bank account created successfully:", data?.id)
    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error: any) {
    console.error("Unexpected error in POST /api/owner-bank-accounts:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
}
