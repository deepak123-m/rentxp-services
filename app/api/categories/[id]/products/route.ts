import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Get products in a specific category
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const categoryId = params.id
    const supabase = createServerSupabaseClient()

    // Parse query parameters
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const includeSubcategories = url.searchParams.get("include_subcategories") === "true"

    // Check if the category exists
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id, name")
      .eq("id", categoryId)
      .single()

    if (categoryError) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Get all subcategory IDs if requested
    let categoryIds = [categoryId]
    if (includeSubcategories) {
      const { data: subcategories } = await supabase.from("categories").select("id").eq("parent_id", categoryId)

      if (subcategories && subcategories.length > 0) {
        categoryIds = [...categoryIds, ...subcategories.map((sub) => sub.id)]
      }
    }

    // Get products in this category and subcategories
    const {
      data: products,
      error: productsError,
      count,
    } = await supabase
      .from("products")
      .select("*, product_images(*)", { count: "exact" })
      .in("category_id", categoryIds)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 })
    }

    return NextResponse.json({
      category,
      products,
      count,
      limit,
      offset,
      includeSubcategories,
      categoryIds,
    })
  } catch (error) {
    console.error("Error fetching category products:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
