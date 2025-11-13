import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

/**
 * GET /api/payments
 * Get all payments with optional filtering
 */
export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)

  // Query parameters
  const orderId = searchParams.get("order_id")
  const status = searchParams.get("status")
  const method = searchParams.get("method")
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  // Build query
  let query = supabase
    .from("payments")
    .select("*, orders(id, status, customer_id, total_amount)")
    .order("created_at", { ascending: false })
    .limit(limit)
    .offset(offset)

  // Apply filters
  if (orderId) {
    query = query.eq("order_id", orderId)
  }

  if (status) {
    query = query.eq("payment_status", status)
  }

  if (method) {
    query = query.eq("payment_method", method)
  }

  // Execute query
  const { data, error, count } = await query.returns<any[]>()

  if (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    payments: data,
    count,
    limit,
    offset,
  })
}

/**
 * POST /api/payments
 * Create a new payment
 */
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const body = await request.json()

    // Required fields
    const {
      order_id,
      amount,
      payment_method = "cash",
      payment_status = "pending",
      transaction_id = null,
      payment_details = null,
    } = body

    // Validate required fields
    if (!order_id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 })
    }

    // Verify the order exists
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id, total_amount, status")
      .eq("id", order_id)
      .single()

    if (orderError || !orderData) {
      return NextResponse.json(
        {
          error: orderError?.message || "Order not found",
        },
        { status: 404 },
      )
    }

    // Create the payment record
    const { data, error } = await supabase
      .from("payments")
      .insert({
        order_id,
        amount,
        payment_method,
        payment_status,
        transaction_id,
        payment_details: payment_details ? JSON.stringify(payment_details) : null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating payment:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If payment is completed, update the order status if it's pending
    if (payment_status === "completed" && orderData.status === "pending") {
      await supabase.from("orders").update({ status: "processing" }).eq("id", order_id)
    }

    return NextResponse.json({ payment: data }, { status: 201 })
  } catch (error) {
    console.error("Error processing payment request:", error)
    return NextResponse.json(
      {
        error: "Failed to process payment request",
      },
      { status: 500 },
    )
  }
}
