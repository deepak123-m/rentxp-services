import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { getUserFromRequest } from "@/lib/auth-utils"
import { handleCors, setCorsHeaders } from "@/lib/cors"

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  // If handleCors didn't return a response, create one
  return new NextResponse(null, { status: 204 })
}

// PATCH /api/cart/items/:id - Update an item's quantity in the cart
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  try {
    const itemId = params.id

    // Authenticate user
    const user = await getUserFromRequest(request)
    if (!user) {
      const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
      return setCorsHeaders(request, response)
    }

    // Parse request body
    const body = await request.json()
    const { quantity } = body

    if (typeof quantity !== "number" || quantity < 1) {
      const response = NextResponse.json({ error: "quantity must be a positive number" }, { status: 400 })
      return setCorsHeaders(request, response)
    }

    // Get user's cart
    const { data: cart, error: cartError } = await supabaseAdmin
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (cartError) {
      const response = NextResponse.json({ error: "Cart not found" }, { status: 404 })
      return setCorsHeaders(request, response)
    }

    // Verify item exists and belongs to user's cart
    const { data: item, error: itemError } = await supabaseAdmin
      .from("cart_items")
      .select("id")
      .eq("id", itemId)
      .eq("cart_id", cart.id)
      .single()

    if (itemError || !item) {
      const response = NextResponse.json({ error: "Cart item not found" }, { status: 404 })
      return setCorsHeaders(request, response)
    }

    // Update item quantity
    const { data, error: updateError } = await supabaseAdmin
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId)
      .select(`
        id, 
        quantity, 
        created_at, 
        updated_at,
        product:product_id (
          id, 
          name, 
          description, 
          price, 
          image_url
        )
      `)
      .single()

    if (updateError) {
      const response = NextResponse.json(
        { error: "Failed to update cart item", details: updateError.message },
        { status: 500 },
      )
      return setCorsHeaders(request, response)
    }

    const response = NextResponse.json(data)
    return setCorsHeaders(request, response)
  } catch (error: any) {
    const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// DELETE /api/cart/items/:id - Remove an item from the cart
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  try {
    const itemId = params.id

    // Authenticate user
    const user = await getUserFromRequest(request)
    if (!user) {
      const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
      return setCorsHeaders(request, response)
    }

    // Get user's cart
    const { data: cart, error: cartError } = await supabaseAdmin
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (cartError) {
      const response = NextResponse.json({ error: "Cart not found" }, { status: 404 })
      return setCorsHeaders(request, response)
    }

    // Verify item exists and belongs to user's cart
    const { data: item, error: itemError } = await supabaseAdmin
      .from("cart_items")
      .select("id")
      .eq("id", itemId)
      .eq("cart_id", cart.id)
      .single()

    if (itemError || !item) {
      const response = NextResponse.json({ error: "Cart item not found" }, { status: 404 })
      return setCorsHeaders(request, response)
    }

    // Delete the item
    const { error: deleteError } = await supabaseAdmin.from("cart_items").delete().eq("id", itemId)

    if (deleteError) {
      const response = NextResponse.json(
        { error: "Failed to remove item from cart", details: deleteError.message },
        { status: 500 },
      )
      return setCorsHeaders(request, response)
    }

    const response = NextResponse.json({ message: "Item removed from cart" })
    return setCorsHeaders(request, response)
  } catch (error: any) {
    const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}
