import { type NextRequest, NextResponse } from "next/server"
import { listBuckets, uploadFileAdmin, PRODUCT_IMAGES_BUCKET } from "@/lib/storage-admin"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    // List all buckets
    const buckets = await listBuckets()

    if (!buckets) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to list buckets",
        },
        { status: 500 },
      )
    }

    // Create a test file
    const testContent = `Test file created at ${new Date().toISOString()}`
    const buffer = Buffer.from(testContent)

    // Upload the test file
    const fileName = `admin-test-${uuidv4()}.txt`
    const imagePath = `test/${fileName}`

    const fileUrl = await uploadFileAdmin(buffer, PRODUCT_IMAGES_BUCKET, imagePath, "text/plain")

    if (!fileUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload test file",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Admin test successful",
      buckets,
      fileUrl,
      serviceRoleKeyPresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    })
  } catch (error) {
    console.error("Error in admin test:", error)
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
