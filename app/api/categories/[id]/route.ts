import { withAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Get a specific category
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const categoryId = params.id
    const supabase = createServerSupabaseClient()

    // Get the category with its subcategories
    const { data: category, error } = await supabase
      .from("categories")
      .select("*, subcategories:categories(id, name, image_url)")
      .eq("id", categoryId)
      .single()

    if (error) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Get products in this category
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, image_url")
      .eq("category_id", categoryId)
      .order("name", { ascending: true })
      .limit(10)

    if (productsError) {
      console.error("Error fetching category products:", productsError)
    }

    return NextResponse.json({
      category,
      products: products || [],
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Update a category (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and role
  const authResponse = await withAuth(request, ["admin"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const categoryId = params.id
    const supabase = createServerSupabaseClient()

    // Get the request body
    const body = await request.json()
    const { name, description, parent_id, is_active, image_url } = body

    // Check if the category exists
    const { data: existingCategory, error: checkError } = await supabase
      .from("categories")
      .select("id")
      .eq("id", categoryId)
      .single()

    if (checkError || !existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Validate parent_id if provided
    if (parent_id) {
      // Prevent setting parent to self
      if (parent_id === categoryId) {
        return NextResponse.json({ error: "A category cannot be its own parent" }, { status: 400 })
      }

      // Check if parent exists
      const { data: parentCategory, error: parentError } = await supabase
        .from("categories")
        .select("id")
        .eq("id", parent_id)
        .single()

      if (parentError || !parentCategory) {
        return NextResponse.json({ error: "Parent category not found" }, { status: 404 })
      }

      // Prevent circular references
      // This is a simplified check - a more robust solution would check the entire hierarchy
      const { data: childCategories } = await supabase.from("categories").select("id").eq("parent_id", categoryId)

      if (childCategories && childCategories.some((child) => child.id === parent_id)) {
        return NextResponse.json({ error: "Circular reference detected in category hierarchy" }, { status: 400 })
      }
    }

    // Build update object with only provided fields
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (parent_id !== undefined) updateData.parent_id = parent_id
    if (is_active !== undefined) updateData.is_active = is_active
    if (image_url !== undefined) updateData.image_url = image_url

    // Update the category
    const { data: updatedCategory, error: updateError } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", categoryId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Category updated successfully",
      category: updatedCategory,
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Delete a category (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and role
  const authResponse = await withAuth(request, ["admin"])
  if (authResponse.status === 401 || authResponse.status === 403) {
    return authResponse
  }

  try {
    const categoryId = params.id
    const supabase = createServerSupabaseClient()

    // Check if the category exists
    const { data: existingCategory, error: checkError } = await supabase
      .from("categories")
      .select("id")
      .eq("id", categoryId)
      .single()

    if (checkError || !existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Check if there are products using this category
    const { count: productsCount, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", categoryId)

    if (countError) {
      console.error("Error checking products:", countError)
    } else if (productsCount && productsCount > 0) {
      // Option 1: Return an error
      // return NextResponse.json({
      //   error: `Cannot delete category: ${productsCount} products are using this category`,
      // }, { status: 400 })

      // Option 2: Update products to remove the category reference
      const { error: updateError } = await supabase
        .from("products")
        .update({ category_id: null })
        .eq("category_id", categoryId)

      if (updateError) {
        console.error("Error updating products:", updateError)
        return NextResponse.json({ error: "Failed to update products using this category" }, { status: 500 })
      }
    }

    // Update child categories to point to the parent of this category
    // This maintains the hierarchy when a middle node is removed
    const { data: parentData } = await supabase.from("categories").select("parent_id").eq("id", categoryId).single()

    if (parentData) {
      const { error: updateChildrenError } = await supabase
        .from("categories")
        .update({ parent_id: parentData.parent_id })
        .eq("parent_id", categoryId)

      if (updateChildrenError) {
        console.error("Error updating child categories:", updateChildrenError)
      }
    }

    // Delete the category
    const { error: deleteError } = await supabase.from("categories").delete().eq("id", categoryId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Category deleted successfully",
      id: categoryId,
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
