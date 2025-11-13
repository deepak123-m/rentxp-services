import { createClient } from "@/lib/supabase/server"
import { uploadFileAdmin, PRODUCT_IMAGES_BUCKET } from "@/lib/storage-admin"
import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// List shop owner registrations
export async function GET(request: NextRequest) {
  try {
    // Create a direct Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Extract the token from the Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    // Validate the token
    const { data: authData, error: authError } = await supabase.auth.getUser(token)

    if (authError || !authData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const user = authData.user

    // Get query parameters
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(url.searchParams.get("limit") || "20"), 100)
    const status = url.searchParams.get("status")
    const sales_officer_id = url.searchParams.get("sales_officer_id")

    // Calculate offset
    const offset = (page - 1) * limit

    // Build query
    let query = supabase.from("shop_owner_registrations").select("*", { count: "exact" })

    // Add filters if provided
    if (status) {
      query = query.eq("status", status)
    }

    if (sales_officer_id) {
      query = query.eq("sales_officer_id", sales_officer_id)
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1).order("created_at", { ascending: false })

    // Execute query
    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        shop_owner_registrations: data,
        count: count || 0,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error("Error listing shop owner registrations:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Create a new shop owner registration
export async function POST(request: NextRequest) {
  try {
    // Create a direct Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Check if the request is multipart/form-data
    const contentType = request.headers.get("content-type") || ""
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Content type must be multipart/form-data" }, { status: 400 })
    }

    // Parse the multipart form data
    const formData = await request.formData()

    // Extract registration data from fields
    const user_id = formData.get("user_id") as string
    const merchant_segment = formData.get("merchant_segment") as string
    const merchant_sub_segment = (formData.get("merchant_sub_segment") as string) || null
    const shop_name = formData.get("shop_name") as string
    const shop_display_name = (formData.get("shop_display_name") as string) || null
    const shop_phone = formData.get("shop_phone") as string
    const shop_email = (formData.get("shop_email") as string) || null
    const shop_website = (formData.get("shop_website") as string) || null
    const shop_gstin = (formData.get("shop_gstin") as string) || null
    const owner_name = formData.get("owner_name") as string
    const owner_phone = (formData.get("owner_phone") as string) || null
    const owner_email = (formData.get("owner_email") as string) || null
    const pan_number = (formData.get("pan_number") as string) || null
    const sales_officer_id = (formData.get("sales_officer_id") as string) || null
    const document = formData.get("document") as File | null

    // Validate required fields
    if (!merchant_segment || !shop_name || !shop_phone || !owner_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate enum values
    const validMerchantSegments = [
      "grocery",
      "electronics",
      "clothing",
      "pharmacy",
      "hardware",
      "stationery",
      "restaurant",
      "services",
      "other",
    ]
    const validMerchantSubSegments = [
      "kirana_store",
      "supermarket",
      "specialty_store",
      "organic_store",
      "beverage_store",
      "mobile_store",
      "computer_store",
      "home_appliances",
      "other",
    ]

    if (!validMerchantSegments.includes(merchant_segment)) {
      return NextResponse.json({ error: "Invalid merchant_segment" }, { status: 400 })
    }

    if (merchant_sub_segment && !validMerchantSubSegments.includes(merchant_sub_segment)) {
      return NextResponse.json({ error: "Invalid merchant_sub_segment" }, { status: 400 })
    }

    let document_url: string | null = null

    if (document) {
      // Generate a unique filename
      const fileExt = document.name.split(".").pop() || "jpg"
      const uniqueFileName = `shop_owner_registrations/${uuidv4()}.${fileExt}`

      // Convert file to buffer
      const arrayBuffer = await document.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload to Supabase Storage
      document_url = await uploadFileAdmin(buffer, PRODUCT_IMAGES_BUCKET, uniqueFileName, document.type)

      if (!document_url) {
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
      }
    }

    // Create new shop owner registration
    const { data, error } = await supabase
      .from("shop_owner_registrations")
      .insert({
        user_id,
        merchant_segment,
        merchant_sub_segment,
        shop_name,
        shop_display_name,
        shop_phone,
        shop_email,
        shop_website,
        shop_gstin,
        owner_name,
        owner_phone,
        owner_email,
        pan_number,
        sales_officer_id,
        submitted_at: new Date().toISOString(),
        document_url: document_url,
        status: "pending", // Set initial status
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Shop owner registration created successfully",
      registration: data,
    })
  } catch (error) {
    console.error("Error creating shop owner registration:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
