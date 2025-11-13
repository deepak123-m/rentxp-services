import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { uploadFileAdmin, PRODUCT_IMAGES_BUCKET } from "@/lib/storage-admin"
import { v4 as uuidv4 } from "uuid"
import { handleCors, setCorsHeaders } from "@/lib/cors"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const url = new URL(request.url)
    const query = url.searchParams.get("query")
    const category = url.searchParams.get("category")
    const categoryId = url.searchParams.get("category_id")
    const vendorId = url.searchParams.get("vendor_id") // NEW
    const discount = url.searchParams.get("discount")
    const minPrice = url.searchParams.get("minPrice")
    const maxPrice = url.searchParams.get("maxPrice")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    let productQuery = supabaseAdmin.from("products").select(
      `
    *,
    vendor_articlestwo!inner(
      id,
      vendor_id,
      stock,
      price,
      vendors!inner(
        id,
        name,
        email,
        is_active,
        vendor_code,
        vendor_type,
        contact_number
      )
    )
  `,
      { count: "exact" },
    )

    // Apply filters if provided
    if (query) {
      productQuery = productQuery.ilike("name", `%${query}%`)
    }

    if (category) {
      productQuery = productQuery.ilike("category", `%${category}%`)
    }

    if (discount && !isNaN(Number(discount))) {
      productQuery = productQuery.eq("discount_percentage", Number(discount))
    }

    if (categoryId) {
      productQuery = productQuery.eq("category_id", categoryId)
    }

    if (vendorId) {
      productQuery = productQuery.eq("vendor_id", vendorId)
    } else {
      productQuery = productQuery.is("vendor_id", null) // Filter for null vendor_id if not provided
    }

    if (minPrice) {
      productQuery = productQuery.gte("price", minPrice)
    }

    if (maxPrice) {
      productQuery = productQuery.lte("price", maxPrice)
    }

    // Filter for active products (true or null)
    productQuery = productQuery.or("isactive.is.null,isactive.eq.true")

    const { data, error, count } = await productQuery
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to include vendor details in the desired format
    const transformedProducts =
      data?.map((product) => {
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
        return {
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
      }) || []

    const response = NextResponse.json({
      products: transformedProducts,
      count,
      limit,
      offset,
    })

    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error fetching products:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get("content-type") || ""
    console.log("Request content type:", contentType)
    console.log("Request headers:", Object.fromEntries(request.headers.entries()))

    // Variables to store product data
    let name: string
    let description: string
    let price: number
    let stock: number | null = null
    let category: string
    let categoryId: string | null = null
    let brand: string | null = null
    let hsnCode: string | null = null
    let vendorId: string
    let imageBuffer: Buffer | null = null
    let imageContentType = "image/jpeg"
    let imageFileName = "image.jpg"

    // Handle multipart/form-data (with image upload)
    if (contentType.includes("multipart/form-data")) {
      try {
        // Parse the multipart form data
        const formData = await request.formData()
        console.log("Form data keys:", [...formData.keys()])

        // Extract product data from fields
        name = formData.get("name") as string
        description = formData.get("description") as string
        price = formData.get("price") ? Number.parseFloat(formData.get("price") as string) : 0
        stock = formData.get("stock") ? Number.parseInt(formData.get("stock") as string) : 0
        category = formData.get("category") as string
        categoryId = (formData.get("category_id") as string) || null
        brand = (formData.get("brand") as string) || null
        hsnCode = (formData.get("hsn_code") as string) || null
        vendorId = formData.get("vendor_id") as string

        // Validate required fields
        if (!name || !price || !vendorId) {
          return NextResponse.json({ error: "Name, price, and vendor_id are required" }, { status: 400 })
        }

        // Get image file - try multiple field names
        const imageFieldNames = ["image", "file", "photo", "product_image", "images"]
        let imageFile: File | null = null

        for (const fieldName of imageFieldNames) {
          if (formData.has(fieldName)) {
            const file = formData.get(fieldName) as File
            if (file && file instanceof File && file.size > 0) {
              imageFile = file
              console.log(`Found image in field "${fieldName}":`, {
                name: file.name,
                type: file.type,
                size: file.size,
              })
              break
            }
          }
        }

        // If no image found in specific fields, check all fields for any files
        if (!imageFile) {
          for (const [key, value] of formData.entries()) {
            if (value instanceof File && value.size > 0) {
              imageFile = value
              console.log(`Found file in field "${key}":`, {
                name: value.name,
                type: value.type,
                size: value.size,
              })
              break
            }
          }
        }

        if (imageFile) {
          // Verify it's an image or accept any file type if needed
          if (!imageFile.type.startsWith("image/") && imageFile.type !== "") {
            console.warn(`File type not recognized as image: ${imageFile.type}, but processing anyway`)
          }

          try {
            // Convert File to Buffer
            const arrayBuffer = await imageFile.arrayBuffer()
            imageBuffer = Buffer.from(arrayBuffer)
            imageContentType = imageFile.type || "application/octet-stream"
            imageFileName = imageFile.name
            console.log(`Successfully buffered file: ${imageFile.name}, size: ${arrayBuffer.byteLength} bytes`)
          } catch (bufferError) {
            console.error("Error converting file to buffer:", bufferError)
          }
        } else {
          console.log("No image file found in the form data")
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
        console.log("JSON body keys:", Object.keys(body))

        name = body.name
        description = body.description
        price = body.price
        stock = body.stock
        category = body.category
        categoryId = body.category_id
        brand = body.brand
        hsnCode = body.hsn_code
        vendorId = body.vendor_id

        // Validate required fields
        if (!name || !price || !vendorId) {
          return NextResponse.json({ error: "Name, price,  and vendor_id are required" }, { status: 400 })
        }

        // Process base64 image if provided - check both imageBase64 (from docs) and image fields
        const base64Image = body.imageBase64 || body.image
        if (base64Image) {
          console.log("Found base64 image data in request")

          // Remove the data:image/jpeg;base64, part
          const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

          if (matches && matches.length === 3) {
            imageContentType = matches[1]
            const base64Data = matches[2]
            try {
              imageBuffer = Buffer.from(base64Data, "base64")
              imageFileName = `image-${Date.now()}.${imageContentType.split("/")[1] || "jpg"}`
              console.log(`Successfully decoded base64 image, size: ${imageBuffer.length} bytes`)
            } catch (base64Error) {
              console.error("Error decoding base64 data:", base64Error)
            }
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

    // Create new product first without image
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .insert({
        name,
        description,
        price,
        stock,
        category,
        category_id: categoryId,
        brand,
        hsn_code: hsnCode,
        vendor_id: vendorId,
        approval_status: "pending",
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 500 })
    }

    if (product.vendor_id && product.article_id) {
      const { error: linkError } = await supabaseAdmin.from("vendor_articlestwo").insert([
        {
          vendor_id: product.vendor_id,
          article_id: product.article_id,
        },
      ])
    }

    console.log("Product created:", product)

    // Process the image if present
    let imageUrl = null
    let imageUploadError = null

    if (imageBuffer) {
      console.log("Attempting to upload image")
      try {
        // Generate a unique filename using original name if possible
        const fileExt = imageFileName.split(".").pop() || imageContentType.split("/")[1] || "jpg"
        const uniqueFileName = `${uuidv4()}.${fileExt}`
        const imagePath = `products/${product.id}/${uniqueFileName}`

        console.log(`Uploading to Supabase: ${imagePath}, size: ${imageBuffer.length} bytes, type: ${imageContentType}`)

        // Upload to Supabase Storage
        imageUrl = await uploadFileAdmin(imageBuffer, PRODUCT_IMAGES_BUCKET, imagePath, imageContentType)

        if (imageUrl) {
          console.log("Successfully uploaded image:", imageUrl)

          // Update the product with the image URL
          const { error: updateError } = await supabaseAdmin
            .from("products")
            .update({ image_url: imageUrl })
            .eq("id", product.id)

          if (updateError) {
            console.warn("Failed to update product with image URL:", updateError)
            imageUploadError = updateError.message
          } else {
            console.log("Product updated with image URL")
          }
        } else {
          console.error("Upload returned null URL")
          imageUploadError = "Upload failed - null URL returned"
        }
      } catch (error) {
        console.error("Error processing image:", error)
        imageUploadError = error instanceof Error ? error.message : String(error)
      }
    } else {
      console.log("No image to upload")
    }

    // Get the updated product
    const { data: updatedProduct, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", product.id)
      .single()

    const response = NextResponse.json({
      message: "Product created successfully",
      product: updatedProduct || product,
      imageUrl,
      imageUploadError,
      debug: {
        contentType,
        imageBufferReceived: imageBuffer ? true : false,
        imageBufferSize: imageBuffer ? imageBuffer.length : 0,
      },
    })

    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error creating product:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request)
}



//vendor-add=product =before

// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { supabaseAdmin } from "@/lib/supabase"
// export async function POST(req: Request) {
  

//   try {
//     const body = await req.json();
//     const {
//       vendor_id, // this is actually vendors.vendor_id (string)
//       product,   // product data for 'products' table
//       stock,
//       price
//     } = body;

//     if (!vendor_id || !product?.name || stock === undefined) {
//       return NextResponse.json({ error: 'Missing vendor_id, product name or stock' }, { status: 400 });
//     }

//     // 1. Get vendor's actual id using vendor_id string
//     const { data: vendor, error: vendorLookupError } = await supabaseAdmin
//       .from('vendors')
//       .select('id')
//       .eq('vendor_id', vendor_id)
//       .single();

//     if (vendorLookupError || !vendor) {
//       return NextResponse.json({ error: 'Vendor not found', details: vendorLookupError?.message }, { status: 404 });
//     }

//     const vendor_db_id = vendor.id;

//     // 2. Insert product
//     const { data: newProduct, error: productError } = await supabaseAdmin
//       .from('products')
//       .insert([product])
//       .select('article_id')
//       .single();

//     if (productError || !newProduct) {
//       return NextResponse.json({ error: 'Failed to create product', details: productError?.message }, { status: 500 });
//     }

//     const article_id = newProduct.article_id;

//     // 3. Insert into vendor_articlestwo using actual vendor UUID
//     const { error: vendorArticleError } = await supabaseAdmin
//       .from('vendor_articlestwo')
//       .insert([
//         {
//           vendor_id: vendor_db_id,
//           article_id,
//           stock,
//           price: price ?? 0
//         }
//       ]);

//     if (vendorArticleError) {
//       return NextResponse.json({ error: 'Failed to link vendor and product', details: vendorArticleError.message }, { status: 500 });
//     }

//     return NextResponse.json({
//       message: 'Product created and linked successfully',
//       article_id
//     }, { status: 201 });

//   } catch (err: any) {
//     console.error('POST /api/vendor-products error:', err);
//     return NextResponse.json({ error: 'Server error', details: err.message }, { status: 500 });
//   }
// }

