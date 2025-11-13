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


export async function GET(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  try {
    // Authenticate user using getUserFromRequest
    const user = await getUserFromRequest(request)
    if (!user) {
      const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
      return setCorsHeaders(request, response)
    }

    // Check if user has a cart, create one if not
    let { data: cart, error: cartError } = await supabaseAdmin
      .from("carts")
      .select("*")
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
          { status: 500 },
        )
        return setCorsHeaders(request, response)
      }

      cart = newCart
    } else if (cartError) {
      const response = NextResponse.json(
        { error: "Failed to fetch cart", details: cartError.message },
        { status: 500 },
      )
      return setCorsHeaders(request, response)
    }

    // Get cart items with product details, and is_vendor/vendor_price from cart_items
    const { data: cartItems, error: itemsError } = await supabaseAdmin
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
          image_url,
          stock
        )
      `)
      .eq("cart_id", cart.id)

    if (itemsError) {
      const response = NextResponse.json(
        { error: "Failed to fetch cart items", details: itemsError.message },
        { status: 500 },
      )
      return setCorsHeaders(request, response)
    }

    // Calculate item count and subtotal based on cart_item's is_vendor flag
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.is_vendor ? item.vendor_price : item.product.selling_price
      return sum + price * item.quantity
    }, 0)

    const response = NextResponse.json({
      id: cart.id,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
      items: cartItems,
      item_count: itemCount,
      subtotal: subtotal,
    })

    return setCorsHeaders(request, response)
  } catch (error: any) {
    const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}
// DELETE /api/cart - Clear the entire cart
export async function DELETE(request: NextRequest) {
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

    // Get user's cart
    const { data: cart, error: cartError } = await supabaseAdmin
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (cartError) {
      if (cartError.code === "PGRST116") {
        // Cart not found, nothing to delete
        const response = NextResponse.json({ message: "Cart is already empty" })
        return setCorsHeaders(request, response)
      }

      const response = NextResponse.json({ error: "Failed to fetch cart", details: cartError.message }, { status: 500 })
      return setCorsHeaders(request, response)
    }

    // Delete all cart items
    const { error: deleteError } = await supabaseAdmin.from("cart_items").delete().eq("cart_id", cart.id)

    if (deleteError) {
      const response = NextResponse.json(
        { error: "Failed to clear cart", details: deleteError.message },
        { status: 500 },
      )
      return setCorsHeaders(request, response)
    }

    const response = NextResponse.json({ message: "Cart cleared successfully" })
    return setCorsHeaders(request, response)
  } catch (error: any) {
    const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}


export async function PATCH(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
      return setCorsHeaders(request, response)
    }

    const { item_id, quantity } = await request.json()

    if (!item_id || typeof quantity !== "number" || quantity < 1) {
      const response = NextResponse.json({ error: "Invalid item_id or quantity" }, { status: 400 })
      return setCorsHeaders(request, response)
    }

    const { data, error } = await supabaseAdmin
      .from("cart_items")
      .update({ quantity })
      .eq("id", item_id)
      .select()
      .single()

    if (error) {
      const response = NextResponse.json({ error: "Failed to update cart item", details: error.message }, { status: 500 })
      return setCorsHeaders(request, response)
    }

    const response = NextResponse.json({ message: "Item updated", item: data })
    return setCorsHeaders(request, response)
  } catch (error: any) {
    const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}


//----------cart delete before deploy only delete items

// export async function DELETE(request: NextRequest) {
//   // Handle CORS preflight
//   const corsResponse = handleCors(request)
//   if (corsResponse) {
//     return corsResponse
//   }

//   try {
//     // Authenticate user using getUserFromRequest
//     const user = await getUserFromRequest(request)
//     if (!user) {
//       const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
//       return setCorsHeaders(request, response)
//     }

//     // Get user's cart
//     const { data: cart, error: cartError } = await supabaseAdmin
//       .from("carts")
//       .select("id")
//       .eq("user_id", user.id)
//       .single()

//     if (cartError) {
//       if (cartError.code === "PGRST116") {
//         // Cart not found, nothing to delete
//         const response = NextResponse.json({ message: "Cart is already empty" })
//         return setCorsHeaders(request, response)
//       }

//       const response = NextResponse.json({ error: "Failed to fetch cart", details: cartError.message }, { status: 500 })
//       return setCorsHeaders(request, response)
//     }

//     // Delete all cart items
//     const { error: deleteError } = await supabaseAdmin.from("cart_items").delete().eq("cart_id", cart.id)

//     if (deleteError) {
//       const response = NextResponse.json(
//         { error: "Failed to clear cart", details: deleteError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     const response = NextResponse.json({ message: "Cart cleared successfully" })
//     return setCorsHeaders(request, response)
//   } catch (error: any) {
//     const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
//     return setCorsHeaders(request, response)
//   }
// }



///---------------------alll cart before


// import { type NextRequest, NextResponse } from "next/server"
// import { supabaseAdmin } from "@/lib/supabase"
// import { getUserFromRequest } from "@/lib/auth-utils"
// import { handleCors, setCorsHeaders } from "@/lib/cors"

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// // Handle OPTIONS request for CORS preflight
// export async function OPTIONS(request: NextRequest) {
//   const corsResponse = handleCors(request)
//   if (corsResponse) {
//     return corsResponse
//   }

//   // If handleCors didn't return a response, create one
//   return new NextResponse(null, { status: 204 })
// }

// // GET /api/cart - Get the current user's cart with items
// export async function GET(request: NextRequest) {
//   // Handle CORS preflight
//   const corsResponse = handleCors(request)
//   if (corsResponse) {
//     return corsResponse
//   }

//   try {
//     // Authenticate user using getUserFromRequest
//     const user = await getUserFromRequest(request)
//     if (!user) {
//       const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
//       return setCorsHeaders(request, response)
//     }

//     // Check if user has a cart, create one if not
//     let { data: cart, error: cartError } = await supabaseAdmin
//       .from("carts")
//       .select("*")
//       .eq("user_id", user.id)
//       .single()

//     if (cartError && cartError.code === "PGRST116") {
//       const { data: newCart, error: createError } = await supabaseAdmin
//         .from("carts")
//         .insert({ user_id: user.id })
//         .select()
//         .single()

//       if (createError) {
//         const response = NextResponse.json(
//           { error: "Failed to create cart", details: createError.message },
//           { status: 500 },
//         )
//         return setCorsHeaders(request, response)
//       }

//       cart = newCart
//     } else if (cartError) {
//       const response = NextResponse.json(
//         { error: "Failed to fetch cart", details: cartError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     // Get cart items with product details, and is_vendor/vendor_price from cart_items
//     const { data: cartItems, error: itemsError } = await supabaseAdmin
//       .from("cart_items")
//       .select(`
//         id,
//         quantity,
//         is_vendor,
//         vendor_price,
//         created_at,
//         updated_at,
//         product:product_id (
//           id,
//           name,
//           description,
//           price,
//           selling_price,
//           image_url,
//           stock
//         )
//       `)
//       .eq("cart_id", cart.id)

