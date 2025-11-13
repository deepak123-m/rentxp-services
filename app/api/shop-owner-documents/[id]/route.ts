import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { deleteFile, getPathFromUrl, PRODUCT_IMAGES_BUCKET } from "@/lib/storage"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Get a specific document
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResponse = await withAuth(request, ["admin", "customer"])
    if (authResponse.status === 401 || authResponse.status === 403) {
      return authResponse
    }

    const documentId = params.id
    const supabase = createServerSupabaseClient()

    // Get document
    const { data: document, error: documentError } = await supabase
      .from("shop_owner_documents")
      .select("*, registration_id(user_id)")
      .eq("id", documentId)
      .single()

    if (documentError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check if user has access to this document
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = session.user.app_metadata?.role === "admin"
    // @ts-ignore - The join result structure
    if (!isAdmin && document.registration_id.user_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({
      document,
    })
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Delete a document
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResponse = await withAuth(request, ["admin", "customer"])
    if (authResponse.status === 401 || authResponse.status === 403) {
      return authResponse
    }

    const documentId = params.id
    const supabase = createServerSupabaseClient()

    // Get document
    const { data: document, error: documentError } = await supabase
      .from("shop_owner_documents")
      .select("*, registration_id(user_id, status)")
      .eq("id", documentId)
      .single()

    if (documentError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check if user has access to this document
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = session.user.app_metadata?.role === "admin"
    // @ts-ignore - The join result structure
    if (!isAdmin && document.registration_id.user_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if registration is already approved (can't delete documents from approved registrations)
    // @ts-ignore - The join result structure
    if (!isAdmin && document.registration_id.status === "approved") {
      return NextResponse.json({ error: "Cannot delete documents from approved registrations" }, { status: 403 })
    }

    // Delete file from storage
    const filePath = getPathFromUrl(document.document_url, PRODUCT_IMAGES_BUCKET)
    if (filePath) {
      await deleteFile(PRODUCT_IMAGES_BUCKET, filePath)
    }

    // Delete document record
    const { error: deleteError } = await supabase.from("shop_owner_documents").delete().eq("id", documentId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Document deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
