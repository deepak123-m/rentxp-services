import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// This endpoint uses the service role key which has higher permissions
// WARNING: Only use this for testing, not in production code
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()
    const { imageBase64 } = body

    if (!imageBase64) {
      return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 })
    }

    // Create a Supabase client with the service role key
    // You need to add SUPABASE_SERVICE_ROLE_KEY to your environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceKey) {
      return NextResponse.json(
        {
          error: "SUPABASE_SERVICE_ROLE_KEY environment variable is not set",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Process the base64 image
    try {
      // Remove the data:image/jpeg;base64, part
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "")
      const buffer = Buffer.from(base64Data, "base64")

      // Generate a unique filename
      const fileName = `service-role-test-${uuidv4()}.jpg`
      const imagePath = `test/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("productsimages")
        .upload(imagePath, buffer, {
          contentType: "image/jpeg",
          upsert: true,
        })

      if (uploadError) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to upload image",
            details: uploadError.message,
          },
          { status: 500 },
        )
      }

      // Get the public URL
      const { data: urlData } = supabase.storage.from("productsimages").getPublicUrl(imagePath)

      return NextResponse.json({
        success: true,
        message: "Image uploaded successfully with service role",
        imageUrl: urlData.publicUrl,
        path: imagePath,
      })
    } catch (error) {
      console.error("Error processing image:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Error processing image",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in service role test endpoint:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
