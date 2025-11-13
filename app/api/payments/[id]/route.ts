import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

/**
 * GET /api/payments/:id
 * Get a specific payment by ID
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*, orders(id, status, customer_id, total_amount, delivery_address)")
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: error.code === "PGRST116" ? 404 : 500 },
      )
    }

    return NextResponse.json({ payment: data })
  } catch (error) {
    console.error("Error fetching payment:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch payment",
      },
      { status: 500 },
    )
  }
}

/**
 * PATCH /api/payments/:id
 * Update a payment's status or details
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const body = await request.json()

    const { payment_status, transaction_id, payment_details } = body

    // Get the current payment record
    const { data: currentPayment, error: fetchError } = await supabase
      .from("payments")
      .select("payment_status, order_id")
      .eq("id", params.id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        {
          error: fetchError.message,
        },
        { status: fetchError.code === "PGRST116" ? 404 : 500 },
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (payment_status) {
      updateData.payment_status = payment_status
    }

    if (transaction_id !== undefined) {
      updateData.transaction_id = transaction_id
    }

    if (payment_details !== undefined) {
      updateData.payment_details = payment_details ? JSON.stringify(payment_details) : null
    }

    // Update the payment
    const { data, error } = await supabase.from("payments").update(updateData).eq("id", params.id).select().single()

    if (error) {
      console.error("Error updating payment:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If payment status changed to completed, update the order status if needed
    if (payment_status === "completed" && currentPayment.payment_status !== "completed") {
      const { data: orderData } = await supabase
        .from("orders")
        .select("status")
        .eq("id", currentPayment.order_id)
        .single()

      if (orderData && orderData.status === "pending") {
        await supabase.from("orders").update({ status: "processing" }).eq("id", currentPayment.order_id)
      }
    }

    return NextResponse.json({ payment: data })
  } catch (error) {
    console.error("Error updating payment:", error)
    return NextResponse.json(
      {
        error: "Failed to update payment",
      },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/payments/:id
 * Delete a payment (only allowed for pending payments)
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Check if payment is pending
    const { data: payment, error: fetchError } = await supabase
      .from("payments")
      .select("payment_status")
      .eq("id", params.id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        {
          error: fetchError.message,
        },
        { status: fetchError.code === "PGRST116" ? 404 : 500 },
      )
    }

    // Only allow deletion of pending payments
    if (payment.payment_status !== "pending") {
      return NextResponse.json(
        {
          error: "Only pending payments can be deleted",
        },
        { status: 400 },
      )
    }

    // Delete the payment
    const { error } = await supabase.from("payments").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting payment:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "Payment deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error deleting payment:", error)
    return NextResponse.json(
      {
        error: "Failed to delete payment",
      },
      { status: 500 },
    )
  }
}
