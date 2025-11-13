// import { type NextRequest, NextResponse } from "next/server"
// import { createClient } from "@/lib/supabase/server"
// import { getUserFromRequest } from "@/lib/auth-utils";

// // GET /api/orders/:id - Get a specific order by ID
// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // Get authenticated user info from request headers (set by middleware)
//     const orderId = await params.id

//     // Get authenticated user info from request headers (set by middleware)
//     const user = await getUserFromRequest(request)
//    const userRole = user?.role;
//     const userId = user?.id || null;

//     if (!userId) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
//     }

//     // Create Supabase client
//     const supabase = createClient()

//     // Fetch the order with its items and related profiles
//     const { data: order, error } = await supabase
//       .from("orders")
//       .select(`
//         *,
//         customer:profiles!orders_customer_id_fkey(id, full_name, email),
//         delivery_boy:profiles!orders_delivery_boy_id_fkey(id, full_name, email),
//         order_items(
//           *,
//           product:products(id, name, description, price, image_url)
//         )
//       `)
//       .eq("id", orderId)
//       .single()

//     if (error) {
//       console.error("Error fetching order:", error)
//       if (error.code === "PGRST116") {
//         return NextResponse.json({ error: "Order not found" }, { status: 404 })
//       }
//       return NextResponse.json({ error: "Failed to fetch order: " + error.message }, { status: 500 })
//     }

//     // Check if user has permission to access this order
//     if (
//       ((userRole === "user" || userRole === "customer") && order.customer_id !== userId) ||
//       (userRole === "delivery" && order.delivery_boy_id !== userId)
//     ) {
//       return NextResponse.json({ error: "You do not have permission to access this order" }, { status: 403 })
//     }

//     return NextResponse.json({ order })
//   } catch (error) {
//     console.error("Error fetching order:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch order: " + (error instanceof Error ? error.message : String(error)) },
//       { status: 500 },
//     )
//   }
// }

// // PATCH /api/orders/:id - Update an existing order
// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const orderId = params.id

//     // Get authenticated user info from request headers (set by middleware)
//     const userId = request.headers.get("x-user-id")
//     const userRole = request.headers.get("x-user-role") || "user"

//     if (!userId) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
//     }

//     // Create Supabase client
//     const supabase = createClient()

//     // Fetch the current order
//     const { data: order, error: fetchError } = await supabase.from("orders").select("*").eq("id", orderId).single()

//     if (fetchError) {
//       console.error("Error fetching order:", fetchError)
//       if (fetchError.code === "PGRST116") {
//         return NextResponse.json({ error: "Order not found" }, { status: 404 })
//       }
//       return NextResponse.json({ error: "Failed to fetch order: " + fetchError.message }, { status: 500 })
//     }

//     // Check if user has permission to update this order
//     if (
//       ((userRole === "user" || userRole === "customer") && order.customer_id !== userId) ||
//       (userRole === "delivery" && order.delivery_boy_id !== userId && userRole !== "admin")
//     ) {
//       return NextResponse.json({ error: "You do not have permission to update this order" }, { status: 403 })
//     }

//     // Parse request body
//     const body = await request.json()

//     // Prepare update data
//     const updateData: any = {}

//     // Only allow certain fields to be updated based on role
//     if (userRole === "admin") {
//       // Admins can update any field
//       if (body.delivery_address !== undefined) updateData.delivery_address = body.delivery_address
//       if (body.total_amount !== undefined) updateData.total_amount = body.total_amount
//       if (body.status !== undefined) updateData.status = body.status
//       if (body.delivery_boy_id !== undefined) updateData.delivery_boy_id = body.delivery_boy_id
//     } else if (userRole === "delivery") {
//       // Delivery personnel can only update status
//       if (body.status !== undefined) {
//         // Validate status transitions for delivery personnel
//         const validTransitions: Record<string, string[]> = {
//           pending: ["in_progress"],
//           in_progress: ["out_for_delivery"],
//           out_for_delivery: ["delivered"],
//         }

