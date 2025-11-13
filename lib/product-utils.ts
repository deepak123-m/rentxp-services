/**
 * Upload a product with images
 * @param productData Product data
 * @param images Array of image files
 * @returns Promise with the created product
 */
export async function uploadProductWithImages(
  productData: {
    name: string
    description?: string
    price: number
    stock?: number
    category?: string
    category_id?: string
    brand?: string
    hsn_code?: string
  },
  images: File[],
): Promise<{ product: any; imageUrls: string[] }> {
  try {
    // Create a FormData object
    const formData = new FormData()

    // Add product data to the form
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString())
      }
    })

    // Add images to the form
    images.forEach((image) => {
      formData.append("images", image)
    })

    // Send the request to the correct URL
    const response = await fetch("/api/products/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to upload product (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error uploading product with images:", error)
    throw error
  }
}

/**
 * Fetch products with optional filtering
 * @param options Filter and pagination options
 * @returns Promise with products and pagination info
 */
export async function fetchProducts(options: {
  category?: string
  query?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  order?: "asc" | "desc"
  limit?: number
  offset?: number
}) {
  try {
    const params = new URLSearchParams()

    if (options.category) params.append("category", options.category)
    if (options.query) params.append("query", options.query)
    if (options.minPrice) params.append("minPrice", options.minPrice.toString())
    if (options.maxPrice) params.append("maxPrice", options.maxPrice.toString())
    if (options.sort) params.append("sort", options.sort)
    if (options.order) params.append("order", options.order)
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.offset) params.append("offset", options.offset.toString())

    const response = await fetch(`/api/products?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch products (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

/**
 * Fetch a single product by ID
 * @param id Product ID
 * @returns Promise with the product data
 */
export async function fetchProductById(id: string) {
  try {
    const response = await fetch(`/api/products/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch product (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    throw error
  }
}

/**
 * Update a product
 * @param id Product ID
 * @param data Updated product data
 * @returns Promise with the updated product
 */
export async function updateProduct(
  id: string,
  data: {
    name?: string
    description?: string
    price?: number
    stock?: number
    category?: string
    category_id?: string
    image_url?: string
    brand?: string
    hsn_code?: string
    approval_status?: "pending" | "approved" | "rejected"
    rejection_reason?: string
  },
) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to update product (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }
}

/**
 * Delete a product
 * @param id Product ID
 * @returns Promise with the result
 */
export async function deleteProduct(id: string) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to delete product (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }
}

/**
 * Fetch admin products with optional filtering
 * @param options Filter and pagination options
 * @returns Promise with products and pagination info
 */
export async function fetchAdminProducts(options: {
  status?: "pending" | "approved" | "rejected" | "all"
  query?: string
  sort?: string
  order?: "asc" | "desc"
  limit?: number
  offset?: number
}) {
  try {
    const params = new URLSearchParams()

    if (options.status) params.append("status", options.status)
    if (options.query) params.append("query", options.query)
    if (options.sort) params.append("sort", options.sort)
    if (options.order) params.append("order", options.order)
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.offset) params.append("offset", options.offset.toString())

    const response = await fetch(`/api/admin/products?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch admin products (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching admin products:", error)
    throw error
  }
}

/**
 * Fetch vendor products with optional filtering
 * @param options Filter and pagination options
 * @returns Promise with products and pagination info
 */
export async function fetchVendorProducts(options: {
  status?: "pending" | "approved" | "rejected"
  query?: string
  sort?: string
  order?: "asc" | "desc"
  limit?: number
  offset?: number
}) {
  try {
    const params = new URLSearchParams()

    if (options.status) params.append("status", options.status)
    if (options.query) params.append("query", options.query)
    if (options.sort) params.append("sort", options.sort)
    if (options.order) params.append("order", options.order)
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.offset) params.append("offset", options.offset.toString())

    const response = await fetch(`/api/vendor/products?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch vendor products (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching vendor products:", error)
    throw error
  }
}
