import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { handleCors, setCorsHeaders } from "@/lib/cors"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Get a specific item from a purchase order
export async function GET(request: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const poId = params.id
    const itemId = params.itemId

    // Get the specific item
    const { data: item, error } = await supabaseAdmin
      .from("purchase_order_items")
      .select(`
        *,
        articles:article_id(id, name, description, unit_of_measurement)
      `)
      .eq("po_id", poId)
      .eq("id", itemId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Item not found in this purchase order" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({ item })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error fetching purchase order item:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// Update a specific item in a purchase order
export async function PATCH(request: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const poId = params.id
    const itemId = params.itemId
    const body = await request.json()
    const { article_id, cost_price, mrp, ordered_quantity, received_quantity, gst_percentage } = body

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
          error: `Cannot update items in a ${po.po_status.toLowerCase()} purchase order`,
        },
        { status: 400 },
      )
    }

    // Check if item exists in this purchase order
    const { data: existingItem, error: itemError } = await supabaseAdmin
      .from("purchase_order_items")
      .select("id")
      .eq("po_id", poId)
      .eq("id", itemId)
      .single()

    if (itemError) {
      return NextResponse.json({ error: "Item not found in this purchase order" }, { status: 404 })
    }

    // Build update object
    const updateData: any = {}

    // If article_id is provided, check if article exists
    if (article_id) {
      const { data: article, error: articleError } = await supabaseAdmin
        .from("articles")
        .select("id")
        .eq("id", article_id)
        .single()

      if (articleError) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }

      updateData.article_id = article_id
    }

    // Add other fields to update if provided
    if (cost_price !== undefined) updateData.cost_price = cost_price
    if (mrp !== undefined) updateData.mrp = mrp
    if (gst_percentage !== undefined) {
      if (isNaN(Number(gst_percentage)) || Number(gst_percentage) < 0) {
        return NextResponse.json(
          {
            error: "Invalid gst_percentage. Must be a non-negative number.",
          },
          { status: 400 },
        )
      }
      updateData.gst_percentage = gst_percentage
    }

    if (ordered_quantity !== undefined) {
      if (ordered_quantity <= 0) {
        return NextResponse.json(
          {
            error: "Invalid ordered_quantity. Must be greater than 0.",
          },
          { status: 400 },
        )
      }
      updateData.ordered_quantity = ordered_quantity
    }

    if (received_quantity !== undefined) updateData.received_quantity = received_quantity

    // Update the item if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 })
    }

    const { data: updatedItem, error: updateError } = await supabaseAdmin
      .from("purchase_order_items")
      .update(updateData)
      .eq("po_id", poId)
      .eq("id", itemId)
      .select(`
        *,
        articles:article_id(id, name, description, unit_of_measurement)
      `)
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    const response = NextResponse.json({
      message: "Item updated successfully",
      item: updatedItem,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error updating purchase order item:", error)
    const response = NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
    return setCorsHeaders(request, response)
  }
}

// Delete a specific item from a purchase order
export async function DELETE(request: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const poId = params.id
    const itemId = params.itemId

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
          error: `Cannot delete items from a ${po.po_status.toLowerCase()} purchase order`,
        },
        { status: 400 },
      )
    }

    // Check if item exists in this purchase order
    const { data: existingItem, error: itemError } = await supabaseAdmin
      .from("purchase_order_items")
      .select("id")
      .eq("po_id", poId)
      .eq("id", itemId)
      .single()

    if (itemError) {
      return NextResponse.json({ error: "Item not found in this purchase order" }, { status: 404 })
    }

    // Delete the item
    const { error: deleteError } = await supabaseAdmin
      .from("purchase_order_items")
      .delete()
      .eq("po_id", poId)
      .eq("id", itemId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    const response = NextResponse.json({
      message: "Item deleted successfully",
      po_id: poId,
      item_id: itemId,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error deleting purchase order item:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request)
}
