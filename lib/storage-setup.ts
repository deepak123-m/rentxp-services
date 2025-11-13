import { createClient } from "@supabase/supabase-js"

export async function setupStorage() {
  try {
    // Create a Supabase client with service role key
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Check if the productsimages bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return { success: false, error: bucketsError }
    }

    const bucketExists = buckets.some((bucket) => bucket.name === "productsimages")

    // Create the bucket if it doesn't exist
    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket("productsimages", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
      })

      if (error) {
        console.error("Error creating bucket:", error)
        return { success: false, error }
      }

      console.log("Created productsimages bucket")
    } else {
      console.log("productsimages bucket already exists")
    }

    // Check if the product_images table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from("product_images")
      .select("id")
      .limit(1)
      .catch(() => ({ data: null, error: { message: "Table does not exist" } }))

    // If table doesn't exist, create it
    if (tableCheckError || !tableExists) {
      // We'll need to use SQL to create the table
      const { error: createTableError } = await supabase.rpc("create_product_images_table")

      if (createTableError) {
        console.error("Error creating product_images table:", createTableError)
        return { success: false, error: createTableError }
      }

      console.log("Created product_images table")
    } else {
      console.log("product_images table already exists")
    }

    return { success: true }
  } catch (error) {
    console.error("Error setting up storage:", error)
    return { success: false, error }
  }
}
