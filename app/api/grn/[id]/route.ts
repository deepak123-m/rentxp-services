import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { data, error } = await supabaseAdmin
      .from("goods_receipt_notes")
      .select("*, purchase_orders(*)")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "GRN not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ grn: data })
  } catch (error) {
    console.error("Error fetching GRN:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { po_id, received_date, status } = body

    // Check if GRN exists
    const { data: existingGRN, error: checkError } = await supabaseAdmin
      .from("goods_receipt_notes")
      .select("id")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "GRN not found" }, { status: 404 })
    }

    // If po_id is provided, check if purchase order exists
    if (po_id) {
      const { data: po, error: poError } = await supabaseAdmin
        .from("purchase_orders")
        .select("id")
        .eq("id", po_id)
        .single()

      if (poError) {
        return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
      }
    }

    // Update GRN
    const { data, error } = await supabaseAdmin
      .from("goods_receipt_notes")
      .update({
        po_id,
        received_date,
        status,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "GRN updated successfully",
      grn: data,
    })
  } catch (error) {
    console.error("Error updating GRN:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if GRN exists
    const { data: existingGRN, error: checkError } = await supabaseAdmin
      .from("goods_receipt_notes")
      .select("id")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "GRN not found" }, { status: 404 })
    }

    // Delete GRN
    const { error } = await supabaseAdmin.from("goods_receipt_notes").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "GRN deleted successfully",
      id,
    })
  } catch (error) {
    console.error("Error deleting GRN:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
