import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { status } = await request.json()

    // Validate status
    const validStatuses = ["Received", "Rejected"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status",
          validStatuses,
        },
        { status: 400 },
      )
    }

    // Check if GRN exists
    const { data: existingGRN, error: checkError } = await supabaseAdmin
      .from("goods_receipt_notes")
      .select("id, status, po_id")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "GRN not found" }, { status: 404 })
    }

    // Update GRN status
    const { data, error } = await supabaseAdmin
      .from("goods_receipt_notes")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If status is changed to 'Rejected', update the purchase order status
    if (status === "Rejected" && existingGRN.status !== "Rejected") {
      await supabaseAdmin.from("purchase_orders").update({ status: "Created" }).eq("id", existingGRN.po_id)
    }

    return NextResponse.json({
      message: "GRN status updated successfully",
      grn: data,
      previous_status: existingGRN.status,
    })
  } catch (error) {
    console.error("Error updating GRN status:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