//     if (itemsError) {
//       const response = NextResponse.json(
//         { error: "Failed to fetch cart items", details: itemsError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     // Calculate item count and subtotal based on cart_item's is_vendor flag
//     const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

//     const subtotal = cartItems.reduce((sum, item) => {
//       const price = item.is_vendor ? item.vendor_price : item.product.selling_price
//       return sum + price * item.quantity
//     }, 0)

//     const response = NextResponse.json({
//       id: cart.id,
//       created_at: cart.created_at,
//       updated_at: cart.updated_at,
//       items: cartItems,
//       item_count: itemCount,
//       subtotal: subtotal,
//     })

//     return setCorsHeaders(request, response)
//   } catch (error: any) {
//     const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
//     return setCorsHeaders(request, response)
//   }
// }

// // POST /api/cart - Set the entire cart contents
// export async function POST(request: NextRequest) {
//   // Handle CORS preflight
//   const corsResponse = handleCors(request)
//   if (corsResponse) {
//     return corsResponse
//   }

//   try {
//     // Authenticate user using getUserFromRequest
//     const user = await getUserFromRequest(request)
//     if (!user) {
//       const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
//       return setCorsHeaders(request, response)
//     }

//     // Parse request body
//     const body = await request.json()
//     const { items } = body

//     if (!items || !Array.isArray(items)) {
//       const response = NextResponse.json({ error: "Items array is required" }, { status: 400 })
//       return setCorsHeaders(request, response)
//     }

