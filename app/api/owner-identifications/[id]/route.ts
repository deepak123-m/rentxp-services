import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { deleteFile, getPathFromUrl, PRODUCT_IMAGES_BUCKET, uploadFileAdmin } from "@/lib/storage-admin"
import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Get a specific owner identification by ID (admin only)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and role
  const authResponse = await withAuth(request, ["admin"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const identificationId = params.id
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("owner_identifications").select("*").eq("id", identificationId).single()

    if (error) {
      return NextResponse.json({ error: "Owner identification not found" }, { status: 404 })
    }

    return NextResponse.json({ owner_identification: data })
  } catch (error) {
    console.error("Error fetching owner identification:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Update an owner identification (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and role
  const authResponse = await withAuth(request, ["admin"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const identificationId = params.id
    const supabase = createServerSupabaseClient()

    // Check if the request is multipart/form-data
    const contentType = request.headers.get("content-type") || ""
    const isMultipart = contentType.includes("multipart/form-data")

    let body: any = {}
    let id_image_url: string | null = null

    if (isMultipart) {
      const formData = await request.formData()

      body = {
        id_type: formData.get("id_type") as string,
        id_number: formData.get("id_number") as string,
        id_name: formData.get("id_name") as string,
        issue_date: formData.get("issue_date") as string | null,
        expiry_date: formData.get("expiry_date") as string | null,
        issuing_authority: formData.get("issuing_authority") as string | null,
        issuing_country: formData.get("issuing_country") as string | null,
        is_verified: formData.get("is_verified") === "true",
        verification_notes: formData.get("verification_notes") as string | null,
      }

      const imageFile = formData.get("id_image") as File | null

      if (imageFile) {
        // Generate a unique filename
        const fileExt = imageFile.name.split(".").pop() || "jpg"
        const uniqueFileName = `owner_identifications/${uuidv4()}.${fileExt}`

        // Convert file to buffer
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Supabase Storage
        id_image_url = await uploadFileAdmin(buffer, PRODUCT_IMAGES_BUCKET, uniqueFileName, imageFile.type)

        if (!id_image_url) {
          return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
        }
      }
    } else {
      body = await request.json()
      id_image_url = body.id_image_url // If JSON, assume id_image_url is provided directly
    }

    const {
      id_type,
      id_number,
      id_name,
      issue_date,
      expiry_date,
      issuing_authority,
      issuing_country,
      is_verified,
      verification_notes,
    } = body

    // Validate enum values
    const validIdTypes = ["aadhar", "pan", "voter_id", "driving_license", "passport", "ration_card", "other"]
    if (id_type && !validIdTypes.includes(id_type)) {
      return NextResponse.json({ error: "Invalid id_type" }, { status: 400 })
    }

    // Fetch existing data to delete old image if needed
    const { data: existingData, error: fetchError } = await supabase
      .from("owner_identifications")
      .select("id_image_url")
      .eq("id", identificationId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: "Error fetching existing data" }, { status: 500 })
    }

    // Update owner identification
    const updateData: any = {
      id_type,
      id_number,
      id_name,
      issue_date,
      expiry_date,
      issuing_authority,
      issuing_country,
      is_verified,
      verification_notes,
    }

    if (id_image_url) {
      updateData.id_image_url = id_image_url

      // Delete old image if exists
      if (existingData?.id_image_url) {
        const oldPath = getPathFromUrl(existingData.id_image_url, PRODUCT_IMAGES_BUCKET)
        if (oldPath) {
          await deleteFile(PRODUCT_IMAGES_BUCKET, oldPath)
        }
      }
    }

    const { data, error } = await supabase
      .from("owner_identifications")
      .update(updateData)
      .eq("id", identificationId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Owner identification updated successfully",
      owner_identification: data,
    })
  } catch (error) {
    console.error("Error updating owner identification:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Delete an owner identification (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and role
  const authResponse = await withAuth(request, ["admin"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const identificationId = params.id
    const supabase = createServerSupabaseClient()

    // Delete owner identification
    const { error } = await supabase.from("owner_identifications").delete().eq("id", identificationId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Owner identification deleted successfully",
      id: identificationId,
    })
  } catch (error) {
    console.error("Error deleting owner identification:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
