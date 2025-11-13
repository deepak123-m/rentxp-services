import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Define valid order statuses
const validOrderStatuses = [
  "pending",
  "approved",
  "preparing",
  "ready",
  "in_transit",
  "delivered",
  "rejected",
  "cancelled",
  "failed",
]

// Define valid status transitions based on role
const validStatusTransitions: Record<string, Record<string, string[]>> = {
  pending: {
    vendor: ["approved", "rejected"],
    admin: ["approved", "rejected", "cancelled"],
  },
  approved: {
    vendor: ["preparing", "cancelled"],
    admin: ["preparing", "cancelled"],
    customer: ["cancelled"],
  },
  preparing: {
    vendor: ["ready", "cancelled"],
    admin: ["ready", "cancelled"],
  },
  ready: {
    delivery: ["in_transit"],
    admin: ["in_transit", "cancelled"],
  },
  in_transit: {
    delivery: ["delivered", "failed"],
    admin: ["delivered", "failed"],
  },
  // Terminal states - no transitions allowed
  delivered: {
    admin: [], // Only admin can change from terminal states, and only in exceptional cases
  },
  rejected: {
    admin: [],
  },
  cancelled: {
    admin: [],
  },
  failed: {
    admin: ["in_transit"], // Allow retry for failed deliveries
  },
}

// Update order status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { status } = await request.json()

    // Validate status
    const validStatuses = ["Received", "Processed", "Dispatched", "Delivered"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status",
          validStatuses,
        },
        { status: 400 },
      )
    }

    // Check if order exists
    const { data: existingOrder, error: checkError } = await supabaseAdmin
      .from("iorders")
      .select("id, status")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update order status
    const { data, error } = await supabaseAdmin.from("iorders").update({ status }).eq("id", id).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Order status updated successfully",
      order: data,
      previous_status: existingOrder.status,
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