//     // Validate items
//     for (const item of items) {
//       if (!item.product_id) {
//         const response = NextResponse.json({ error: "Each item must have a product_id" }, { status: 400 })
//         return setCorsHeaders(request, response)
//       }

//       if (!item.quantity || typeof item.quantity !== "number" || item.quantity < 1) {
//         const response = NextResponse.json(
//           { error: "Each item must have a positive quantity", product_id: item.product_id },
//           { status: 400 },
//         )
//         return setCorsHeaders(request, response)
//       }
//     }

//     // Verify all products exist
//     const productIds = items.map((item) => item.product_id)
//     const { data: products, error: productsError } = await supabaseAdmin
//       .from("products")
//       .select("id")
//       .in("id", productIds)

//     if (productsError) {
//       const response = NextResponse.json(
//         { error: "Failed to verify products", details: productsError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     // Check if all products were found
//     const foundProductIds = new Set(products.map((p) => p.id))
//     const missingProductIds = productIds.filter((id) => !foundProductIds.has(id))

//     if (missingProductIds.length > 0) {
//       const response = NextResponse.json(
//         { error: "Some products were not found", missing_product_ids: missingProductIds },
//         { status: 404 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     // Get or create user's cart
//     let { data: cart, error: cartError } = await supabaseAdmin
//       .from("carts")
//       .select("id")
//       .eq("user_id", user.id)
//       .single()

//     if (cartError && cartError.code === "PGRST116") {
//       // Cart not found, create a new one
//       const { data: newCart, error: createError } = await supabaseAdmin
//         .from("carts")
//         .insert({ user_id: user.id })
//         .select()
//         .single()

//       if (createError) {
//         const response = NextResponse.json(
//           { error: "Failed to create cart", details: createError.message },
//           { status: 500 },
//         )
//         return setCorsHeaders(request, response)
//       }

//       cart = newCart
//     } else if (cartError) {
//       const response = NextResponse.json({ error: "Failed to fetch cart", details: cartError.message }, { status: 500 })
//       return setCorsHeaders(request, response)
//     }

//     // Clear existing cart items
//     const { error: deleteError } = await supabaseAdmin.from("cart_items").delete().eq("cart_id", cart.id)

//     if (deleteError) {
//       const response = NextResponse.json(
//         { error: "Failed to clear existing cart items", details: deleteError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     // Add new items to cart
//     if (items.length > 0) {
//       const cartItems = items.map((item) => ({
//         cart_id: cart.id,
//         product_id: item.product_id,
//         quantity: item.quantity,
//       }))

//       const { error: insertError } = await supabaseAdmin.from("cart_items").insert(cartItems)

//       if (insertError) {
//         const response = NextResponse.json(
//           { error: "Failed to add items to cart", details: insertError.message },
//           { status: 500 },
//         )
//         return setCorsHeaders(request, response)
//       }
//     }

//     // Get updated cart with items
//     const { data: updatedCartItems, error: itemsError } = await supabaseAdmin
//       .from("cart_items")
//       .select(`
//         id, 
//         quantity, 
//         created_at, 
//         updated_at,
//         product:product_id (
//           id, 
//           name, 
//           description, 
//           price, 
//           image_url
//         )
//       `)
//       .eq("cart_id", cart.id)

