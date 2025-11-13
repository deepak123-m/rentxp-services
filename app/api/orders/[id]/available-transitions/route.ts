import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import type { UserRole } from "@/lib/supabase"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Define valid status transitions based on role
const validStatusTransitions: Record<string, Record<string, string[]>> = {
  pending: {
    vendor: ["approved", "rejected"],
    admin: ["approved", "rejected", "cancelled"],
  },
  approved: {
    vendor: ["preparing", "cancelled"],
    admin: ["preparing", "cancelled"],
    customer: ["cancelled"],
  },
  preparing: {
    vendor: ["ready", "cancelled"],
    admin: ["ready", "cancelled"],
  },
  ready: {
    delivery: ["in_transit"],
    admin: ["in_transit", "cancelled"],
  },
  in_transit: {
    delivery: ["delivered", "failed"],
    admin: ["delivered", "failed"],
  },
  // Terminal states - no transitions allowed
  delivered: {
    admin: [], // Only admin can change from terminal states, and only in exceptional cases
  },
  rejected: {
    admin: [],
  },
  cancelled: {
    admin: [],
  },
  failed: {
    admin: ["in_transit"], // Allow retry for failed deliveries
  },
}

// Get available status transitions for an order
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

    const userRole = profile.role as UserRole

    // Get the order with its current status
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderError) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const currentStatus = order.status

    // Check if user has permission to view this order
    if (userRole === "customer" && order.customer_id !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to view this order" }, { status: 403 })
    }

    if (userRole === "vendor") {
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

    if (userRole === "delivery" && order.delivery_boy_id !== session.user.id) {
      // Delivery person can only view orders assigned to them or ready for pickup
      if (order.status !== "ready") {
        return NextResponse.json({ error: "You don't have permission to view this order" }, { status: 403 })
      }
    }

    // Get available transitions for this user's role and the current order status
    const availableTransitions = validStatusTransitions[currentStatus]?.[userRole] || []

    // Get status descriptions
    const statusDescriptions: Record<string, string> = {
      pending: "Order is waiting for vendor approval",
      approved: "Order has been approved by the vendor",
      preparing: "Order is being prepared",
      ready: "Order is ready for pickup by delivery person",
      in_transit: "Order is on the way to the customer",
      delivered: "Order has been successfully delivered",
      rejected: "Order was rejected by the vendor",
      cancelled: "Order was cancelled",
      failed: "Delivery attempt failed",
    }

    // Format transitions with descriptions
    const formattedTransitions = availableTransitions.map((status) => ({
      status,
      description: statusDescriptions[status] || status,
      requires_reason: ["rejected", "cancelled", "failed"].includes(status),
    }))

    return NextResponse.json({
      current_status: currentStatus,
      current_status_description: statusDescriptions[currentStatus] || currentStatus,
      available_transitions: formattedTransitions,
      user_role: userRole,
      order_id: orderId,
    })
  } catch (error) {
    console.error("Error fetching available transitions:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
