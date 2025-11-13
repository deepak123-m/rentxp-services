import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Create a Supabase client with the service role key for storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

// Bucket name for category images
const CATEGORY_IMAGES_BUCKET = "productsimages"

/**
 * Uploads an image to Supabase Storage
 * @param imageBuffer The image buffer to upload
 * @param categoryId The category ID to associate with the image
 * @param contentType The content type of the image
 * @returns The URL of the uploaded image or null if upload failed
 */
async function uploadCategoryImage(
  imageBuffer: Buffer,
  categoryId: string,
  contentType = "image/jpeg",
): Promise<string | null> {
  try {
    // Generate a unique filename
    const fileName = `${uuidv4()}.${contentType.split("/")[1] || "jpg"}`
    const imagePath = `categories/${categoryId}/${fileName}`

    console.log(`Uploading image for category ${categoryId}...`)
    console.log(`Path: ${imagePath}, Size: ${imageBuffer.length} bytes, Type: ${contentType}`)

    // Upload the file using the admin client
    const { data, error } = await adminSupabase.storage.from(CATEGORY_IMAGES_BUCKET).upload(imagePath, imageBuffer, {
      contentType,
      upsert: true,
    })

    if (error) {
      console.error("Error uploading image:", error)
      return null
    }

    console.log("Upload successful:", data)

    // Get the public URL
    const { data: urlData } = adminSupabase.storage.from(CATEGORY_IMAGES_BUCKET).getPublicUrl(imagePath)

    console.log("Image URL:", urlData.publicUrl)
    return urlData.publicUrl
  } catch (error) {
    console.error("Exception in uploadCategoryImage:", error)
    return null
  }
}

// Get all categories
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Parse query parameters
    const url = new URL(request.url)
    const parentId = url.searchParams.get("parent_id")
    const includeInactive = url.searchParams.get("include_inactive") === "true"
    const limit = Number.parseInt(url.searchParams.get("limit") || "100")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    // Build query
    let query = supabase
      .from("categories")
      .select("*, subcategories:categories(id, name, image_url)")
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1)

    // Filter by parent_id if provided
    if (parentId) {
      query = query.eq("parent_id", parentId)
    } else {
      // If no parent_id is provided, return only top-level categories
      query = query.is("parent_id", null)
    }

    // Filter by active status unless includeInactive is true
    if (!includeInactive) {
      query = query.eq("is_active", true)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      categories: data,
      count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Create a new category (admin only)
export async function POST(request: NextRequest) {
  // Check authentication and role
  const authResponse = await withAuth(request, ["admin"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the request is multipart/form-data
    const contentType = request.headers.get("content-type") || ""
    console.log("Request content type:", contentType)

    // Variables to store category data
    let name: string
    let description: string
    let parentId: string | null = null
    let isActive = true
    let imageBuffer: Buffer | null = null
    let imageContentType = "image/jpeg"

    // Handle multipart/form-data (with image upload)
    if (contentType.includes("multipart/form-data")) {
      try {
        // Parse the multipart form data
        const formData = await request.formData()
        console.log("Form data keys:", [...formData.keys()])

        // Extract category data from fields
        name = formData.get("name") as string
        description = formData.get("description") as string
        parentId = (formData.get("parent_id") as string) || null
        isActive = formData.get("is_active") !== "false" // Default to true unless explicitly set to false

        // Get the image file
        const imageFile = formData.get("image") as File | null
        if (imageFile) {
          console.log("Image file details:", {
            name: imageFile.name,
            type: imageFile.type,
            size: imageFile.size,
          })

          // Validate the file type
          if (!imageFile.type.startsWith("image/")) {
            return NextResponse.json({ error: "Uploaded file must be an image" }, { status: 400 })
          }

          // Convert File to Buffer
          const arrayBuffer = await imageFile.arrayBuffer()
          imageBuffer = Buffer.from(arrayBuffer)
          imageContentType = imageFile.type
        }
      } catch (error) {
        console.error("Error processing form data:", error)
        return NextResponse.json(
          {
            error: "Error processing form data",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 },
        )
      }
    }
    // Handle JSON request (with base64 image)
    else {
      try {
        const body = await request.json()
        name = body.name
        description = body.description
        parentId = body.parent_id || null
        isActive = body.is_active !== false // Default to true unless explicitly set to false

        // Process base64 image if provided
        if (body.imageBase64) {
          // Remove the data:image/jpeg;base64, part
          const matches = body.imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

          if (matches && matches.length === 3) {
            imageContentType = matches[1]
            const base64Data = matches[2]
            imageBuffer = Buffer.from(base64Data, "base64")
            console.log("Base64 image processed, size:", imageBuffer.length)
          } else {
            console.error("Invalid base64 image format")
          }
        }
      } catch (error) {
        console.error("Error parsing JSON body:", error)
        return NextResponse.json(
          {
            error: "Error parsing request body",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 400 },
        )
      }
    }

    // Validate input
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // If parentId is provided, check if it exists
    if (parentId) {
      const { data: parentCategory, error: parentError } = await supabase
        .from("categories")
        .select("id")
        .eq("id", parentId)
        .single()

      if (parentError || !parentCategory) {
        return NextResponse.json({ error: "Parent category not found" }, { status: 404 })
      }
    }

    // Create category first without image
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .insert({
        name,
        description,
        parent_id: parentId,
        is_active: isActive,
      })
      .select()
      .single()

    if (categoryError) {
      return NextResponse.json({ error: categoryError.message }, { status: 500 })
    }

    console.log("Category created:", category)

    // Process the image if present
    let imageUrl = null
    let imageUploadError = null

    if (imageBuffer) {
      try {
        // Upload the image
        imageUrl = await uploadCategoryImage(imageBuffer, category.id, imageContentType)

        if (imageUrl) {
          // Update the category with the image URL
          const { error: updateError } = await supabase
            .from("categories")
            .update({ image_url: imageUrl })
            .eq("id", category.id)

          if (updateError) {
            console.warn("Failed to update category with image URL:", updateError)
            imageUploadError = updateError.message
          }
        } else {
          console.error("Image upload failed, URL is null")
          imageUploadError = "Failed to upload image"
        }
      } catch (error) {
        console.error("Error processing image:", error)
        imageUploadError = error instanceof Error ? error.message : String(error)
      }
    }

    return NextResponse.json({
      message: "Category created successfully",
      category: {
        ...category,
        image_url: imageUrl,
      },
      imageUploadError,
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}



//cart-final-before-vendor

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

//     // Calculate cart totals
//     const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

//     const subtotal = cartItems.reduce((sum, item) => sum + item.product.selling_price * item.quantity, 0)

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