//     if (itemsError) {
//       const response = NextResponse.json(
//         { error: "Failed to fetch updated cart items", details: itemsError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     // Calculate cart totals
//     const itemCount = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0)
//     const subtotal = updatedCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

//     const response = NextResponse.json({
//       id: cart.id,
//       created_at: cart.created_at,
//       updated_at: new Date().toISOString(),
//       items: updatedCartItems,
//       item_count: itemCount,
//       subtotal: subtotal,
//       message: "Cart updated successfully",
//     })

//     return setCorsHeaders(request, response)
//   } catch (error: any) {
//     console.error("Error in POST /api/cart:", error)
//     const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 }) 
//     return setCorsHeaders(request, response)
//   }
// }

// export async function DELETE(request: NextRequest) {
//   const corsResponse = handleCors(request);
//   if (corsResponse) return corsResponse;
 
//   try {
//     const user = await getUserFromRequest(request);
//     if (!user) {
//       const response = NextResponse.json({ error: "Authentication required" }, { status: 401 });
//       return setCorsHeaders(request, response);
//     }

//     const { data: cart, error: cartError } = await supabaseAdmin
//       .from("carts")
//       .select("id")
//       .eq("user_id", user.id)
//       .single();

//     if (cartError) {
//       if (cartError.code === "PGRST116") {
//         const response = NextResponse.json({ message: "Cart is already empty" });
//         return setCorsHeaders(request, response);
//       }

//       const response = NextResponse.json({ error: "Failed to fetch cart", details: cartError.message }, { status: 500 });
//       return setCorsHeaders(request, response);
//     }

//     // Delete all cart_items first
//     const { error: deleteItemsError } = await supabaseAdmin
//       .from("cart_items")
//       .delete()
//       .eq("cart_id", cart.id);

//     if (deleteItemsError) {
//       const response = NextResponse.json({ error: "Failed to delete cart items", details: deleteItemsError.message }, { status: 500 });
//       return setCorsHeaders(request, response);
//     }

//     // Now delete the cart itself
//     const { error: deleteCartError } = await supabaseAdmin
//       .from("carts")
//       .delete()
//       .eq("id", cart.id);

//     if (deleteCartError) {
//       const response = NextResponse.json({ error: "Failed to delete cart", details: deleteCartError.message }, { status: 500 });
//       return setCorsHeaders(request, response);
//     }

//     const response = NextResponse.json({ message: "Cart and items cleared successfully" });
//     return setCorsHeaders(request, response);
//   } catch (error: any) {
//     const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
//     return setCorsHeaders(request, response);
//   }
// }


// export async function PATCH(request: NextRequest) {
//   const corsResponse = handleCors(request)
//   if (corsResponse) return corsResponse

//   try {
//     const user = await getUserFromRequest(request)
//     if (!user) {
//       const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
//       return setCorsHeaders(request, response)
//     }

//     const { product_id, quantity } = await request.json()

//     if (!product_id || typeof quantity !== "number" || quantity < 1) {
//       const response = NextResponse.json({ error: "Invalid product_id or quantity" }, { status: 400 })
//       return setCorsHeaders(request, response)
//     }

//     // Get user's cart
//     let { data: cart, error: cartError } = await supabaseAdmin
//       .from("carts")
//       .select("id")
//       .eq("user_id", user.id)
//       .single()

//     if (cartError && cartError.code === "PGRST116") {
//       // Cart not found, create a new one
//       const { data: newCart, error: createError } = await supabaseAdmin
//         .from("carts")
//         .insert({ user_id: user.id })
//         .select()
//         .single()

//       if (createError) {
//         const response = NextResponse.json(
//           { error: "Failed to create cart", details: createError.message },
//           { status: 500 },
//         )
//         return setCorsHeaders(request, response)
//       }

//       cart = newCart
//     } else if (cartError) {
//       const response = NextResponse.json({ error: "Failed to fetch cart", details: cartError.message }, { status: 500 })
//       return setCorsHeaders(request, response)
//     }

