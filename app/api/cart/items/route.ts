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

// POST /api/cart/items - Add an item to the cart
export async function POST(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  try {
    // Authenticate user
    const user = await getUserFromRequest(request)
    if (!user) {
      const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
      return setCorsHeaders(request, response)
    }

    // Parse request body
    const body = await request.json()
    const { product_id, quantity = 1 } = body

    if (!product_id) {
      const response = NextResponse.json({ error: "product_id is required" }, { status: 400 })
      return setCorsHeaders(request, response)
    }

    if (typeof quantity !== "number" || quantity < 1) {
      const response = NextResponse.json({ error: "quantity must be a positive number" }, { status: 400 })
      return setCorsHeaders(request, response)
    }

    // Verify product exists
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("id", product_id)
      .single()

    if (productError || !product) {
      const response = NextResponse.json({ error: "Product not found" }, { status: 404 })
      return setCorsHeaders(request, response)
    }

    // Get or create user's cart
    let { data: cart, error: cartError } = await supabaseAdmin
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (cartError && cartError.code === "PGRST116") {
      // Cart not found, create a new one
      const { data: newCart, error: createError } = await supabaseAdmin
        .from("carts")
        .insert({ user_id: user.id })
        .select()
        .single()

      if (createError) {
        const response = NextResponse.json(
          { error: "Failed to create cart", details: createError.message },
          { status: 500 },
        )
        return setCorsHeaders(request, response)
      }

      cart = newCart
    } else if (cartError) {
      const response = NextResponse.json({ error: "Failed to fetch cart", details: cartError.message }, { status: 500 })
      return setCorsHeaders(request, response)
    }

    // Check if item already exists in cart
    const { data: existingItem, error: existingItemError } = await supabaseAdmin
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cart.id)
      .eq("product_id", product_id)
      .single()

    if (existingItemError && existingItemError.code !== "PGRST116") {
      const response = NextResponse.json(
        { error: "Failed to check existing item", details: existingItemError.message },
        { status: 500 },
      )
      return setCorsHeaders(request, response)
    }

    let result

    if (existingItem) {
      // Update existing item quantity
      const newQuantity = existingItem.quantity + quantity

      const { data, error: updateError } = await supabaseAdmin
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id)
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

      result = data
    } else {
      // Add new item to cart
      const { data, error: insertError } = await supabaseAdmin
        .from("cart_items")
        .insert({
          cart_id: cart.id,
          product_id,
          quantity,
        })
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

      if (insertError) {
        const response = NextResponse.json(
          { error: "Failed to add item to cart", details: insertError.message },
          { status: 500 },
        )
        return setCorsHeaders(request, response)
      }

      result = data
    }

    const response = NextResponse.json(result)
    return setCorsHeaders(request, response)
  } catch (error: any) {
    const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}
