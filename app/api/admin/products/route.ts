import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-utils"

// Force dynamic to ensure the route is not statically optimized
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get user role
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "Error fetching user profile" }, { status: 500 })
    }

    // Only admins can access this endpoint
    if (profileData.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const status = searchParams.get("status") || "pending" // Default to pending
    const query = searchParams.get("query")
    const sort = searchParams.get("sort") || "submitted_at"
    const order = searchParams.get("order") || "desc" // Default to newest first
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Build the query
    let productsQuery = supabase.from("products").select("*, categories(name)")

    // Filter by status if provided
    if (status !== "all") {
      productsQuery = productsQuery.eq("approval_status", status)
    }

    // Search by name if query is provided
    if (query) {
      productsQuery = productsQuery.ilike("name", `%${query}%`)
    }

    // Apply sorting
    if (sort && ["name", "price", "submitted_at", "created_at"].includes(sort)) {
      productsQuery = productsQuery.order(sort, { ascending: order === "asc" })
    }

    // Apply pagination
    productsQuery = productsQuery.range(offset, offset + limit - 1)

    const { data: products, error, count } = await productsQuery

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json({
      products,
      pagination: {
        total: count || 0,
        offset,
        limit,
      },
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
