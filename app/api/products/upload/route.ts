import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { uploadMultipleFiles, PRODUCT_IMAGES_BUCKET } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"

// POST /api/products/upload - Create a product with multiple images
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Parse the multipart form data
    const formData = await request.formData()

    // Extract product data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const stock = Number.parseInt((formData.get("stock") as string) || "0")
    const category = formData.get("category") as string
    const categoryId = formData.get("category_id") as string
    const brand = formData.get("brand") as string
    const hsnCode = formData.get("hsn_code") as string

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 })
    }

    // Get the current user (vendor)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Extract images from form data
    const images = formData.getAll("images") as File[]
    let imageUrls: string[] = []

    if (images && images.length > 0) {
      // Prepare files for upload
      const files = await Promise.all(
        images.map(async (image) => {
          const fileExt = image.name.split(".").pop()
          const fileName = `${uuidv4()}.${fileExt}`
          const arrayBuffer = await image.arrayBuffer()

          return {
            file: Buffer.from(arrayBuffer),
            contentType: image.type,
            filename: fileName,
          }
        }),
      )

      // Upload all images
      imageUrls = await uploadMultipleFiles(files, PRODUCT_IMAGES_BUCKET, `products/${uuidv4()}`)

      if (!imageUrls.length && images.length > 0) {
        return NextResponse.json({ error: "Failed to upload images" }, { status: 500 })
      }
    }

    // Create the product
    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        name,
        description,
        price,
        stock,
        category,
        category_id: categoryId || null,
        image_url: imageUrls.length > 0 ? imageUrls[0] : null, // Set first image as main image
        brand,
        hsn_code: hsnCode,
        vendor_id: user.id,
        approval_status: "pending", // New products start as pending
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating product:", insertError)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    // If we have additional images beyond the first one, store them in the product_images table
    if (imageUrls.length > 1) {
      const productImages = imageUrls.slice(1).map((url, index) => ({
        product_id: product.id,
        image_url: url,
        is_primary: false,
      }))

      const { error: imagesError } = await supabase.from("product_images").insert(productImages)

      if (imagesError) {
        console.error("Error storing additional product images:", imagesError)
        // Continue anyway since the product was created successfully
      }
    }

    return NextResponse.json({ product, imageUrls }, { status: 201 })
  } catch (error) {
    console.error("Error in products upload route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