//     // Check if the product is already in the cart
//     const { data: existingItem, error: existingItemError } = await supabaseAdmin
//       .from("cart_items")
//       .select("id, quantity")
//       .eq("cart_id", cart.id)
//       .eq("product_id", product_id)
//       .maybeSingle()

//     if (existingItemError) {
//       const response = NextResponse.json(
//         { error: "Failed to check existing cart items", details: existingItemError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     if (existingItem) {
//       // Product exists in cart → update quantity
//       const newQuantity = existingItem.quantity + quantity

//       const { error: updateError } = await supabaseAdmin
//         .from("cart_items")
//         .update({ quantity: newQuantity })
//         .eq("id", existingItem.id)

//       if (updateError) {
//         const response = NextResponse.json(
//           { error: "Failed to update cart item quantity", details: updateError.message },
//           { status: 500 },
//         )
//         return setCorsHeaders(request, response)
//       }
//     } else {
//       // Product not in cart → insert new item
//       const { error: insertError } = await supabaseAdmin.from("cart_items").insert({
//         cart_id: cart.id,
//         product_id,
//         quantity,
//       })

//       if (insertError) {
//         const response = NextResponse.json(
//           { error: "Failed to add new item to cart", details: insertError.message },
//           { status: 500 },
//         )
//         return setCorsHeaders(request, response)
//       }
//     }

//     const response = NextResponse.json({ message: "Cart updated successfully" })
//     return setCorsHeaders(request, response)

//   } catch (error: any) {
//     console.error("Error in PATCH /api/cart:", error)
//     const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
//     return setCorsHeaders(request, response)
//   }  
// }




//-------------finallllllllllllllllllllllllllllllllllll---safeeeeeeeeeeeeeeeeeeee

// import { type NextRequest, NextResponse } from "next/server"
// import { supabaseAdmin } from "@/lib/supabase"
// import { getUserFromRequest } from "@/lib/auth-utils"
// import { handleCors, setCorsHeaders } from "@/lib/cors"

// // Handle OPTIONS request for CORS preflight
// export async function OPTIONS(request: NextRequest) {
//   const corsResponse = handleCors(request)
//   if (corsResponse) {
//     return corsResponse
//   }

//   // If handleCors didn't return a response, create one
//   return new NextResponse(null, { status: 204 })
// }

// // GET /api/cart - Get the current user's cart with items
// export async function GET(request: NextRequest) {
//   // Handle CORS preflight
//   const corsResponse = handleCors(request)
//   if (corsResponse) {
//     return corsResponse
//   }

//   try {
//     // Authenticate user
//     const user = await getUserFromRequest(request)
//     if (!user) {
//       const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
//       return setCorsHeaders(request, response)
//     }

//     // Check if user has a cart, create one if not
//     let { data: cart, error: cartError } = await supabaseAdmin.from("carts").select("*").eq("user_id", user.id).single()

//     if (cartError && cartError.code === "PGRST116") {
//       // Cart not found, create a new one
//       const { data: newCart, error: createError } = await supabaseAdmin
//         .from("carts")
//         .insert({ user_id: user.id })
//         .select()
//         .single()

//       if (createError) {
//         const response = NextResponse.json(
//           { error: "Failed to create cart", details: createError.message },
//           { status: 500 },
//         )
//         return setCorsHeaders(request, response)
//       }

//       cart = newCart
//     } else if (cartError) {
//       const response = NextResponse.json({ error: "Failed to fetch cart", details: cartError.message }, { status: 500 })
//       return setCorsHeaders(request, response)
//     }

//     // Get cart items with product details
//     const { data: cartItems, error: itemsError } = await supabaseAdmin
//       .from("cart_items")
//       .select(`
//         id, 
//         quantity, 
//         created_at, 
//         updated_at,
//         product:product_id (
//           id, 
//           name, 
//           description, 
//           price, 
//           image_url
//         )
//       `)
//       .eq("cart_id", cart.id)

