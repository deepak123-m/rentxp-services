import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { setCorsHeaders, handleCors } from "@/lib/cors"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Cancel an order
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  // Check authentication
  const authResponse = await withAuth(request)
  if (authResponse.status === 401) {
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

    // Get user profile with role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()
    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Parse request body for cancellation reason
    const body = await request.json().catch(() => ({}))
    const { reason } = body || {}

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(product_id, quantity)")
      .eq("id", orderId)
      .single()

    if (orderError) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check permissions based on role and order status
    if (profile.role === "customer" && order.customer_id !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to cancel this order" }, { status: 403 })
    }

    // Customers can only cancel pending or approved orders
    if (profile.role === "customer" && !["pending", "approved"].includes(order.status)) {
      return NextResponse.json(
        { error: "Orders can only be cancelled when in 'pending' or 'approved' status" },
        { status: 400 },
      )
    }

    // Vendors can cancel orders in pending, approved, or preparing status
    if (profile.role === "vendor" && !["pending", "approved", "preparing"].includes(order.status)) {
      return NextResponse.json(
        { error: "Orders can only be cancelled when in 'pending', 'approved', or 'preparing' status" },
        { status: 400 },
      )
    }

    // If vendor, check if they have products in this order
    if (profile.role === "vendor") {
      // Get vendor's products
      const { data: vendorProducts } = await supabase.from("products").select("id").eq("vendor_id", session.user.id)

      if (!vendorProducts || vendorProducts.length === 0) {
        return NextResponse.json({ error: "You don't have permission to cancel this order" }, { status: 403 })
      }

      const vendorProductIds = vendorProducts.map((p) => p.id)
      const orderHasVendorProducts = order.order_items.some((item: any) => vendorProductIds.includes(item.product_id))

      if (!orderHasVendorProducts) {
        return NextResponse.json({ error: "You don't have permission to cancel this order" }, { status: 403 })
      }
    }

    // Update order status to cancelled
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        status_reason: reason || "No reason provided",
      })
      .eq("id", orderId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Restore product stock
    for (const item of order.order_items) {
      // Get current product stock
      const { data: product } = await supabase.from("products").select("stock").eq("id", item.product_id).single()

      if (product) {
        // Update stock (add back the quantity)
        const newStock = product.stock + item.quantity
        await supabase.from("products").update({ stock: newStock }).eq("id", item.product_id)
      }
    }

    // Create notification for customer if cancelled by vendor or admin
    if (profile.role !== "customer") {
      try {
        await supabase.from("notifications").insert({
          user_id: order.customer_id,
          title: "Order Cancelled",
          message: `Your order #${orderId} has been cancelled. Reason: ${reason || "No reason provided"}`,
          type: "error",
          reference_id: orderId,
          reference_type: "order_status",
        })
      } catch (notificationError) {
        console.error("Error creating customer notification:", notificationError)
        // Continue even if notification fails
      }
    }

    // Create notifications for vendors if cancelled by customer
    if (profile.role === "customer") {
      try {
        // Get unique vendor IDs from the ordered products
        const { data: orderProducts } = await supabase
          .from("order_items")
          .select("products(vendor_id)")
          .eq("order_id", orderId)

        if (orderProducts) {
          const vendorIds = [...new Set(orderProducts.map((item: any) => item.products?.vendor_id).filter(Boolean))]

          // Create notifications for each vendor
          for (const vendorId of vendorIds) {
            await supabase.from("notifications").insert({
              user_id: vendorId,
              title: "Order Cancelled",
              message: `Order #${orderId} has been cancelled by the customer. Reason: ${reason || "No reason provided"}`,
              type: "info",
              reference_id: orderId,
              reference_type: "order_status",
            })
          }
        }
      } catch (notificationError) {
        console.error("Error creating vendor notifications:", notificationError)
        // Continue even if notifications fail
      }
    }

    const response = NextResponse.json({
      message: "Order cancelled successfully",
      orderId,
      status: "cancelled",
      reason: reason || "No reason provided",
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error cancelling order:", error)
    const response = NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
    return setCorsHeaders(request, response)
  }
}