//         if (!validTransitions[order.status]?.includes(body.status)) {
//           return NextResponse.json(
//             { error: `Invalid status transition from ${order.status} to ${body.status}` },
//             { status: 400 },
//           )
//         }

//         updateData.status = body.status
//       }
//     } else if (userRole === "user" || userRole === "customer") {
//       // Users can only update delivery_address and cancel their orders
//       if (body.delivery_address !== undefined) updateData.delivery_address = body.delivery_address

//       if (body.status === "cancelled" && ["pending", "in_progress"].includes(order.status)) {
//         updateData.status = "cancelled"
//       } else if (body.status !== undefined && body.status !== order.status) {
//         return NextResponse.json(
//           { error: "Users can only cancel orders that are pending or in progress" },
//           { status: 400 },
//         )
//       }
//     }

//     // If there's nothing to update, return early
//     if (Object.keys(updateData).length === 0) {
//       return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
//     }

//     // Update the order
//     const { data: updatedOrder, error: updateError } = await supabase
//       .from("orders")
//       .update(updateData)
//       .eq("id", orderId)
//       .select()
//       .single()

//     if (updateError) {
//       console.error("Error updating order:", updateError)
//       return NextResponse.json({ error: "Failed to update order: " + updateError.message }, { status: 500 })
//     }

//     return NextResponse.json({
//       message: "Order updated successfully",
//       order: updatedOrder,
//     })
//   } catch (error) {
//     console.error("Error updating order:", error)
//     return NextResponse.json(
//       { error: "Failed to update order: " + (error instanceof Error ? error.message : String(error)) },
//       { status: 500 },
//     )
//   }
// }

// // DELETE /api/orders/:id - Delete an order
// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const orderId = params.id

//     // Get authenticated user info from request headers (set by middleware)
//     const userId = request.headers.get("x-user-id")
//     const userRole = request.headers.get("x-user-role") || "user"

//     if (!userId) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
//     }

//     // Create Supabase client
//     const supabase = createClient()

//     // Fetch the current order
//     const { data: order, error: fetchError } = await supabase.from("orders").select("*").eq("id", orderId).single()

//     if (fetchError) {
//       console.error("Error fetching order:", fetchError)
//       if (fetchError.code === "PGRST116") {
//         return NextResponse.json({ error: "Order not found" }, { status: 404 })
//       }
//       return NextResponse.json({ error: "Failed to fetch order: " + fetchError.message }, { status: 500 })
//     }

//     // Check if user has permission to delete this order
//     // Only admins or the order owner can delete an order that is pending
//     if (userRole !== "admin" && (order.customer_id !== userId || order.status !== "pending")) {
//       return NextResponse.json({ error: "You do not have permission to delete this order" }, { status: 403 })
//     }

//     // Delete order (cascade will delete order_items)
//     const { error: deleteError } = await supabase.from("orders").delete().eq("id", orderId)

//     if (deleteError) {
//       console.error("Error deleting order:", deleteError)
//       return NextResponse.json({ error: "Failed to delete order: " + deleteError.message }, { status: 500 })
//     }

//     return NextResponse.json({
//       message: "Order deleted successfully",
//     })
//   } catch (error) {
//     console.error("Error deleting order:", error)
//     return NextResponse.json(
//       { error: "Failed to delete order: " + (error instanceof Error ? error.message : String(error)) },
//       { status: 500 },
//     )
//   }
// }


// //----------Before deploy cors

// // import { type NextRequest, NextResponse } from "next/server"
// // import { createClient } from "@/lib/supabase/server"
// // import { getUserFromRequest } from "@/lib/auth-utils"

// // // GET /api/orders/:id - Get a specific order by ID
// // export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
// //   try {
// //     // Get authenticated user info from request headers (set by middleware)
// //     const orderId = await params.id

