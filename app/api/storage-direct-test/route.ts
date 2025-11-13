import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    // Create a direct Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the request body
    const body = await request.json()
    const { imageBase64 } = body

    if (!imageBase64) {
      return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 })
    }

    // Process the base64 image
    try {
      // Remove the data:image/jpeg;base64, part
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "")
      const buffer = Buffer.from(base64Data, "base64")

      console.log("Base64 image buffer created, size:", buffer.length)
      console.log("Supabase URL:", supabaseUrl)
      console.log("Anon Key first 5 chars:", supabaseAnonKey.substring(0, 5) + "...")

      // List buckets to verify connection
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

      if (bucketsError) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to list buckets",
            details: bucketsError.message,
          },
          { status: 500 },
        )
      }

      console.log(
        "Available buckets:",
        buckets.map((b) => b.name),
      )

      // Generate a unique filename
      const fileName = `direct-test-${uuidv4()}.jpg`
      const imagePath = `test/${fileName}`

      // Direct upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("productsimages")
        .upload(imagePath, buffer, {
          contentType: "image/jpeg",
          upsert: true,
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to upload image",
            details: uploadError.message,
          },
          { status: 500 },
        )
      }

      console.log("Upload successful, data:", uploadData)

      // Get the public URL
      const { data: urlData } = supabase.storage.from("productsimages").getPublicUrl(imagePath)

      return NextResponse.json({
        success: true,
        message: "Image uploaded successfully",
        uploadData,
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
    console.error("Error in direct test endpoint:", error)
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
