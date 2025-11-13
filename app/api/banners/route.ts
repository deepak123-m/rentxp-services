import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { uploadFileAdmin, PRODUCT_IMAGES_BUCKET } from "@/lib/storage-admin"
import { v4 as uuidv4 } from "uuid"
import { handleCors, setCorsHeaders } from "@/lib/cors"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    const corsResponse = handleCors(request)
    if (corsResponse) return corsResponse
  
    try {
      const url = new URL(request.url)
      const limit = Number.parseInt(url.searchParams.get("limit") || "100")
      const offset = Number.parseInt(url.searchParams.get("offset") || "0")
  
      const { data: banners, error } = await supabaseAdmin
      .from("banners")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false })
  
      if (error) {
        console.error("Error listing banner images:", error)
        const response = NextResponse.json(
          { error: "Failed to list banner images." },
          { status: 500 }
        )
        return setCorsHeaders(request, response)
      }
  
   
  
      const response = NextResponse.json({
        banners: banners,
        count: banners.length,
        limit,
        offset,
      })
  
      return setCorsHeaders(request, response)
    } catch (err) {
      console.error("Unexpected error listing banners:", err)
      const response = NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      )
      return setCorsHeaders(request, response)
    }
  }