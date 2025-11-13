import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { handleCors, setCorsHeaders } from "@/lib/cors"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const id = params.id

    const { data, error } = await supabaseAdmin
      .from("purchase_orders")
      .select(`
        *,
        purchase_order_items(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({ purchase_order: data })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error fetching purchase order:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const id = params.id
    const body = await request.json()
    const { vendor_id, payment_terms, rtv, po_status, inbound_status, validity_date, items } = body

    // Check if purchase order exists
    const { data: existingPO, error: checkError } = await supabaseAdmin
      .from("purchase_orders")
      .select("id, po_status")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
    }

    // Prevent updates to completed or cancelled POs unless changing status back to Draft
    if ((existingPO.po_status === "Completed" || existingPO.po_status === "Cancelled") && po_status !== "Draft") {
      return NextResponse.json(
        {
          error: `Cannot update a ${existingPO.po_status.toLowerCase()} purchase order`,
        },
        { status: 400 },
      )
    }

    // Build update object
    const updateData: any = {}

    // If vendor_id is provided, check if vendor exists
    if (vendor_id) {
      const { data: vendor, error: vendorError } = await supabaseAdmin
        .from("vendors")
        .select("id")
        .eq("id", vendor_id)
        .single()

      if (vendorError) {
        return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
      }

      updateData.vendor_id = vendor_id
    }

    // Validate payment_terms if provided
    if (payment_terms) {
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
      updateData.payment_terms = payment_terms
    }

    // Validate rtv if provided
    if (rtv) {
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
      updateData.rtv = rtv
    }

    // Validate po_status if provided
    if (po_status) {
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
      updateData.po_status = po_status
    }

    // Validate inbound_status if provided
    if (inbound_status) {
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
      updateData.inbound_status = inbound_status
    }

    // Handle validity_date if provided
    if (validity_date !== undefined) {
      if (validity_date === null) {
        updateData.validity_date = null
      } else {
        try {
          updateData.validity_date = new Date(validity_date).toISOString()
        } catch (error) {
          return NextResponse.json(
            {
              error: "Invalid validity date format. Use ISO 8601 format (e.g., 2023-05-15T10:30:00Z)",
            },
            { status: 400 },
          )
        }
      }
    }

    // Update purchase order if there are fields to update
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabaseAdmin.from("purchase_orders").update(updateData).eq("id", id)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    // Handle items update if provided
    if (items && Array.isArray(items)) {
      // Process each item
      for (const item of items) {
        if (item.id) {
          // Update existing item
          if (item._delete === true) {
            // Delete the item
            await supabaseAdmin.from("purchase_order_items").delete().eq("id", item.id).eq("po_id", id)
          } else {
            // Update the item
            const updateItemData: any = {}

            if (item.article_id) {
              // Check if article exists
              const { data: article, error: articleError } = await supabaseAdmin
                .from("articles")
                .select("id")
                .eq("id", item.article_id)
                .single()

              if (articleError) {
                return NextResponse.json(
                  {
                    error: `Article with ID ${item.article_id} not found`,
                  },
                  { status: 404 },
                )
              }

              updateItemData.article_id = item.article_id
            }

            if (item.cost_price !== undefined) updateItemData.cost_price = item.cost_price
            if (item.mrp !== undefined) updateItemData.mrp = item.mrp
            if (item.gst_percentage !== undefined) {
              if (isNaN(Number(item.gst_percentage)) || Number(item.gst_percentage) < 0) {
                return NextResponse.json(
                  {
                    error: `Invalid gst_percentage for item ${item.id}. Must be a non-negative number.`,
                  },
                  { status: 400 },
                )
              }
              updateItemData.gst_percentage = item.gst_percentage
            }
            if (item.ordered_quantity !== undefined) {
              if (item.ordered_quantity <= 0) {
                return NextResponse.json(
                  {
                    error: `Invalid ordered_quantity for item ${item.id}. Must be greater than 0.`,
                  },
                  { status: 400 },
                )
              }
              updateItemData.ordered_quantity = item.ordered_quantity
            }
            if (item.received_quantity !== undefined) updateItemData.received_quantity = item.received_quantity

            if (Object.keys(updateItemData).length > 0) {
              await supabaseAdmin.from("purchase_order_items").update(updateItemData).eq("id", item.id).eq("po_id", id)
            }
          }
        } else if (!item._delete) {
          // Add new item
          if (
            !item.article_id ||
            !item.cost_price ||
            !item.mrp ||
            !item.ordered_quantity ||
            item.gst_percentage === undefined
          ) {
            return NextResponse.json(
              {
                error: "New item is missing required fields",
                requiredFields: ["article_id", "cost_price", "mrp", "ordered_quantity", "gst_percentage"],
              },
              { status: 400 },
            )
          }

          // Validate ordered_quantity is positive
          if (item.ordered_quantity <= 0) {
            return NextResponse.json(
              {
                error: "Invalid ordered_quantity for new item. Must be greater than 0.",
              },
              { status: 400 },
            )
          }

          // Validate gst_percentage is a valid number
          if (isNaN(Number(item.gst_percentage)) || Number(item.gst_percentage) < 0) {
            return NextResponse.json(
              {
                error: "Invalid gst_percentage for new item. Must be a non-negative number.",
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
                error: `Article with ID ${item.article_id} not found`,
              },
              { status: 404 },
            )
          }

          // Add new item
          await supabaseAdmin.from("purchase_order_items").insert({
            po_id: id,
            article_id: item.article_id,
            cost_price: item.cost_price,
            mrp: item.mrp,
            gst_percentage: item.gst_percentage,
            ordered_quantity: item.ordered_quantity,
            received_quantity: item.received_quantity || 0,
          })
        }
      }
    }

    // Get the updated purchase order with items
    const { data, error } = await supabaseAdmin
      .from("purchase_orders")
      .select(`
        *,
        purchase_order_items(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({
      message: "Purchase order updated successfully",
      purchase_order: data,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error updating purchase order:", error)
    const response = NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
    return setCorsHeaders(request, response)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const id = params.id

    // Check if purchase order exists
    const { data: existingPO, error: checkError } = await supabaseAdmin
      .from("purchase_orders")
      .select("id, po_status")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
    }

    // Prevent deletion of approved or completed POs
    if (existingPO.po_status === "Approved" || existingPO.po_status === "Completed") {
      return NextResponse.json(
        {
          error: `Cannot delete a ${existingPO.po_status.toLowerCase()} purchase order. Change status to 'Cancelled' instead.`,
        },
        {
          status: 400,
        },
      )
    }

    // Delete purchase order (cascade will delete items)
    const { error } = await supabaseAdmin.from("purchase_orders").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({
      message: "Purchase order deleted successfully",
      id,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error deleting purchase order:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request)
}
