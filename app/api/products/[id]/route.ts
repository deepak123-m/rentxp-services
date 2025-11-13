import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { uploadFile, deleteFile, getPathFromUrl, PRODUCT_IMAGES_BUCKET } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"

// GET /api/products/[id] - Get a single product by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = createRouteHandlerClient({ cookies })

    const { data: product, error } = await supabase
      .from("products")
      .select(`
    *,
    categories:category_id (id, name),
    vendor_articlestwo(
      id,
      vendor_id,
      stock,
      price,
      vendors(
        id,
        name,
        email,
        is_active,
        vendor_code,
        vendor_type,
        contact_number
      )
    )
  `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
      console.error("Error fetching product:", error)
      return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }

    // Transform the product data to include vendor details
    const vendors =
      product.vendor_articlestwo?.map((va: any) => ({
        id: va.id,
        vendor_id: va.vendor_id,
        stock: va.stock,
        price: va.price,
        vendor: {
          id: va.vendors.id,
          name: va.vendors.name,
          email: va.vendors.email,
          is_active: va.vendors.is_active,
          vendor_code: va.vendors.vendor_code,
          vendor_type: va.vendors.vendor_type,
          contact_number: va.vendors.contact_number,
        },
      })) || []

    // Calculate vendor statistics
    const vendorPrices = vendors.map((v) => v.price).filter((p) => p > 0)
    const vendorStocks = vendors.map((v) => v.stock)

    // Keep all original product fields and add vendor information
    const transformedProduct = {
      ...product,
      // Remove the nested vendor_articlestwo from the response since we're adding a cleaner vendors array
      vendor_articlestwo: undefined,
      // Add the formatted vendor information
      vendors: vendors,
      vendorCount: vendors.length,
      lowestVendorPrice: vendorPrices.length > 0 ? Math.min(...vendorPrices) : 0,
      highestVendorPrice: vendorPrices.length > 0 ? Math.max(...vendorPrices) : 0,
      totalVendorStock: vendorStocks.reduce((sum, stock) => sum + stock, 0),
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error("Error in product GET route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

const BUCKET = "productsimages"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const productId = params.id

  // Fetch existing product
  const { data: existingProduct, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single()

  if (fetchError || !existingProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  let updateData: Record<string, any> = {}
  let imageBuffer: Buffer | null = null
  let imageType = "image/jpeg"
  let imageExt = "jpg"

  const contentType = request.headers.get("content-type") || ""

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData()

    updateData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      category: formData.get("category"),
      category_id: formData.get("category_id") || null,
      brand: formData.get("brand"),
      hsn_code: formData.get("hsn_code"),
    }

    const imageFile = formData.get("image") as File
    if (imageFile && imageFile.size > 0) {
      imageBuffer = Buffer.from(await imageFile.arrayBuffer())
      imageType = imageFile.type
      imageExt = imageType.split("/")[1] || "jpg"
    }
  } else {
    const json = await request.json()
    updateData = {
      name: json.name,
      description: json.description,
      price: json.price,
      stock: json.stock,
      category: json.category,
      category_id: json.category_id || null,
      brand: json.brand,
      hsn_code: json.hsn_code,
    }

    if (json.image) {
      const matches = json.image.match(/^data:(.+);base64,(.+)$/)
      if (matches?.length === 3) {
        imageType = matches[1]
        imageExt = imageType.split("/")[1] || "jpg"
        try {
          imageBuffer = Buffer.from(matches[2], "base64")
        } catch (e) {
          console.error("Invalid base64 image", e)
          return NextResponse.json({ error: "Invalid base64 image" }, { status: 400 })
        }
      }
    }
  }

  // Handle image upload if present
  if (imageBuffer) {
    const fileName = `${uuidv4()}.${imageExt}`
    const filePath = `products/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, imageBuffer, {
        contentType: imageType,
        upsert: true,
      })

    if (uploadError) {
      console.error("Image upload failed", uploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(filePath)

    updateData.image_url = publicUrl

    // Delete old image if it exists
    if (existingProduct.image_url) {
      const parts = existingProduct.image_url.split(`/${BUCKET}/`)
      const oldPath = parts[1]
      if (oldPath) {
        await supabase.storage.from(BUCKET).remove([oldPath])
      }
    }
  }

  // Update the product
  const { error: updateError } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)

  if (updateError) {
    console.error("Product update failed", updateError)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }

  return NextResponse.json({ message: "Product updated successfully" }, { status: 200 })
}



export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    // Check if the product exists and belongs to the user (or user is admin)
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
      console.error("Error fetching product:", fetchError)
      return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }

    // Check if user is authorized (vendor who owns the product or admin)

    // Delete the product image if it exists
    if (existingProduct.image_url) {
      const imagePath = getPathFromUrl(existingProduct.image_url, PRODUCT_IMAGES_BUCKET)
      if (imagePath) {
        await deleteFile(PRODUCT_IMAGES_BUCKET, imagePath)
      }
    }

    // Delete the product
    const { error: deleteError } = await supabase.from("products").delete().eq("id", id)

    if (deleteError) {
      console.error("Error deleting product:", deleteError)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error in product DELETE route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
