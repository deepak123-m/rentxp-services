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
    const category_id = url.searchParams.get("category_id")
    const sub_category_id = url.searchParams.get("sub_category_id")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    let query = supabaseAdmin.from("articles").select("*")

    if (category_id) {
      query = query.eq("category_id", category_id)
    }

    if (sub_category_id) {
      query = query.eq("sub_category_id", sub_category_id)
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({
      articles: data,
      count,
      limit,
      offset,
    })

    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error fetching articles:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

export async function POST(request: NextRequest) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get("content-type") || ""
    console.log("Request content type:", contentType)
    console.log("Request headers:", Object.fromEntries(request.headers.entries()))

    // Variables to store article data
    let name: string
    let description: string
    let weight: number | null = null
    let unit_of_measurement: string | null = null
    let category_id: string | null = null
    let sub_category_id: string | null = null
    let mrp: number | null = null
    let cost_price: number | null = null
    let hsn_code: string | null = null
    let gst_percentage: number | null = null
    let product_photos: string[] = []
    const imageBuffers: { buffer: Buffer; contentType: string; fileName: string }[] = []

    // Handle multipart/form-data (with image upload)
    if (contentType.includes("multipart/form-data")) {
      try {
        // Parse the multipart form data
        const formData = await request.formData()
        console.log("Form data keys:", [...formData.keys()])

        // Extract article data from fields
        name = formData.get("name") as string
        description = formData.get("description") as string
        weight = formData.get("weight") ? Number.parseFloat(formData.get("weight") as string) : null
        unit_of_measurement = (formData.get("unit_of_measurement") as string) || null
        category_id = (formData.get("category_id") as string) || null
        sub_category_id = (formData.get("sub_category_id") as string) || null
        mrp = formData.get("mrp") ? Number.parseFloat(formData.get("mrp") as string) : null
        cost_price = formData.get("cost_price") ? Number.parseFloat(formData.get("cost_price") as string) : null
        hsn_code = (formData.get("hsn_code") as string) || null
        gst_percentage = formData.get("gst_percentage")
          ? Number.parseFloat(formData.get("gst_percentage") as string)
          : null

        // Get image files - try both "images" and "image" field names
        let files: File[] = []
        if (formData.has("images")) {
          files = formData.getAll("images") as File[]
          console.log("Found files under 'images' field")
        } else if (formData.has("image")) {
          files = formData.getAll("image") as File[]
          console.log("Found files under 'image' field")
        } else {
          // Try to find any file fields
          for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
              console.log(`Found file in field: ${key}`)
              files.push(value)
            }
          }
        }

        // Debug log to verify files are received
        console.log(`Received ${files.length} image files`)

        for (const file of files) {
          if (file && file instanceof File) {
            console.log("Processing file:", {
              name: file.name,
              type: file.type,
              size: file.size,
            })

            // Skip empty files or non-files
            if (file.size === 0) {
              console.log("Skipping empty file")
              continue
            }

            // Verify it's an image or accept any file type if needed
            if (!file.type.startsWith("image/") && file.type !== "") {
              console.warn(`File type not recognized as image: ${file.type}, but processing anyway`)
            }

            try {
              // Convert File to Buffer
              const arrayBuffer = await file.arrayBuffer()
              imageBuffers.push({
                buffer: Buffer.from(arrayBuffer),
                contentType: file.type || "application/octet-stream",
                fileName: file.name,
              })
              console.log(`Successfully buffered file: ${file.name}, size: ${arrayBuffer.byteLength} bytes`)
            } catch (bufferError) {
              console.error("Error converting file to buffer:", bufferError)
            }
          } else {
            console.warn("Received non-File object in file field:", typeof file)
          }
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
    // Handle JSON request (with base64 images)
    else {
      try {
        const body = await request.json()
        console.log("JSON body keys:", Object.keys(body))

        name = body.name
        description = body.description
        weight = body.weight
        unit_of_measurement = body.unit_of_measurement
        category_id = body.category_id
        sub_category_id = body.sub_category_id
        mrp = body.mrp
        cost_price = body.cost_price
        hsn_code = body.hsn_code
        gst_percentage = body.gst_percentage
        product_photos = body.product_photos || []

        // Process base64 images if provided
        if (body.images && Array.isArray(body.images)) {
          console.log(`Found ${body.images.length} base64 images in request`)
          for (const imageBase64 of body.images) {
            // Remove the data:image/jpeg;base64, part
            const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

            if (matches && matches.length === 3) {
              const contentType = matches[1]
              const base64Data = matches[2]
              try {
                const buffer = Buffer.from(base64Data, "base64")
                console.log(`Successfully decoded base64 image, size: ${buffer.length} bytes`)
                imageBuffers.push({
                  buffer,
                  contentType,
                  fileName: `image-${Date.now()}.${contentType.split("/")[1] || "jpg"}`,
                })
              } catch (base64Error) {
                console.error("Error decoding base64 data:", base64Error)
              }
            } else {
              console.error("Invalid base64 image format")
            }
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

    // Create new article first without images
    const { data: article, error: articleError } = await supabaseAdmin
      .from("articles")
      .insert({
        name,
        description,
        weight,
        unit_of_measurement,
        category_id,
        sub_category_id,
        mrp,
        cost_price,
        product_photos,
        hsn_code,
        gst_percentage,
      })
      .select()
      .single()

    if (articleError) {
      return NextResponse.json({ error: articleError.message }, { status: 500 })
    }

    console.log("Article created:", article)

    // Process the images if present
    const uploadedPhotos = [...product_photos]
    let imageUploadError = null
    let imageUploaded = false

    if (imageBuffers.length > 0) {
      console.log(`Attempting to upload ${imageBuffers.length} images`)
      try {
        for (const { buffer, contentType, fileName } of imageBuffers) {
          // Generate a unique filename using original name if possible
          const fileExt = fileName.split(".").pop() || contentType.split("/")[1] || "jpg"
          const uniqueFileName = `${uuidv4()}.${fileExt}`
          const imagePath = `articles/${article.id}/${uniqueFileName}`

          console.log(`Uploading to Supabase: ${imagePath}, size: ${buffer.length} bytes, type: ${contentType}`)

          try {
            // Upload to Supabase Storage
            const imageUrl = await uploadFileAdmin(buffer, PRODUCT_IMAGES_BUCKET, imagePath, contentType)

            if (imageUrl) {
              uploadedPhotos.push(imageUrl)
              imageUploaded = true
              console.log("Successfully uploaded:", imageUrl)
            } else {
              console.error("Upload returned null URL")
            }
          } catch (uploadError) {
            console.error("Supabase upload failed:", uploadError)
          }
        }

        // Update the article with the image URLs if any were uploaded
        if (uploadedPhotos.length > 0) {
          console.log(`Updating article with ${uploadedPhotos.length} photos`)
          const { error: updateError } = await supabaseAdmin
            .from("articles")
            .update({ product_photos: uploadedPhotos })
            .eq("id", article.id)

          if (updateError) {
            console.warn("Failed to update article with image URLs:", updateError)
            imageUploadError = updateError.message
          }
        }
      } catch (error) {
        console.error("Error processing images:", error)
        imageUploadError = error instanceof Error ? error.message : String(error)
      }
    } else {
      console.log("No images to upload")
    }

    // Get the updated article
    const { data: updatedArticle, error: fetchError } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("id", article.id)
      .single()

    const response = NextResponse.json({
      message: "Article created successfully",
      article: updatedArticle || article,
      imageUploadError,
      imageUploaded,
      debug: {
        contentType,
        imageBuffersCount: imageBuffers.length,
        uploadedPhotosCount: uploadedPhotos.length,
      },
    })

    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error creating article:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request)
}
