import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const order_id = url.searchParams.get("order_id")
    const status = url.searchParams.get("status")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    let query = supabaseAdmin.from("return_orders").select("*, iorders(*)", { count: "exact" })

    if (order_id) {
      query = query.eq("order_id", order_id)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      return_orders: data,
      count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching return orders:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, reason, status = "Received" } = body

    // Validate required fields
    if (!order_id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Check if order exists
    const { data: order, error: orderError } = await supabaseAdmin
      .from("iorders")
      .select("id")
      .eq("id", order_id)
      .single()

    if (orderError) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Create new return order
    const { data, error } = await supabaseAdmin
      .from("return_orders")
      .insert({
        order_id,
        reason,
        status,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Return order created successfully",
      return_order: data,
    })
  } catch (error) {
    console.error("Error creating return order:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
