import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Define valid order statuses
const validOrderStatuses = [
  "pending",
  "confirmed",
  "approved",
  "preparing",
  "ready",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "rejected",
  "cancelled",
  "failed",
]

// Update order status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { status } = await request.json()

    // Validate status
    if (!validOrderStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status",
          validStatuses: validOrderStatuses,
        },
        { status: 400 },
      )
    }

    // Check if order exists
    const { data: existingOrder, error: checkError } = await supabaseAdmin
      .from("orders")
      .select("id, status")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Update order status - only update the status field
    const { data, error } = await supabaseAdmin.from("orders").update({ status }).eq("id", id).select("*").single()

    if (error) {
      console.error("Error updating order status:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: data,
      previous_status: existingOrder.status,
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 })
  }
}
