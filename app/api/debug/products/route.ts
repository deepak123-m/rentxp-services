import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// Force dynamic to ensure the route is not statically optimized
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get all products without any filtering
    const { data: products, error, count } = await supabase.from("products").select("*", { count: "exact" })

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    // Get table information
    const { data: tableInfo, error: tableError } = await supabase.from("products").select("*").limit(1)

    // Get column information
    const columns =
      tableInfo && tableInfo.length > 0
        ? Object.keys(tableInfo[0]).map((key) => ({
            name: key,
            sample: tableInfo[0][key],
          }))
        : []

    return NextResponse.json({
      message: "Debug information for products table",
      total_products: count || 0,
      products,
      table_info: {
        columns,
      },
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
