import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const po_id = url.searchParams.get("po_id")
    const status = url.searchParams.get("status")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    let query = supabaseAdmin.from("goods_receipt_notes").select("*, purchase_orders(*)", { count: "exact" })

    if (po_id) {
      query = query.eq("po_id", po_id)
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
      grns: data,
      count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching GRNs:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { po_id, received_date, status = "Received" } = body

    // Validate required fields
    if (!po_id) {
      return NextResponse.json({ error: "Purchase order ID is required" }, { status: 400 })
    }

    // Check if purchase order exists
    const { data: po, error: poError } = await supabaseAdmin
      .from("purchase_orders")
      .select("id")
      .eq("id", po_id)
      .single()

    if (poError) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
    }

    // Create new GRN
    const { data, error } = await supabaseAdmin
      .from("goods_receipt_notes")
      .insert({
        po_id,
        received_date: received_date || new Date().toISOString(),
        status,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If GRN is created successfully, update purchase order status to 'Delivered'
    if (status === "Received") {
      await supabaseAdmin.from("purchase_orders").update({ status: "Delivered" }).eq("id", po_id)
    }

    return NextResponse.json({
      message: "GRN created successfully",
      grn: data,
    })
  } catch (error) {
    console.error("Error creating GRN:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
