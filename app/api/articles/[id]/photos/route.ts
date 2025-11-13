import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { uploadFileAdmin, PRODUCT_IMAGES_BUCKET } from "@/lib/storage-admin"
import { v4 as uuidv4 } from "uuid"
import { handleCors, setCorsHeaders } from "@/lib/cors"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const id = params.id

    // Check if the request is multipart/form-data
    const contentType = request.headers.get("content-type") || ""
    console.log("Request content type:", contentType)
    console.log("Request headers:", Object.fromEntries(request.headers.entries()))

    const imageBuffers: { buffer: Buffer; contentType: string; fileName: string }[] = []
    let photoUrls: string[] = []

    // Handle multipart/form-data (with image upload)
    if (contentType.includes("multipart/form-data")) {
      try {
        // Parse the multipart form data
        const formData = await request.formData()
        console.log("Form data keys:", [...formData.keys()])

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
        console.log(`Received ${files.length} image files for article ${id}`)

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
    // Handle JSON request (with base64 images or photo URLs)
    else {
      try {
        const body = await request.json()
        console.log("JSON body keys:", Object.keys(body))

        // Handle direct photo URLs
        if (body.photos && Array.isArray(body.photos)) {
          photoUrls = body.photos
          console.log(`Found ${photoUrls.length} photo URLs in request`)
        }

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

    // Check if article exists
    const { data: article, error: checkError } = await supabaseAdmin
      .from("articles")
      .select("id, product_photos")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Upload images to storage
    const uploadedUrls = [...photoUrls]
    let imageUploaded = false

    if (imageBuffers.length > 0) {
      console.log(`Attempting to upload ${imageBuffers.length} images`)
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
            uploadedUrls.push(imageUrl)
            imageUploaded = true
            console.log("Successfully uploaded:", imageUrl)
          } else {
            console.error("Upload returned null URL")
          }
        } catch (uploadError) {
          console.error("Supabase upload failed:", uploadError)
        }
      }
    } else {
      console.log("No image buffers to upload")
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        {
          error: "No valid photos provided",
          debug: {
            contentType,
            imageBuffersCount: imageBuffers.length,
            photoUrlsCount: photoUrls.length,
          },
        },
        { status: 400 },
      )
    }

    // Combine existing photos with new ones
    const existingPhotos = article.product_photos || []
    const updatedPhotos = [...existingPhotos, ...uploadedUrls]

    // Update article with new photos
    const { data, error } = await supabaseAdmin
      .from("articles")
      .update({ product_photos: updatedPhotos })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({
      message: "Photos added successfully",
      article: data,
      added_photos: uploadedUrls,
      imageUploaded,
      debug: {
        contentType,
        imageBuffersCount: imageBuffers.length,
        uploadedUrlsCount: uploadedUrls.length,
      },
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error adding photos:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const id = params.id
    const { photos } = await request.json()

    // Validate input
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json({ error: "Photos array is required" }, { status: 400 })
    }

    // Check if article exists
    const { data: article, error: checkError } = await supabaseAdmin
      .from("articles")
      .select("id, product_photos")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Remove specified photos
    const existingPhotos = article.product_photos || []
    const updatedPhotos = existingPhotos.filter((photo) => !photos.includes(photo))

    // Update article with remaining photos
    const { data, error } = await supabaseAdmin
      .from("articles")
      .update({ product_photos: updatedPhotos })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({
      message: "Photos removed successfully",
      article: data,
      removed_photos: photos,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error removing photos:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request)
}
