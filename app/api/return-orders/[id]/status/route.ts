import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { status } = await request.json()

    // Validate status
    const validStatuses = ["Received", "Processed"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status",
          validStatuses,
        },
        { status: 400 },
      )
    }

    // Check if return order exists
    const { data: existingReturnOrder, error: checkError } = await supabaseAdmin
      .from("return_orders")
      .select("id, status")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "Return order not found" }, { status: 404 })
    }

    // Update return order status
    const { data, error } = await supabaseAdmin.from("return_orders").update({ status }).eq("id", id).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Return order status updated successfully",
      return_order: data,
      previous_status: existingReturnOrder.status,
    })
  } catch (error) {
    console.error("Error updating return order status:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
