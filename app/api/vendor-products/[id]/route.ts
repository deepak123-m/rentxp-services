import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase" // Assuming you have a supabase client initialized.
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params // Correctly extract vendor id from params
  const url = new URL(request.url)
  const name = url.searchParams.get("name")
  const category = url.searchParams.get("category")
  const priceMin = url.searchParams.get("price_min")
  const priceMax = url.searchParams.get("price_max")
  const approvalStatus = url.searchParams.get("approval_status")
  const stockMin = url.searchParams.get("stock_min")
  const stockMax = url.searchParams.get("stock_max")
  const createdAtStart = url.searchParams.get("created_at_start")
  const createdAtEnd = url.searchParams.get("created_at_end")
  const limit = Number.parseInt(url.searchParams.get("limit") || "50")
  const offset = Number.parseInt(url.searchParams.get("offset") || "0")
  try {
    // Build the query for products with pagination
    let query = supabaseAdmin.from("products").select("*").eq("vendor_id", id)
    // Apply filters if provided
    if (name) {
      query = query.ilike("name", `%${name}%`) // Case-insensitive search for name
    }
    if (category) {
      query = query.ilike("category", `%${category}%`) // Case-insensitive search for category
    }
    if (priceMin) {
      query = query.gte("price", Number(priceMin)) // Filter by minimum price
    }
    if (priceMax) {
      query = query.lte("price", Number(priceMax)) // Filter by maximum price
    }
    if (approvalStatus) {
      query = query.eq("approval_status", approvalStatus) // Filter by approval status
    }
    if (stockMin) {
      query = query.gte("stock", Number(stockMin)) // Filter by minimum stock
    }
    if (stockMax) {
      query = query.lte("stock", Number(stockMax)) // Filter by maximum stock
    }
    if (createdAtStart) {
      query = query.gte("created_at", new Date(createdAtStart)) // Filter by start date of creation
    }
    if (createdAtEnd) {
      query = query.lte("created_at", new Date(createdAtEnd)) // Filter by end date of creation
    }
    // Execute the paginated query
    const { data, error: dataError } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)
    // Handle errors in data query
    if (dataError) {
      return NextResponse.json({ error: dataError.message }, { status: 500 })
    }
    // Now, fetch the total count (without pagination)
    const { count, error: countError } = await supabaseAdmin
      .from("products")
      .select("id", { count: "exact" }) // Fetch only the id to get count
      .eq("vendor_id", id)
    // Handle errors in count query
    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }
    // Return the filtered products and total count
    return NextResponse.json({
      products: data,
      count, // Total number of products matching the filters (without pagination)
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
