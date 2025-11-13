import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { uploadFile, deleteFile, getPathFromUrl, PRODUCT_IMAGES_BUCKET } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params
      const supabase = createRouteHandlerClient({ cookies })
  
      // 1. Fetch product with category and vendor
      const { data: product, error: productError } = await supabase
        .from("products")
        .select(`
          *,
          categories:category_id (id, name),
          vendors:vendor_id (id, name)
        `)
        .eq("id", id)
        .single()
  
      if (productError) {
        if (productError.code === "PGRST116") {
          return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }
        console.error("Error fetching product:", productError)
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
      }
  
      // 2. Fetch related product images
      const { data: images, error: imageError } = await supabase
        .from("product_images")
        .select("id, image_url, is_primary, created_at")
        .eq("product_id", id)
  
      if (imageError) {
        console.error("Error fetching product images:", imageError)
        return NextResponse.json({ error: "Failed to fetch product images" }, { status: 500 })
      }
  
      // 3. Combine product and images
      return NextResponse.json({
        ...product,
        product_images: images,
      })
    } catch (error) {
      console.error("Error in product GET route:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
  