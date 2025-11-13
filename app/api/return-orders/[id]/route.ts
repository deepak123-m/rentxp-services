import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { data, error } = await supabaseAdmin.from("return_orders").select("*, iorders(*)").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Return order not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ return_order: data })
  } catch (error) {
    console.error("Error fetching return order:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { order_id, reason, status } = body

    // Check if return order exists
    const { data: existingReturnOrder, error: checkError } = await supabaseAdmin
      .from("return_orders")
      .select("id")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "Return order not found" }, { status: 404 })
    }

    // If order_id is provided, check if order exists
    if (order_id) {
      const { data: order, error: orderError } = await supabaseAdmin
        .from("iorders")
        .select("id")
        .eq("id", order_id)
        .single()

      if (orderError) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
    }

    // Update return order
    const { data, error } = await supabaseAdmin
      .from("return_orders")
      .update({
        order_id,
        reason,
        status,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Return order updated successfully",
      return_order: data,
    })
  } catch (error) {
    console.error("Error updating return order:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if return order exists
    const { data: existingReturnOrder, error: checkError } = await supabaseAdmin
      .from("return_orders")
      .select("id")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "Return order not found" }, { status: 404 })
    }

    // Delete return order
    const { error } = await supabaseAdmin.from("return_orders").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Return order deleted successfully",
      id,
    })
  } catch (error) {
    console.error("Error deleting return order:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
