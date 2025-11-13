import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id: vendorId } = params

  const url = new URL(request.url)
  const limit = Number.parseInt(url.searchParams.get("limit") || "50")
  const offset = Number.parseInt(url.searchParams.get("offset") || "0")
  const inboundStatus = url.searchParams.get("inbound_status") // Optional query param

  try {
    let query = supabaseAdmin
      .from("purchase_orders")
      .select(`
        id,
        vendor_id,
        vendor_code,
        vendor_name,
        vendor_address,
        vendor_phone,
        vendor_email,
        payment_terms,
        rtv,
        po_status,
        inbound_status,
        validity_date,
        created_at,
        updated_at,
        purchase_order_items (
          id,
          po_id,
          article_id,
          article_code,
          article_text,
          cost_price,
          mrp,
          ordered_quantity,
          received_quantity,
          uom,
          gst_percentage
        )
      `)
      .eq("vendor_id", vendorId)
      .range(offset, offset + limit - 1)

    // Apply optional inbound_status filter
    if (inboundStatus) {
      query = query.eq("inbound_status", inboundStatus)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      purchase_orders: data,
      limit,
      offset,
    })
  } catch (err) {
    console.error("Error fetching purchase orders:", err)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
