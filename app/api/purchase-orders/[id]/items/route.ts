import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { handleCors, setCorsHeaders } from "@/lib/cors"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Get all items for a purchase order
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const poId = params.id

    // Check if purchase order exists
    const { data: po, error: poError } = await supabaseAdmin
      .from("purchase_orders")
      .select("id")
      .eq("id", poId)
      .single()

    if (poError) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
    }

    // Get all items for the purchase order
    const { data: items, error: itemsError } = await supabaseAdmin
      .from("purchase_order_items")
      .select(`
        *,
        articles:article_id(id, name, description, unit_of_measurement)
      `)
      .eq("po_id", poId)
      .order("id", { ascending: true })

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    const response = NextResponse.json({
      po_id: poId,
      items,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error fetching purchase order items:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// Add new items to a purchase order
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const poId = params.id
    const { items } = await request.json()

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items array is required and cannot be empty" }, { status: 400 })
    }

    // Check if purchase order exists and is not completed or cancelled
    const { data: po, error: poError } = await supabaseAdmin
      .from("purchase_orders")
      .select("id, po_status")
      .eq("id", poId)
      .single()

    if (poError) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
    }

    if (po.po_status === "Completed" || po.po_status === "Cancelled") {
      return NextResponse.json(
        {
          error: `Cannot add items to a ${po.po_status.toLowerCase()} purchase order`,
        },
        { status: 400 },
      )
    }

    // Validate each item
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

    // Prepare items for insertion
    const itemsToInsert = items.map((item) => ({
      po_id: poId,
      article_id: item.article_id,
      cost_price: item.cost_price,
      mrp: item.mrp,
      gst_percentage: item.gst_percentage,
      ordered_quantity: item.ordered_quantity,
      received_quantity: item.received_quantity || 0,
    }))

    // Insert items
    const { data: insertedItems, error: insertError } = await supabaseAdmin
      .from("purchase_order_items")
      .insert(itemsToInsert)
      .select()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    const response = NextResponse.json({
      message: "Items added to purchase order successfully",
      po_id: poId,
      items: insertedItems,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error adding purchase order items:", error)
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
