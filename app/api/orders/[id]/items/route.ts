import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { setCorsHeaders, handleCors } from "@/lib/cors"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Add items to an existing order
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  // Check authentication
  const authResponse = await withAuth(request, ["customer"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const orderId = params.id
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { items } = body

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Request must contain at least one item" }, { status: 400 })
    }

    // Check if the order exists and belongs to the user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("customer_id", session.user.id)
      .single()

    if (orderError) {
      return NextResponse.json({ error: "Order not found or you don't have permission" }, { status: 404 })
    }

    // Check if order is in a state where items can be added
    if (order.status !== "pending") {
      return NextResponse.json({ error: "Items can only be added to orders in 'pending' status" }, { status: 400 })
    }

    // Extract product IDs for validation
    const productIds = items.map((item) => item.product_id)

    // Validate products exist and are in stock
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, price, stock, name")
      .in("id", productIds)
      .eq("approval_status", "approved") // Only approved products can be ordered

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 })
    }

    // Check if all products were found
    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id)
      const missingIds = productIds.filter((id) => !foundIds.includes(id))
      return NextResponse.json(
        {
          error: "Some products were not found or are not approved",
          missingProductIds: missingIds,
        },
        { status: 400 },
      )
    }

    // Create a map of products for easy lookup
    const productMap = products.reduce(
      (map, product) => {
        map[product.id] = product
        return map
      },
      {} as Record<string, any>,
    )

    // Validate quantities and calculate additional amount
    let additionalAmount = 0
    const orderItems = []
    const stockUpdates = []
    const outOfStockItems = []

    for (const item of items) {
      const product = productMap[item.product_id]

      // Validate quantity
      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          {
            error: "Invalid quantity for product",
            productId: item.product_id,
          },
          { status: 400 },
        )
      }

      // Check if product is in stock
      if (product.stock < item.quantity) {
        outOfStockItems.push({
          product_id: item.product_id,
          name: product.name,
          requested: item.quantity,
          available: product.stock,
        })
      }

      // Calculate item total
      const itemTotal = product.price * item.quantity
      additionalAmount += itemTotal

      // Prepare order item
      orderItems.push({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
      })

      // Prepare stock update
      stockUpdates.push({
        id: item.product_id,
        stock: product.stock - item.quantity,
      })
    }

    // Check if any products are out of stock
    if (outOfStockItems.length > 0) {
      return NextResponse.json(
        {
          error: "Some products are out of stock",
          outOfStockItems,
        },
        { status: 400 },
      )
    }

    // Create order items
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // Update product stock
    for (const update of stockUpdates) {
      const { error: stockError } = await supabase.from("products").update({ stock: update.stock }).eq("id", update.id)

      if (stockError) {
        console.error(`Error updating stock for product ${update.id}:`, stockError)
        // Continue with other updates even if one fails
      }
    }

    // Update order total amount
    const newTotalAmount = order.total_amount + additionalAmount
    const { error: updateError } = await supabase
      .from("orders")
      .update({ total_amount: newTotalAmount })
      .eq("id", orderId)

    if (updateError) {
      console.error("Error updating order total:", updateError)
      // Continue even if update fails
    }

    // Get the updated order with items
    const { data: updatedOrder, error: fetchError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          unit_price,
          products (
            id,
            name,
            image_url
          )
        )
      `)
      .eq("id", orderId)
      .single()

    if (fetchError) {
      console.error("Error fetching updated order:", fetchError)
      // Return basic success message if we can't fetch the updated order
      const response = NextResponse.json({
        message: "Items added to order successfully",
        orderId,
        addedItems: orderItems,
        newTotalAmount,
      })
      return setCorsHeaders(request, response)
    }

    const response = NextResponse.json({
      message: "Items added to order successfully",
      order: updatedOrder,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error adding items to order:", error)
    const response = NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
    return setCorsHeaders(request, response)
  }
}

// Remove an item from an order
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  // Check authentication
  const authResponse = await withAuth(request, ["customer"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const orderId = params.id
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse URL to get item ID
    const url = new URL(request.url)
    const itemId = url.searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    // Check if the order exists and belongs to the user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("customer_id", session.user.id)
      .single()

    if (orderError) {
      return NextResponse.json({ error: "Order not found or you don't have permission" }, { status: 404 })
    }

    // Check if order is in a state where items can be removed
    if (order.status !== "pending") {
      return NextResponse.json({ error: "Items can only be removed from orders in 'pending' status" }, { status: 400 })
    }

    // Get the item to be removed
    const { data: item, error: itemError } = await supabase
      .from("order_items")
      .select("*, products(price, stock)")
      .eq("id", itemId)
      .eq("order_id", orderId)
      .single()

    if (itemError) {
      return NextResponse.json({ error: "Item not found in this order" }, { status: 404 })
    }

    // Calculate amount to subtract from order total
    const itemTotal = item.quantity * item.unit_price

    // Delete the item
    const { error: deleteError } = await supabase.from("order_items").delete().eq("id", itemId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Update product stock (add back the quantity)
    const newStock = item.products.stock + item.quantity
    const { error: stockError } = await supabase.from("products").update({ stock: newStock }).eq("id", item.product_id)

    if (stockError) {
      console.error(`Error updating stock for product ${item.product_id}:`, stockError)
      // Continue even if stock update fails
    }

    // Update order total amount
    const newTotalAmount = order.total_amount - itemTotal

    // If this was the last item, delete the order
    if (newTotalAmount <= 0) {
      const { error: deleteOrderError } = await supabase.from("orders").delete().eq("id", orderId)

      if (deleteOrderError) {
        console.error("Error deleting empty order:", deleteOrderError)
        // Continue even if delete fails
      }

      const response = NextResponse.json({
        message: "Item removed and order deleted (no items remaining)",
        orderId,
        itemId,
      })
      return setCorsHeaders(request, response)
    }

    // Otherwise update the order total
    const { error: updateError } = await supabase
      .from("orders")
      .update({ total_amount: newTotalAmount })
      .eq("id", orderId)

    if (updateError) {
      console.error("Error updating order total:", updateError)
      // Continue even if update fails
    }

    // Get the updated order with remaining items
    const { data: updatedOrder, error: fetchError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          unit_price,
          products (
            id,
            name,
            image_url
          )
        )
      `)
      .eq("id", orderId)
      .single()

    if (fetchError) {
      console.error("Error fetching updated order:", fetchError)
      // Return basic success message if we can't fetch the updated order
      const response = NextResponse.json({
        message: "Item removed from order successfully",
        orderId,
        itemId,
        newTotalAmount,
      })
      return setCorsHeaders(request, response)
    }

    const response = NextResponse.json({
      message: "Item removed from order successfully",
      order: updatedOrder,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error removing item from order:", error)
    const response = NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
    return setCorsHeaders(request, response)
  }
}
