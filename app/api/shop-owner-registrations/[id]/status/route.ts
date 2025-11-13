import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Update the status of a shop owner registration
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and role
  const authResponse = await withAuth(request, ["admin"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const registrationId = params.id
    const supabase = createServerSupabaseClient()

    // Get current user (admin)
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, rejection_reason } = body

    // Validate status
    const validStatuses = ["pending", "under_review", "approved", "rejected"]
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // If status is rejected, rejection_reason is required
    if (status === "rejected" && !rejection_reason) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 })
    }

    // If status is approved, check if required documents are uploaded
    if (status === "approved") {
      // Get documents for this registration
      const { data: documents, error: documentsError } = await supabase
        .from("shop_owner_documents")
        .select("document_type")
        .eq("registration_id", registrationId)

      if (documentsError) {
        return NextResponse.json({ error: "Failed to check documents" }, { status: 500 })
      }

      // Check if required documents are uploaded
      const requiredDocumentTypes = ["identity_proof", "business_license"]
      const uploadedDocumentTypes = documents.map((doc) => doc.document_type)

      const missingDocuments = requiredDocumentTypes.filter((docType) => !uploadedDocumentTypes.includes(docType))

      if (missingDocuments.length > 0) {
        return NextResponse.json(
          {
            error: "Missing required documents",
            missingDocuments,
          },
          { status: 400 },
        )
      }
    }

    // Prepare update data
    const updateData: any = { status }

    if (status === "rejected") {
      updateData.rejection_reason = rejection_reason
    }

    if (status === "approved") {
      updateData.approved_at = new Date().toISOString()
      updateData.approved_by = session.user.id
      updateData.rejection_reason = null
    }

    // Update shop owner registration status
    const { data, error } = await supabase
      .from("shop_owner_registrations")
      .update(updateData)
      .eq("id", registrationId)
      .select("*, approved_by(*), sales_officer_id(*)")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: `Shop owner registration ${status}`,
      registration: data,
    })
  } catch (error) {
    console.error("Error updating shop owner registration status:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
