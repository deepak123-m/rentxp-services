import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth"
import { PRODUCT_IMAGES_BUCKET } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Test 1: List buckets
    const { data: buckets, error: listBucketsError } = await supabase.storage.listBuckets()

    if (listBucketsError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to list buckets",
          details: listBucketsError.message,
          step: "list_buckets",
        },
        { status: 500 },
      )
    }

    // Test 2: Check if our bucket exists
    const bucketExists = buckets.some((b) => b.name === PRODUCT_IMAGES_BUCKET)

    if (!bucketExists) {
      return NextResponse.json(
        {
          success: false,
          error: `Bucket "${PRODUCT_IMAGES_BUCKET}" does not exist`,
          existingBuckets: buckets.map((b) => b.name),
          step: "check_bucket",
        },
        { status: 404 },
      )
    }

    // Test 3: Try to upload a small test file
    const testFileContent = Buffer.from("Hello, World!")
    const testFileName = `test-${uuidv4().substring(0, 8)}.txt`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(`test/${testFileName}`, testFileContent, {
        contentType: "text/plain",
      })

    if (uploadError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload test file",
          details: uploadError.message,
          step: "upload_file",
        },
        { status: 500 },
      )
    }

    // Test 4: Get the URL of the uploaded file
    const { data: urlData } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(`test/${testFileName}`)

    // Test 5: Check if the bucket is public
    let isPublic = false
    try {
      const response = await fetch(urlData.publicUrl)
      isPublic = response.status === 200
    } catch (error) {
      console.error("Error checking if bucket is public:", error)
    }

    // Clean up: Delete the test file
    await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([`test/${testFileName}`])

    return NextResponse.json({
      success: true,
      message: "All storage tests passed successfully",
      bucket: PRODUCT_IMAGES_BUCKET,
      bucketExists,
      isPublic,
      uploadedFile: uploadData,
      fileUrl: urlData.publicUrl,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error during storage tests",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
