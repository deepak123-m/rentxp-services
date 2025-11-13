import { createServerSupabaseClient } from "@/lib/auth"
import { uploadFileAdmin, PRODUCT_IMAGES_BUCKET } from "@/lib/storage-admin"
import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Create a new owner identification (no authentication required for testing)
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Parse the multipart form data
    const formData = await request.formData()

    // Extract registration data from fields
    const registration_id = formData.get("registration_id") as string
    const id_type = formData.get("id_type") as string
    const imageFile = formData.get("id_image") as File | null

    // Validate required fields
    if (!registration_id || !id_type || !imageFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate enum values
    const validDocumentTypes = ["voter_id", "driving_license", "passport", "pan", "aadhar", "ration_card", "other"]
    if (!validDocumentTypes.includes(id_type)) {
      return NextResponse.json({ error: "Invalid id_type" }, { status: 400 })
    }

    // Generate a unique filename
    const fileExt = imageFile.name.split(".").pop() || "jpg"
    const uniqueFileName = `owner_identifications/${uuidv4()}.${fileExt}`

    // Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const id_image_url = await uploadFileAdmin(buffer, PRODUCT_IMAGES_BUCKET, uniqueFileName, imageFile.type)

    if (!id_image_url) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // Create new owner identification
    const { data, error } = await supabase
      .from("owner_identifications")
      .insert({
        registration_id,
        id_type,
        id_image_url,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Owner identification created successfully",
      owner_identification: data,
    })
  } catch (error) {
    console.error("Error creating owner identification:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// List owner identifications (authentication still required)
export async function GET(request: NextRequest) {
  // Check authentication (still required for GET)
  // const authResponse = await withAuth(request, ["admin"])
  // if (authResponse.status === 401 || authResponse.status === 403) {
  //   return authResponse
  // }

  try {
    const supabase = createServerSupabaseClient()

    // Parse query parameters
    const url = new URL(request.url)
    const registrationId = url.searchParams.get("registration_id")

    if (!registrationId) {
      return NextResponse.json({ error: "registration_id is required" }, { status: 400 })
    }

    // Build query
    const { data, error } = await supabase
      .from("owner_identifications")
      .select("*")
      .eq("registration_id", registrationId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ owner_identifications: data })
  } catch (error) {
    console.error("Error fetching owner identifications:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
