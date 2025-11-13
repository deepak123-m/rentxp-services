import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { handleCors, setCorsHeaders } from "@/lib/cors"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const url = new URL(request.url)
    const vendor_id = url.searchParams.get("vendor_id")
    const po_status = url.searchParams.get("po_status")
    const inbound_status = url.searchParams.get("inbound_status")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    let query = supabaseAdmin
      .from("purchase_orders")
      .select(
        `
          *,
          purchase_order_itemstwo(*)
        `,
        { count: "exact" }
      )

    if (vendor_id) {
      query = query.eq("vendor_id", vendor_id)
    }

    if (po_status) {
      query = query.eq("po_status", po_status)
    }

    if (inbound_status) {
      query = query.eq("inbound_status", inbound_status)
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({
      purchase_orders: data,
      count,
      limit,
      offset,
    })

    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error fetching purchase orders:", error)
    const response = NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
    return setCorsHeaders(request, response)
  }
}

export async function POST(request: NextRequest) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const body = await request.json()
    const {
      vendor_id,
      payment_terms = "16-30 days",
      rtv = "No",
      po_status = "Draft",
      inbound_status = "Created",
      validity_date = null,
      items = [],
    } = body

    // Validate required fields
    if (!vendor_id) {
      return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 })
    }

    // Validate payment_terms enum
    const validPaymentTerms = ["0-3 days", "4-7 days", "8-15 days", "16-30 days", "More than 30 days"]
    if (!validPaymentTerms.includes(payment_terms)) {
      return NextResponse.json(
        {
          error: "Invalid payment terms",
          validValues: validPaymentTerms,
        },
        { status: 400 },
      )
    }

    // Validate rtv enum
    const validRtv = ["Yes", "No"]
    if (!validRtv.includes(rtv)) {
      return NextResponse.json(
        {
          error: "Invalid RTV value",
          validValues: validRtv,
        },
        { status: 400 },
      )
    }

    // Validate po_status
    const validPoStatus = ["Draft", "Approved", "Cancelled", "Completed"]
    if (!validPoStatus.includes(po_status)) {
      return NextResponse.json(
        {
          error: "Invalid PO status",
          validValues: validPoStatus,
        },
        { status: 400 },
      )
    }

    // Validate inbound_status
    const validInboundStatus = ["Created", "Approved", "Dispatched", "Delivered", "Completed", "Cancelled"]
    if (!validInboundStatus.includes(inbound_status)) {
      return NextResponse.json(
        {
          error: "Invalid inbound status",
          validValues: validInboundStatus,
        },
        { status: 400 },
      )
    }

    // Check if vendor exists
    const { data: vendor, error: vendorError } = await supabaseAdmin
      .from("vendors")
      .select("id")
      .eq("id", vendor_id)
      .single()

    if (vendorError) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    // Validate items if provided
    if (items.length > 0) {
      // Check if all required fields are present
      for (const [index, item] of items.entries()) {
        if (!item.article_id || item.cost_price === undefined || item.mrp === undefined || !item.ordered_quantity) {
          return NextResponse.json(
            {
              error: `Item at index ${index} is missing required fields`,
              requiredFields: ["article_id", "cost_price", "mrp", "ordered_quantity"],
            },
            { status: 400 },
          )
        }

        // Validate ordered_quantity is positive
        if (item.ordered_quantity <= 0) {
          return NextResponse.json(
            {
              error: `Item at index ${index} has invalid ordered_quantity. Must be greater than 0.`,
            },
            { status: 400 },
          )
        }

        // Validate gst_percentage is a valid number if provided
        if (
          item.gst_percentage !== undefined &&
          (isNaN(Number(item.gst_percentage)) || Number(item.gst_percentage) < 0)
        ) {
          return NextResponse.json(
            {
              error: `Item at index ${index} has invalid gst_percentage. Must be a non-negative number.`,
            },
            { status: 400 },
          )
        }

        // Check if article exists
        const { data: article, error: articleError } = await supabaseAdmin
          .from("articles")
          .select("id")
          .eq("id", item.article_id)
          .single()

        if (articleError) {
          return NextResponse.json(
            {
              error: `Article with ID ${item.article_id} not found for item at index ${index}`,
            },
            { status: 404 },
          )
        }
      }
    }

    // Create purchase order
    const { data: purchaseOrder, error: poError } = await supabaseAdmin
      .from("purchase_orders")
      .insert({
        vendor_id,
        payment_terms,
        rtv,
        po_status,
        inbound_status,
        validity_date: validity_date ? new Date(validity_date).toISOString() : null,
      })
      .select()
      .single()

    if (poError) {
      return NextResponse.json({ error: poError.message }, { status: 500 })
    }

    // Create purchase order items if provided
    let poItems = []
    if (items.length > 0) {
      const poItemsToInsert = items.map((item) => ({
        po_id: purchaseOrder.id,
        article_id: item.article_id,
        cost_price: item.cost_price,
        mrp: item.mrp,
        gst_percentage: item.gst_percentage,
        ordered_quantity: item.ordered_quantity,
        received_quantity: item.received_quantity || 0,
      }))

      const { data: insertedItems, error: itemsError } = await supabaseAdmin
        .from("purchase_order_items")
        .insert(poItemsToInsert)
        .select()

      if (itemsError) {
        // If there's an error creating items, delete the purchase order to maintain consistency
        await supabaseAdmin.from("purchase_orders").delete().eq("id", purchaseOrder.id)
        return NextResponse.json({ error: itemsError.message }, { status: 500 })
      }

      poItems = insertedItems
    }

    // Get the complete purchase order with items
    const { data: completePO, error: fetchError } = await supabaseAdmin
      .from("purchase_orders")
      .select(`
        *,
        purchase_order_items(*)
      `)
      .eq("id", purchaseOrder.id)
      .single()

    if (fetchError) {
      console.error("Error fetching complete purchase order:", fetchError)
      // Return the basic purchase order if we can't fetch the complete one
      const response = NextResponse.json({
        message: "Purchase order created successfully",
        purchase_order: {
          ...purchaseOrder,
          purchase_order_items: poItems,
        },
      })
      return setCorsHeaders(request, response)
    }

    const response = NextResponse.json({
      message: "Purchase order created successfully",
      purchase_order: completePO,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error creating purchase order:", error)
    const response = NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
    return setCorsHeaders(request, response)
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request)
}
