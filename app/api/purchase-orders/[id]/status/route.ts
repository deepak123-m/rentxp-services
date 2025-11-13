import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { handleCors, setCorsHeaders } from "@/lib/cors"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const id = params.id
    const { po_status } = await request.json()

    // Validate status
    const validPoStatus = ["Draft", "Approved", "Cancelled", "Completed"]
    if (!validPoStatus.includes(po_status)) {
      return NextResponse.json(
        {
          error: "Invalid PO status",
          validValues: validPoStatus,
        },
        { status: 400 },
      )
    }

    // Check if purchase order exists
    const { data: existingPO, error: checkError } = await supabaseAdmin
      .from("purchase_orders")
      .select("id, po_status")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
    }

    // Validate status transitions
    if (existingPO.po_status === "Completed" && po_status !== "Completed") {
      return NextResponse.json(
        {
          error: "Cannot change status of a completed purchase order",
        },
        { status: 400 },
      )
    }

    // Update purchase order status
    const { data, error } = await supabaseAdmin
      .from("purchase_orders")
      .update({ po_status })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({
      message: "Purchase order status updated successfully",
      purchase_order: data,
      previous_status: existingPO.po_status,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error updating purchase order status:", error)
    const response = NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
    return setCorsHeaders(request, response)
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request)
}
