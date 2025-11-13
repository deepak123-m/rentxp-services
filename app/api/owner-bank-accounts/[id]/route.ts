import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { handleCors, setCorsHeaders } from "@/lib/cors"

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  // If handleCors didn't return a response, create one
  return new NextResponse(null, { status: 204 })
}

// GET /api/owner-bank-accounts/:id - Get a specific bank account
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  try {
    const id = params.id

    // Fetch the bank account
    const { data, error } = await supabaseAdmin.from("owner_bank_accounts").select("*").eq("id", id).single()

    if (error) {
      const response = NextResponse.json(
        { error: "Failed to fetch bank account", details: error.message },
        { status: error.code === "PGRST116" ? 404 : 500 },
      )
      return setCorsHeaders(request, response)
    }

    const response = NextResponse.json({
      success: true,
      data: data,
    })
    return setCorsHeaders(request, response)
  } catch (error: any) {
    const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// PATCH /api/owner-bank-accounts/:id - Update a bank account
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  try {
    const id = params.id
    const body = await request.json()
    const { account_holder_name, account_number, bank_name, branch_name, ifsc_code, account_type, is_primary } = body

    // Validate account_type if provided
    if (account_type && !["savings", "current", "cc", "od", "other"].includes(account_type)) {
      const response = NextResponse.json(
        { error: "account_type must be one of: savings, current, cc, od, other" },
        { status: 400 },
      )
      return setCorsHeaders(request, response)
    }

    // Get the bank account to check if we're changing primary status
    if (is_primary === true) {
      const { data: existingAccount } = await supabaseAdmin
        .from("owner_bank_accounts")
        .select("registration_id, is_primary")
        .eq("id", id)
        .single()

      if (existingAccount && !existingAccount.is_primary) {
        // If setting this account as primary, update any existing primary accounts to non-primary
        await supabaseAdmin
          .from("owner_bank_accounts")
          .update({ is_primary: false })
          .eq("registration_id", existingAccount.registration_id)
          .eq("is_primary", true)
      }
    }

    // Update the bank account
    const { data, error } = await supabaseAdmin
      .from("owner_bank_accounts")
      .update({
        account_holder_name,
        account_number,
        bank_name,
        branch_name,
        ifsc_code,
        account_type,
        is_primary,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      const response = NextResponse.json(
        { error: "Failed to update bank account", details: error.message },
        { status: error.code === "PGRST116" ? 404 : 500 },
      )
      return setCorsHeaders(request, response)
    }

    const response = NextResponse.json({
      success: true,
      data: data,
    })
    return setCorsHeaders(request, response)
  } catch (error: any) {
    const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// DELETE /api/owner-bank-accounts/:id - Delete a bank account
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  try {
    const id = params.id

    // Delete the bank account
    const { error } = await supabaseAdmin.from("owner_bank_accounts").delete().eq("id", id)

    if (error) {
      const response = NextResponse.json(
        { error: "Failed to delete bank account", details: error.message },
        { status: 500 },
      )
      return setCorsHeaders(request, response)
    }

    const response = NextResponse.json({
      success: true,
      message: "Bank account deleted successfully",
    })
    return setCorsHeaders(request, response)
  } catch (error: any) {
    const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}