// //     // Get authenticated user info from request headers (set by middleware)
// //     const user = await getUserFromRequest(request)
// //     const userRole = user?.role
// //     const userId = user?.id || null

// //     if (!userId) {
// //       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
// //     }

// //     // Create Supabase client
// //     const supabase = createClient()

// //     // Fetch the order with its items and related profiles
// //     const { data: order, error } = await supabase
// //       .from("orders")
// //       .select(`
// //         *,
// //         customer:profiles!orders_customer_id_fkey(id, full_name, email),
// //         delivery_boy:profiles!orders_delivery_boy_id_fkey(id, full_name, email),
// //         order_items(
// //           *,
// //           product:products(id, name, description, price, image_url)
// //         )
// //       `)
// //       .eq("id", orderId)
// //       .single()

// //     if (error) {
// //       console.error("Error fetching order:", error)
// //       if (error.code === "PGRST116") {
// //         return NextResponse.json({ error: "Order not found" }, { status: 404 })
// //       }
// //       return NextResponse.json({ error: "Failed to fetch order: " + error.message }, { status: 500 })
// //     }

// //     // Check if user has permission to access this order
// //     if (
// //       ((userRole === "user" || userRole === "customer") && order.customer_id !== userId) ||
// //       (userRole === "delivery" && order.delivery_boy_id !== userId)
// //     ) {
// //       return NextResponse.json({ error: "You do not have permission to access this order" }, { status: 403 })
// //     }

// //     return NextResponse.json({ order })
// //   } catch (error) {
// //     console.error("Error fetching order:", error)
// //     return NextResponse.json(
// //       { error: "Failed to fetch order: " + (error instanceof Error ? error.message : String(error)) },
// //       { status: 500 },
// //     )
// //   }
// // }

// // // PATCH /api/orders/:id - Update an existing order
// // export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
// //   try {
// //     const orderId = params.id

// //     // Get authenticated user info from request headers (set by middleware)
// //     const userId = request.headers.get("x-user-id")
// //     const userRole = request.headers.get("x-user-role") || "user"

// //     if (!userId) {
// //       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
// //     }

// //     // Create Supabase client
// //     const supabase = createClient()

// //     // Fetch the current order
// //     const { data: order, error: fetchError } = await supabase.from("orders").select("*").eq("id", orderId).single()

// //     if (fetchError) {
// //       console.error("Error fetching order:", fetchError)
// //       if (fetchError.code === "PGRST116") {
// //         return NextResponse.json({ error: "Order not found" }, { status: 404 })
// //       }
// //       return NextResponse.json({ error: "Failed to fetch order: " + fetchError.message }, { status: 500 })
// //     }

// //     // Check if user has permission to update this order
// //     if (
// //       ((userRole === "user" || userRole === "customer") && order.customer_id !== userId) ||
// //       (userRole === "delivery" && order.delivery_boy_id !== userId && userRole !== "admin")
// //     ) {
// //       return NextResponse.json({ error: "You do not have permission to update this order" }, { status: 403 })
// //     }

// //     // Parse request body
// //     const body = await request.json()

// //     // Prepare update data
// //     const updateData: any = {}

// //     // Only allow certain fields to be updated based on role
// //     if (userRole === "admin") {
// //       // Admins can update any field
// //       if (body.delivery_address !== undefined) updateData.delivery_address = body.delivery_address
// //       if (body.total_amount !== undefined) updateData.total_amount = body.total_amount
// //       if (body.status !== undefined) updateData.status = body.status
// //       if (body.delivery_boy_id !== undefined) updateData.delivery_boy_id = body.delivery_boy_id
// //     } else if (userRole === "delivery") {
// //       // Delivery personnel can only update status
// //       if (body.status !== undefined) {
// //         // Validate status transitions for delivery personnel
// //         const validTransitions: Record<string, string[]> = {
// //           pending: ["in_progress"],
// //           in_progress: ["out_for_delivery"],
// //           out_for_delivery: ["delivered"],
// //         }

