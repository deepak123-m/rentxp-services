import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Get order status history
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Get the order
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderError) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if user has permission to view this order
    if (profile.role === "customer" && order.customer_id !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to view this order" }, { status: 403 })
    }

    if (profile.role === "vendor") {
      // Check if vendor has any products in this order
      const { data: orderItems } = await supabase.from("order_items").select("product_id").eq("order_id", orderId)

      if (!orderItems || orderItems.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      const productIds = orderItems.map((item) => item.product_id)

      const { data: vendorProducts, error: vendorError } = await supabase
        .from("products")
        .select("id")
        .eq("vendor_id", session.user.id)
        .in("id", productIds)

      if (vendorError || !vendorProducts || vendorProducts.length === 0) {
        return NextResponse.json({ error: "You don't have permission to view this order" }, { status: 403 })
      }
    }

    if (profile.role === "delivery" && order.delivery_boy_id !== session.user.id) {
      // Delivery person can only view orders assigned to them or ready for pickup
      if (order.status !== "ready") {
        return NextResponse.json({ error: "You don't have permission to view this order" }, { status: 403 })
      }
    }

    // Get order status history from notifications
    const { data: statusHistory, error: historyError } = await supabase
      .from("notifications")
      .select("id, title, message, created_at, type")
      .eq("reference_id", orderId)
      .eq("reference_type", "order_status")
      .order("created_at", { ascending: true })

    if (historyError) {
      console.error("Error fetching order history:", historyError)
      // Continue anyway, we'll just return an empty history
    }

    // Get order items with product details
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        id, 
        quantity, 
        unit_price, 
        products (
          id, 
          name, 
          image_url, 
          vendor_id, 
          profiles:vendor_id (
            id, 
            full_name
          )
        )
      `)
      .eq("order_id", orderId)

    if (itemsError) {
      console.error("Error fetching order items:", itemsError)
    }

    // Get customer details
    const { data: customer, error: customerError } = await supabase
      .from("profiles")
      .select("id, full_name, phone, address")
      .eq("id", order.customer_id)
      .single()

    if (customerError) {
      console.error("Error fetching customer details:", customerError)
    }

    // Get delivery person details if assigned
    let deliveryPerson = null
    if (order.delivery_boy_id) {
      const { data: delivery, error: deliveryError } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .eq("id", order.delivery_boy_id)
        .single()

      if (!deliveryError) {
        deliveryPerson = delivery
      } else {
        console.error("Error fetching delivery person details:", deliveryError)
      }
    }

    return NextResponse.json({
      order: {
        ...order,
        items: items || [],
        customer: customer || null,
        delivery_person: deliveryPerson,
      },
      status_history: statusHistory || [],
      current_status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
    })
  } catch (error) {
    console.error("Error fetching order history:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
