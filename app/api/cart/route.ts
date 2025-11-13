
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



export async function POST(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
      return setCorsHeaders(request, response)
    }

    const body = await request.json()
    let { items } = body

    if (!items || !Array.isArray(items)) {
      const response = NextResponse.json({ error: "Items array is required" }, { status: 400 })
      return setCorsHeaders(request, response)
    }

    // Normalize and validate items
    items = items.map((item) => ({
      ...item,
      is_vendor: typeof item.is_vendor === "boolean" ? item.is_vendor : false,
      vendor_price: typeof item.vendor_price === "number" ? item.vendor_price : 0,
    }))

    for (const item of items) {
      if (!item.product_id) {
        const response = NextResponse.json({ error: "Each item must have a product_id" }, { status: 400 })
        return setCorsHeaders(request, response)
      }

      if (!item.quantity || typeof item.quantity !== "number" || item.quantity < 1) {
        const response = NextResponse.json(
          { error: "Each item must have a positive quantity", product_id: item.product_id },
          { status: 400 }
        )
        return setCorsHeaders(request, response)
      }

      if (item.is_vendor && item.vendor_price < 0) {
        const response = NextResponse.json(
          { error: "Each vendor item must have a valid vendor_price", product_id: item.product_id },
          { status: 400 }
        )
        return setCorsHeaders(request, response)
      }
    }

    const productIds = items.map((item) => item.product_id)
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id")
      .in("id", productIds)

    if (productsError) {
      const response = NextResponse.json(
        { error: "Failed to verify products", details: productsError.message },
        { status: 500 }
      )
      return setCorsHeaders(request, response)
    }

    const foundProductIds = new Set(products.map((p) => p.id))
    const missingProductIds = productIds.filter((id) => !foundProductIds.has(id))

    if (missingProductIds.length > 0) {
      const response = NextResponse.json(
        { error: "Some products were not found", missing_product_ids: missingProductIds },
        { status: 404 }
      )
      return setCorsHeaders(request, response)
    }

    let { data: cart, error: cartError } = await supabaseAdmin
      .from("carts")
      .select("id, created_at")
      .eq("user_id", user.id)
      .single()

    if (cartError && cartError.code === "PGRST116") {
      const { data: newCart, error: createError } = await supabaseAdmin
        .from("carts")
        .insert({ user_id: user.id })
        .select()
        .single()

      if (createError) {
        const response = NextResponse.json(
          { error: "Failed to create cart", details: createError.message },
          { status: 500 }
        )
        return setCorsHeaders(request, response)
      }

      cart = newCart
    } else if (cartError) {
      const response = NextResponse.json(
        { error: "Failed to fetch cart", details: cartError.message },
        { status: 500 }
      )
      return setCorsHeaders(request, response)
    }

    const { error: deleteError } = await supabaseAdmin.from("cart_items").delete().eq("cart_id", cart.id)
    if (deleteError) {
      const response = NextResponse.json(
        { error: "Failed to clear existing cart items", details: deleteError.message },
        { status: 500 }
      )
      return setCorsHeaders(request, response)
    }

    if (items.length > 0) {
      const cartItems = items.map((item) => ({
        cart_id: cart.id,
        product_id: item.product_id,
        quantity: item.quantity,
        is_vendor: item.is_vendor,
        vendor_price: item.is_vendor ? item.vendor_price : null,
      }))

      const { error: insertError } = await supabaseAdmin.from("cart_items").insert(cartItems)

      if (insertError) {
        const response = NextResponse.json(
          { error: "Failed to add items to cart", details: insertError.message },
          { status: 500 }
        )
        return setCorsHeaders(request, response)
      }
    }

    const { data: updatedCartItems, error: itemsError } = await supabaseAdmin
      .from("cart_items")
      .select(`
        id, 
        quantity,
        is_vendor,
        vendor_price,
        created_at,
        updated_at,
        product:product_id (
          id,
          name,
          description,
          price,
          selling_price,
          image_url
        )
      `)
      .eq("cart_id", cart.id)

    if (itemsError) {
      const response = NextResponse.json(
        { error: "Failed to fetch updated cart items", details: itemsError.message },
        { status: 500 }
      )
      return setCorsHeaders(request, response)
    }

    const itemCount = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = updatedCartItems.reduce((sum, item) => {
      const price = item.is_vendor ? item.vendor_price : item.product.selling_price
      return sum + price * item.quantity
    }, 0)

    const response = NextResponse.json({
      id: cart?.id,
      created_at: cart?.created_at,
      updated_at: new Date().toISOString(),
      items: updatedCartItems,
      item_count: itemCount,
      subtotal: subtotal,
      message: "Cart updated successfully",
    })

    return setCorsHeaders(request, response)
  } catch (error: any) {
    console.error("Error in POST /api/cart:", error)
    const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}