// //         if (!validTransitions[order.status]?.includes(body.status)) {
// //           return NextResponse.json(
// //             { error: `Invalid status transition from ${order.status} to ${body.status}` },
// //             { status: 400 },
// //           )
// //         }

// //         updateData.status = body.status
// //       }
// //     } else if (userRole === "user" || userRole === "customer") {
// //       // Users can only update delivery_address and cancel their orders
// //       if (body.delivery_address !== undefined) updateData.delivery_address = body.delivery_address

// //       if (body.status === "cancelled" && ["pending", "in_progress"].includes(order.status)) {
// //         updateData.status = "cancelled"
// //       } else if (body.status !== undefined && body.status !== order.status) {
// //         return NextResponse.json(
// //           { error: "Users can only cancel orders that are pending or in progress" },
// //           { status: 400 },
// //         )
// //       }
// //     }

// //     // If there's nothing to update, return early
// //     if (Object.keys(updateData).length === 0) {
// //       return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
// //     }

// //     // Update the order
// //     const { data: updatedOrder, error: updateError } = await supabase
// //       .from("orders")
// //       .update(updateData)
// //       .eq("id", orderId)
// //       .select()
// //       .single()

// //     if (updateError) {
// //       console.error("Error updating order:", updateError)
// //       return NextResponse.json({ error: "Failed to update order: " + updateError.message }, { status: 500 })
// //     }

// //     return NextResponse.json({
// //       message: "Order updated successfully",
// //       order: updatedOrder,
// //     })
// //   } catch (error) {
// //     console.error("Error updating order:", error)
// //     return NextResponse.json(
// //       { error: "Failed to update order: " + (error instanceof Error ? error.message : String(error)) },
// //       { status: 500 },
// //     )
// //   }
// // }

// // // DELETE /api/orders/:id - Delete an order
// // export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
// //   try {
// //     const orderId = params.id

// //     // Get authenticated user info from request headers (set by middleware)
// //     const userId = request.headers.get("x-user-id")
// //     const userRole = request.headers.get("x-user-role") || "user"

// //     if (!userId) {
// //       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
// //     }

// //     // Create Supabase client
// //     const supabase = createClient()

// //     // Fetch the current order
// //     const { data: order, error: fetchError } = await supabase.from("orders").select("*").eq("id", orderId).single()

// //     if (fetchError) {
// //       console.error("Error fetching order:", fetchError)
// //       if (fetchError.code === "PGRST116") {
// //         return NextResponse.json({ error: "Order not found" }, { status: 404 })
// //       }
// //       return NextResponse.json({ error: "Failed to fetch order: " + fetchError.message }, { status: 500 })
// //     }

// //     // Check if user has permission to delete this order
// //     // Only admins or the order owner can delete an order that is pending
// //     if (userRole !== "admin" && (order.customer_id !== userId || order.status !== "pending")) {
// //       return NextResponse.json({ error: "You do not have permission to delete this order" }, { status: 403 })
// //     }

// //     // Delete order (cascade will delete order_items)
// //     const { error: deleteError } = await supabase.from("orders").delete().eq("id", orderId)

// //     if (deleteError) {
// //       console.error("Error deleting order:", deleteError)
// //       return NextResponse.json({ error: "Failed to delete order: " + deleteError.message }, { status: 500 })
// //     }

// //     return NextResponse.json({
// //       message: "Order deleted successfully",
// //     })
// //   } catch (error) {
// //     console.error("Error deleting order:", error)
// //     return NextResponse.json(
// //       { error: "Failed to delete order: " + (error instanceof Error ? error.message : String(error)) },
// //       { status: 500 },
// //     )
// //   }
// // }

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserFromRequest } from "@/lib/auth-utils"
import { handleCors, setCorsHeaders } from "@/lib/cors"