//     if (itemsError) {
//       const response = NextResponse.json(
//         { error: "Failed to fetch cart items", details: itemsError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     // Calculate cart totals
//     const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

//     const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

//     const response = NextResponse.json({
//       id: cart.id,
//       created_at: cart.created_at,
//       updated_at: cart.updated_at,
//       items: cartItems,
//       item_count: itemCount,
//       subtotal: subtotal,
//     })

//     return setCorsHeaders(request, response)
//   } catch (error: any) {
//     const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
//     return setCorsHeaders(request, response)
//   }
// }



// export async function POST(request: NextRequest) {
//   // Handle CORS preflight
//   const corsResponse = handleCors(request)
//   if (corsResponse) {
//     return corsResponse
//   }

//   try {
//     // Authenticate user using getUserFromRequest
//     const user = await getUserFromRequest(request)
//     if (!user) {
//       const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
//       return setCorsHeaders(request, response)
//     }

//     // Parse request body
//     const body = await request.json()
//     const { items } = body

//     if (!items || !Array.isArray(items)) {
//       const response = NextResponse.json({ error: "Items array is required" }, { status: 400 })
//       return setCorsHeaders(request, response)
//     }

//     // Validate items
//     for (const item of items) {
//       if (!item.product_id) {
//         const response = NextResponse.json({ error: "Each item must have a product_id" }, { status: 400 })
//         return setCorsHeaders(request, response)
//       }

//       if (!item.quantity || typeof item.quantity !== "number" || item.quantity < 1) {
//         const response = NextResponse.json(
//           { error: "Each item must have a positive quantity", product_id: item.product_id },
//           { status: 400 },
//         )
//         return setCorsHeaders(request, response)
//       }
//     }

//     // Verify all products exist
//     const productIds = items.map((item) => item.product_id)
//     const { data: products, error: productsError } = await supabaseAdmin
//       .from("products")
//       .select("id")
//       .in("id", productIds)

//     if (productsError) {
//       const response = NextResponse.json(
//         { error: "Failed to verify products", details: productsError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     // Check if all products were found
//     const foundProductIds = new Set(products.map((p) => p.id))
//     const missingProductIds = productIds.filter((id) => !foundProductIds.has(id))

//     if (missingProductIds.length > 0) {
//       const response = NextResponse.json(
//         { error: "Some products were not found", missing_product_ids: missingProductIds },
//         { status: 404 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     // Get or create user's cart
//     let { data: cart, error: cartError } = await supabaseAdmin
//       .from("carts")
//       .select("id")
//       .eq("user_id", user.id)
//       .single()

//     if (cartError && cartError.code === "PGRST116") {
//       // Cart not found, create a new one
//       const { data: newCart, error: createError } = await supabaseAdmin
//         .from("carts")
//         .insert({ user_id: user.id })
//         .select()
//         .single()

//       if (createError) {
//         const response = NextResponse.json(
//           { error: "Failed to create cart", details: createError.message },
//           { status: 500 },
//         )
//         return setCorsHeaders(request, response)
//       }

//       cart = newCart
//     } else if (cartError) {
//       const response = NextResponse.json({ error: "Failed to fetch cart", details: cartError.message }, { status: 500 })
//       return setCorsHeaders(request, response)
//     }

//     // Clear existing cart items
//     const { error: deleteError } = await supabaseAdmin.from("cart_items").delete().eq("cart_id", cart.id)

//     if (deleteError) {
//       const response = NextResponse.json(
//         { error: "Failed to clear existing cart items", details: deleteError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     // Add new items to cart
//     if (items.length > 0) {
//       const cartItems = items.map((item) => ({
//         cart_id: cart.id,
//         product_id: item.product_id,
//         quantity: item.quantity,
//       }))

//       const { error: insertError } = await supabaseAdmin.from("cart_items").insert(cartItems)

//       if (insertError) {
//         const response = NextResponse.json(
//           { error: "Failed to add items to cart", details: insertError.message },
//           { status: 500 },
//         )
//         return setCorsHeaders(request, response)
//       }
//     }

