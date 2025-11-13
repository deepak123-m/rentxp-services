import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { uploadFile, PRODUCT_IMAGES_BUCKET } from "@/lib/storage"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Upload documents for a shop owner registration
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResponse = await withAuth(request, ["admin", "customer"])
    if (authResponse.status === 401 || authResponse.status === 403) {
      return authResponse
    }

    const registrationId = params.id
    const supabase = createServerSupabaseClient()

    // Check if registration exists and belongs to the user (unless admin)
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: registration, error: registrationError } = await supabase
      .from("shop_owner_registrations")
      .select("*")
      .eq("id", registrationId)
      .single()

    if (registrationError || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // If not admin, check if registration belongs to user
    const isAdmin = session.user.app_metadata?.role === "admin"
    if (!isAdmin && registration.user_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Parse form data
    const formData = await request.formData()
    const documentType = formData.get("document_type") as string
    const file = formData.get("file") as File

    // Validate document type
    const validDocumentTypes = [
      "identity_proof",
      "address_proof",
      "business_license",
      "gst_certificate",
      "shop_photo",
      "other",
    ]

    if (!documentType || !validDocumentTypes.includes(documentType)) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 })
    }

    // Validate file
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds the 5MB limit" }, { status: 400 })
    }

    // Check file type
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Supported types: JPEG, PNG, WebP, PDF" }, { status: 400 })
    }

    // Generate a unique filename
    const fileExtension = file.name.split(".").pop()
    const fileName = `shop_owner_docs/${registrationId}/${documentType}_${Date.now()}.${fileExtension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload file to Supabase Storage
    const fileUrl = await uploadFile(buffer, PRODUCT_IMAGES_BUCKET, fileName, file.type)

    if (!fileUrl) {
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Store document information in the database
    const { data: document, error: documentError } = await supabase
      .from("shop_owner_documents")
      .insert({
        registration_id: registrationId,
        document_type: documentType,
        document_url: fileUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: session.user.id,
      })
      .select()
      .single()

    if (documentError) {
      return NextResponse.json({ error: documentError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Document uploaded successfully",
      document,
    })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Get all documents for a shop owner registration
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResponse = await withAuth(request, ["admin", "customer"])
    if (authResponse.status === 401 || authResponse.status === 403) {
      return authResponse
    }

    const registrationId = params.id
    const supabase = createServerSupabaseClient()

    // Check if registration exists and belongs to the user (unless admin)
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: registration, error: registrationError } = await supabase
      .from("shop_owner_registrations")
      .select("*")
      .eq("id", registrationId)
      .single()

    if (registrationError || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // If not admin, check if registration belongs to user
    const isAdmin = session.user.app_metadata?.role === "admin"
    if (!isAdmin && registration.user_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get all documents for this registration
    const { data: documents, error: documentsError } = await supabase
      .from("shop_owner_documents")
      .select("*")
      .eq("registration_id", registrationId)
      .order("created_at", { ascending: false })

    if (documentsError) {
      return NextResponse.json({ error: documentsError.message }, { status: 500 })
    }

    return NextResponse.json({
      documents,
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
