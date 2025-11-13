import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServerSupabaseClient } from "@/lib/auth"
import { getUserFromRequest, checkUserRole } from "@/lib/auth-utils"

export const dynamic = "force-dynamic"

// GET /api/orders - List all orders with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const customerId = searchParams.get("customer_id")
    const deliveryBoyId = searchParams.get("delivery_boy_id")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const minAmount = searchParams.get("min_amount")
    const maxAmount = searchParams.get("max_amount")
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)
    const sortBy = searchParams.get("sort_by") || "created_at"
    const sortOrder = searchParams.get("sort_order") || "desc"

    // Authenticate the request
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check user role for authorization
    const isAdmin = await checkUserRole(request, ["admin"])
    const isDelivery = await checkUserRole(request, ["delivery"])

    // Create Supabase client
    const supabase = createClient()

    // Build query
    let query = supabase
      .from("orders")
      .select(
        `
        *,
        customer:customer_id (
          id,
          full_name,
          
          phone
        ),
        delivery_boy:delivery_boy_id (
          id,
          full_name,
        
          phone
        ),
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
      `,
        { count: "exact" },
      )
      .range(offset, offset + limit - 1)

    // Apply role-based filters
    if (!isAdmin) {
      if (isDelivery) {
        // Delivery personnel can only see orders assigned to them
        query = query.eq("delivery_boy_id", user.id)
      } else {
        // Regular customers can only see their own orders
        query = query.eq("customer_id", user.id)
      }
    } else if (customerId) {
      // Admins can filter by customer_id if provided
      query = query.eq("customer_id", customerId)
    }

    // Apply additional filters if provided
    if (status) {
      query = query.eq("status", status)
    }

    if (deliveryBoyId && isAdmin) {
      query = query.eq("delivery_boy_id", deliveryBoyId)
    }

    if (startDate) {
      query = query.gte("created_at", startDate)
    }

    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    if (minAmount) {
      query = query.gte("total_amount", minAmount)
    }

    if (maxAmount) {
      query = query.lte("total_amount", maxAmount)
    }

    // Apply sorting
    if (sortBy && ["created_at", "total_amount", "status", "updated_at"].includes(sortBy)) {
      const order = sortOrder === "asc" ? true : false
      query = query.order(sortBy, { ascending: order })
    }

    const { data: orders, error, count } = await query

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders: " + error.message }, { status: 500 })
    }

    return NextResponse.json({
      orders,
      count: count || orders.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    // Log all headers for debugging
    console.log("Request headers:")
    const headersObj: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headersObj[key] = value
      console.log(`${key}: ${value}`)
    })

    // Get token directly from Authorization header
    const authHeader = request.headers.get("authorization") || ""
    console.log("Authorization header:", authHeader)

    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null

    console.log("Extracted token:", token ? `${token.substring(0, 10)}...` : "No token")

    // Try to authenticate with the token
    let userId = null
    let userRole = "customer"

    if (token) {
      console.log("Attempting authentication with token")
      try {
        const supabase = createServerSupabaseClient()
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(token)

        if (error) {
          console.error("Token validation error:", error)
          return NextResponse.json({ error: "Invalid authentication token", details: error.message }, { status: 401 })
        }

        if (user) {
          console.log("User authenticated:", user.id)
          userId = user.id
          userRole = user.user_metadata?.role || "customer"
        }
      } catch (authError) {
        console.error("Error during authentication:", authError)
        return NextResponse.json({ error: "Authentication error: " + String(authError) }, { status: 401 })
      }
    }

    if (!userId) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: "Valid authentication token required",
        },
        { status: 401 },
      )
    }

    // Continue with the order creation
    return createOrder(request, userId, userRole)
  } catch (error) {
    console.error("Error in order creation endpoint:", error)
    return NextResponse.json(
      { error: "Failed to process order request: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}

// Replace the existing createOrder function with this updated version that fetches the minimum order value from the database

async function createOrder(request: NextRequest, userId: string, userRole: string) {
  try {
    // Parse request body
    const body = await request.json()

    console.log("Request body:", JSON.stringify(body, null, 2))

    // Create Supabase client
    const supabase = createClient()

    // Fetch the latest store configuration
    const { data: configData, error: configError } = await supabase
      .from("store_configurations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // Default minimum order value if no configuration exists
    let minimumOrderValue = 0
    let minimumOrderEnabled = false

    if (configError) {
      console.warn("Error fetching store configuration:", configError.message)
      // Continue with default values
    } else if (configData) {
      minimumOrderValue = configData.minimum_order_value
      minimumOrderEnabled = configData.minimum_order_enabled
    }

    // Check minimum order value if enabled
    if (minimumOrderEnabled && body.total_amount && body.total_amount < minimumOrderValue) {
      return NextResponse.json({ error: `Minimum amount to place order is ${minimumOrderValue}` }, { status: 400 })
    }

    // Validate required fields based on the database schema
    if (!body.total_amount || !body.delivery_address) {
      return NextResponse.json({ error: "Missing required fields: total_amount, delivery_address" }, { status: 400 })
    }

     const { data: customersData, error: customerError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()


    if (body.total_amount >= 50000 && customersData?.new_onboard) {
  console.log("Applying ₹500 discount for high-value order")
  body.total_amount -= 500
}

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: userId,
        total_amount: body.total_amount,
        delivery_address: body.delivery_address,
        status: "pending", // Default status
        delivery_boy_id: null, // Will be assigned later
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order: " + orderError.message }, { status: 500 })
    }

    console.log("Order created successfully:", order.id)

    // If order items are provided, create them
    let orderItems = []
    if (body.order_items && Array.isArray(body.order_items) && body.order_items.length > 0) {
      const orderItemsData = body.order_items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
      }))

      console.log("Creating order items:", orderItemsData.length)

      const { data: items, error: itemsError } = await supabase.from("order_items").insert(orderItemsData).select()

      if (itemsError) {
        // If there's an error with order items, we should delete the order
        console.error("Error creating order items:", itemsError)
        await supabase.from("orders").delete().eq("id", order.id)

        return NextResponse.json({ error: "Failed to create order items: " + itemsError.message }, { status: 500 })
      }

      console.log("Order items created successfully")
      orderItems = items
    }

    // Try to fetch the complete order with items
    try {
      // First try to get customer details
      const { data: customerData, error: customerError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", userId)
        .single()

      if (customerError) {
        console.error("Error fetching customer details:", customerError)
        // Continue without customer details
      }

      // Then try to get order items if not already fetched
      if (!orderItems.length && body.order_items?.length) {
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id)

        if (!itemsError) {
          orderItems = itemsData
        } else {
          console.error("Error fetching order items:", itemsError)
        }
      }

      // Construct the complete order response
      const completeOrder = {
        ...order,
        customer: customerData || { id: userId },
        order_items: orderItems,
      }

   const { data: updatedProfile, error: profileError } = await supabase
  .from("profiles")
  .update({ new_onboard: false })
  .eq("id", userId)
  .select() // fetch the updated row
  .single() // since it's one user

console.log("userid", userId)

if (profileError) {
  return NextResponse.json(
    { error: "Failed to update profile", details: profileError.message },
    { status: 500 }
  )
}

return NextResponse.json(                
  {
    message: "Order created successfully",
    order: completeOrder,
    profile: updatedProfile, // include profile in response
  },
  { status: 201 }
)

    } catch (fetchError) {
      console.error("Error constructing complete order:", fetchError)

      // Return basic order info as fallback
      return NextResponse.json(
        {
          message: "Order created successfully",
          order: {
            ...order,
            order_items: orderItems,
          },
          note: "Some related details could not be fetched",
        },
        { status: 201 },
      )
    }
  } catch (error) {
    console.error("Error in createOrder function:", error)
    return NextResponse.json(
      { error: "Failed to create order: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