//     // Get updated cart with items
//     const { data: updatedCartItems, error: itemsError } = await supabaseAdmin
//       .from("cart_items")
//       .select(`
//         id, 
//         quantity, 
//         created_at, 
//         updated_at,
//         product:product_id (
//           id, 
//           name, 
//           description, 
//           price, 
//           image_url
//         )
//       `)
//       .eq("cart_id", cart.id)

//     if (itemsError) {
//       const response = NextResponse.json(
//         { error: "Failed to fetch updated cart items", details: itemsError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     // Calculate cart totals
//     const itemCount = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0)
//     const subtotal = updatedCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

//     const response = NextResponse.json({
//       id: cart.id,
//       created_at: cart.created_at,
//       updated_at: new Date().toISOString(),
//       items: updatedCartItems,
//       item_count: itemCount,
//       subtotal: subtotal,
//       message: "Cart updated successfully",
//     })

//     return setCorsHeaders(request, response)
//   } catch (error: any) {
//     console.error("Error in POST /api/cart:", error)
//     const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 }) 
//     return setCorsHeaders(request, response)
//   }
// }

// // DELETE /api/cart - Clear the entire cart
// export async function DELETE(request: NextRequest) {
//   // Handle CORS preflight
//   const corsResponse = handleCors(request)
//   if (corsResponse) {
//     return corsResponse
//   }

//   try {
//     // Authenticate user
//     const user = await getUserFromRequest(request)
//     if (!user) {
//       const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
//       return setCorsHeaders(request, response)
//     }

//     // Get user's cart
//     const { data: cart, error: cartError } = await supabaseAdmin
//       .from("carts")
//       .select("id")
//       .eq("user_id", user.id)
//       .single()

//     if (cartError) {
//       if (cartError.code === "PGRST116") {
//         // Cart not found, nothing to delete
//         const response = NextResponse.json({ message: "Cart is already empty" })
//         return setCorsHeaders(request, response)
//       }

//       const response = NextResponse.json({ error: "Failed to fetch cart", details: cartError.message }, { status: 500 })
//       return setCorsHeaders(request, response)
//     }

//     // Delete all cart items
//     const { error: deleteError } = await supabaseAdmin.from("cart_items").delete().eq("cart_id", cart.id)

//     if (deleteError) {
//       const response = NextResponse.json(
//         { error: "Failed to clear cart", details: deleteError.message },
//         { status: 500 },
//       )
//       return setCorsHeaders(request, response)
//     }

//     const response = NextResponse.json({ message: "Cart cleared successfully" })
//     return setCorsHeaders(request, response)
//   } catch (error: any) {
//     const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
//     return setCorsHeaders(request, response)
//   }
// }


// export async function PATCH(request: NextRequest) {
//   const corsResponse = handleCors(request)
//   if (corsResponse) return corsResponse

//   try {
//     const user = await getUserFromRequest(request)
//     if (!user) {
//       const response = NextResponse.json({ error: "Authentication required" }, { status: 401 })
//       return setCorsHeaders(request, response)
//     }

//     const { item_id, quantity } = await request.json()

//     if (!item_id || typeof quantity !== "number" || quantity < 1) {
//       const response = NextResponse.json({ error: "Invalid item_id or quantity" }, { status: 400 })
//       return setCorsHeaders(request, response)
//     }

//     const { data, error } = await supabaseAdmin
//       .from("cart_items")
//       .update({ quantity })
//       .eq("id", item_id)                       
//       .select()
//       .single()

//     if (error) {
//       const response = NextResponse.json({ error: "Failed to update cart item", details: error.message }, { status: 500 })
//       return setCorsHeaders(request, response)
//     }

//     const response = NextResponse.json({ message: "Item updated", item: data })
//     return setCorsHeaders(request, response)
//   } catch (error: any) {
//     const response = NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
//     return setCorsHeaders(request, response)
//   }
// }


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