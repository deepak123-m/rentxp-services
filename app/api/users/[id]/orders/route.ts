import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserFromRequest, checkUserRole } from "@/lib/auth-utils"

export const dynamic = "force-dynamic"

/**
 * GET /api/users/:id/orders - Get all orders for a specific user
 *
 * This endpoint allows:
 * - Users to fetch their own orders
 * - Admins to fetch any user's orders
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)
    const sortBy = searchParams.get("sort_by") || "created_at"
    const sortOrder = searchParams.get("sort_order") || "desc"
    const userId = params.id

    // Authenticate the request
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if the user is authorized to view these orders
    // Users can only view their own orders, admins can view any orders
    const isAdmin = await checkUserRole(request, ["admin"])
    if (user.id !== userId && !isAdmin) {
      return NextResponse.json({ error: "You are not authorized to view these orders" }, { status: 403 })
    }

    // Create Supabase client
    const supabase = createClient()

    // Build query
    let query = supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          unit_price,
          products:product_id (
            name,
            image_url
          )
        )
      `)
      .eq("customer_id", userId)
      .range(offset, offset + limit - 1)

    // Apply filters if provided
    if (status) {
      query = query.eq("status", status)
    }

    if (startDate) {
      query = query.gte("created_at", startDate)
    }

    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    // Apply sorting
    if (sortBy && ["created_at", "total_amount", "status", "updated_at"].includes(sortBy)) {
      const order = sortOrder === "asc" ? true : false
      query = query.order(sortBy, { ascending: order })
    }

    // Execute query
    const { data: orders, error, count } = await query

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders: " + error.message }, { status: 500 })
    }

    // Get customer details
    const { data: customerData, error: customerError } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone")
      .eq("id", userId)
      .single()

    if (customerError) {
      console.error("Error fetching customer details:", customerError)
      // Continue without customer details
    }

    // Format the response
    return NextResponse.json({
      orders,
      customer: customerData || { id: userId },
      count: count || orders.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