// Utility to return JSON with CORS headers
function corsJson(req: NextRequest, body: any, status = 200) {
  const res = NextResponse.json(body, { status })
  return setCorsHeaders(req, res)
}

// OPTIONS: Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return handleCors(request) ?? new NextResponse(null, { status: 204 })
}

// GET /api/orders/:id - Get order details
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    const user = await getUserFromRequest(request)
    const userRole = user?.role
    const userId = user?.id || null

    if (!userId) {
      return corsJson(request, { error: "Authentication required" }, 401)
    }

    const supabase = createClient()

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        customer:profiles!orders_customer_id_fkey(id, full_name, email),
        delivery_boy:profiles!orders_delivery_boy_id_fkey(id, full_name, email),
        order_items(
          *,
          product:products(id, name, description, price, image_url)
        )
      `)
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("Error fetching order:", error)
      if (error.code === "PGRST116") {
        return corsJson(request, { error: "Order not found" }, 404)
      }
      return corsJson(request, { error: "Failed to fetch order: " + error.message }, 500)
    }

    if (
      ((userRole === "user" || userRole === "customer") && order.customer_id !== userId) ||
      (userRole === "delivery" && order.delivery_boy_id !== userId)
    ) {
      return corsJson(request, { error: "You do not have permission to access this order" }, 403)
    }

    return corsJson(request, { order })
  } catch (error) {
    console.error("Error:", error)
    return corsJson(
      request,
      { error: "Failed to fetch order: " + (error instanceof Error ? error.message : String(error)) },
      500
    )
  }
}

// PATCH /api/orders/:id - Update an existing order
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") || "user"

    if (!userId) {
      return corsJson(request, { error: "Authentication required" }, 401)
    }

    const supabase = createClient()

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()

    if (fetchError) {
      console.error("Error fetching order:", fetchError)
      if (fetchError.code === "PGRST116") {
        return corsJson(request, { error: "Order not found" }, 404)
      }
      return corsJson(request, { error: "Failed to fetch order: " + fetchError.message }, 500)
    }

    if (
      ((userRole === "user" || userRole === "customer") && order.customer_id !== userId) ||
      (userRole === "delivery" && order.delivery_boy_id !== userId && userRole !== "admin")
    ) {
      return corsJson(request, { error: "You do not have permission to update this order" }, 403)
    }

    const body = await request.json()
    const updateData: any = {}

    if (userRole === "admin") {
      if (body.delivery_address !== undefined) updateData.delivery_address = body.delivery_address
      if (body.total_amount !== undefined) updateData.total_amount = body.total_amount
      if (body.status !== undefined) updateData.status = body.status
      if (body.delivery_boy_id !== undefined) updateData.delivery_boy_id = body.delivery_boy_id
    } else if (userRole === "delivery") {
      const validTransitions: Record<string, string[]> = {
        pending: ["in_progress"],
        in_progress: ["out_for_delivery"],
        out_for_delivery: ["delivered"],
      }
      if (!validTransitions[order.status]?.includes(body.status)) {
        return corsJson(
          request,
          { error: `Invalid status transition from ${order.status} to ${body.status}` },
          400
        )
      }
      updateData.status = body.status
    } else if (userRole === "user" || userRole === "customer") {
      if (body.delivery_address !== undefined) updateData.delivery_address = body.delivery_address
      if (body.status === "cancelled" && ["pending", "in_progress"].includes(order.status)) {
        updateData.status = "cancelled"
      } else if (body.status !== undefined && body.status !== order.status) {
        return corsJson(
          request,
          { error: "Users can only cancel orders that are pending or in progress" },
          400
        )
      }
    }

    if (Object.keys(updateData).length === 0) {
      return corsJson(request, { error: "No valid fields to update" }, 400)
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating order:", updateError)
      return corsJson(request, { error: "Failed to update order: " + updateError.message }, 500)
    }

    return corsJson(request, {
      message: "Order updated successfully",
      order: updatedOrder,
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return corsJson(
      request,
      { error: "Failed to update order: " + (error instanceof Error ? error.message : String(error)) },
      500
    )
  }
}

// DELETE /api/orders/:id - Delete an order
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") || "user"

    if (!userId) {
      return corsJson(request, { error: "Authentication required" }, 401)
    }

    const supabase = createClient()

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()

    if (fetchError) {
      console.error("Error fetching order:", fetchError)
      if (fetchError.code === "PGRST116") {
        return corsJson(request, { error: "Order not found" }, 404)
      }
      return corsJson(request, { error: "Failed to fetch order: " + fetchError.message }, 500)
    }

    if (userRole !== "admin" && (order.customer_id !== userId || order.status !== "pending")) {
      return corsJson(request, { error: "You do not have permission to delete this order" }, 403)
    }

    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId)

    if (deleteError) {
      console.error("Error deleting order:", deleteError)
      return corsJson(request, { error: "Failed to delete order: " + deleteError.message }, 500)
    }

    return corsJson(request, { message: "Order deleted successfully" })
  } catch (error) {
    console.error("Error deleting order:", error)
    return corsJson(
      request,
      { error: "Failed to delete order: " + (error instanceof Error ? error.message : String(error)) },
      500
    )
  }
}

// POST /api/orders/:id - Return full order details (same as GET)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
  

   

    const supabase = createClient()

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        customer:profiles!orders_customer_id_fkey(id, full_name, email),
        delivery_boy:profiles!orders_delivery_boy_id_fkey(id, full_name, email),
        order_items(
          *,
          product:products(id, name, description, price, image_url)
        )
      `)
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("Error fetching order:", error)
      if (error.code === "PGRST116") {
        return corsJson(request, { error: "Order not found" }, 404)
      }
      return corsJson(request, { error: "Failed to fetch order: " + error.message }, 500)
    }

  

    return corsJson(request, { order })
  } catch (error) {
    console.error("Error:", error)
    return corsJson(
      request,
      { error: "Failed to fetch order: " + (error instanceof Error ? error.message : String(error)) },
      500
    )
  }
}




// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // Get authenticated user info from request headers (set by middleware)
//     const orderId = await params.id

//     // Get authenticated user info from request headers (set by middleware)
//     const user = await getUserFromRequest(request)
//     const userRole = user?.role
//     const userId = user?.id || null

//     if (!userId) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
//     }

//     // Create Supabase client
//     const supabase = createClient()

//     // Fetch the order with its items and related profiles
//     const { data: order, error } = await supabase
//       .from("orders")
//       .select(`
//         *,
//         customer:profiles!orders_customer_id_fkey(id, full_name, email),
//         delivery_boy:profiles!orders_delivery_boy_id_fkey(id, full_name, email),
//         order_items(
//           *,
//           product:products(id, name, description, price, image_url)
//         )
//       `)
//       .eq("id", orderId)
//       .single()

//     if (error) {
//       console.error("Error fetching order:", error)
//       if (error.code === "PGRST116") {
//         return NextResponse.json({ error: "Order not found" }, { status: 404 })
//       }
//       return NextResponse.json({ error: "Failed to fetch order: " + error.message }, { status: 500 })
//     }

//     // Check if user has permission to access this order
//     if (
//       ((userRole === "user" || userRole === "customer") && order.customer_id !== userId) ||
//       (userRole === "delivery" && order.delivery_boy_id !== userId)
//     ) {
//       return NextResponse.json({ error: "You do not have permission to access this order" }, { status: 403 })
//     }

//     return NextResponse.json({ order })
//   } catch (error) {
//     console.error("Error fetching order:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch order: " + (error instanceof Error ? error.message : String(error)) },
//       { status: 500 },
//     )
//   }
// }

