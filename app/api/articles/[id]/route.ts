import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { handleCors, setCorsHeaders } from "@/lib/cors"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const id = params.id

    const { data, error } = await supabaseAdmin.from("articles").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({ article: data })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error fetching article:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Handle preflight OPTIONS request
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const id = params.id
    const body = await request.json()
    const {
      name,
      description,
      weight,
      unit_of_measurement,
      category_id,
      sub_category_id,
      mrp,
      cost_price,
      product_photos,
      hsn_code,
      gst_percentage,
    } = body

    // Check if article exists
    const { data: existingArticle, error: checkError } = await supabaseAdmin
      .from("articles")
      .select("id")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Update article
    const { data, error } = await supabaseAdmin
      .from("articles")
      .update({
        name,
        description,
        weight,
        unit_of_measurement,
        category_id,
        sub_category_id,
        mrp,
        cost_price,
        product_photos,
        hsn_code,
        gst_percentage,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({
      message: "Article updated successfully",
      article: data,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error updating article:", error)
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

    // Check if article exists
    const { data: existingArticle, error: checkError } = await supabaseAdmin
      .from("articles")
      .select("id")
      .eq("id", id)
      .single()

    if (checkError) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Delete article
    const { error } = await supabaseAdmin.from("articles").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({
      message: "Article deleted successfully",
      id,
    })
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Error deleting article:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request)
}
