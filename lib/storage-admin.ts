import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

// Update the bucket name to match your manually created bucket
export const PRODUCT_IMAGES_BUCKET = "productsimages"

/**
 * Uploads a file to Supabase Storage using admin privileges
 * @param file The file to upload (Buffer or Blob)
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @param contentType The content type of the file
 * @returns The URL of the uploaded file or null if upload failed
 */
export async function uploadFileAdmin(
  file: Buffer | Blob,
  bucket: string,
  path: string,
  contentType: string,
): Promise<string | null> {
  try {
    console.log(`[ADMIN] Uploading file to bucket "${bucket}" at path "${path}"...`)
    console.log("File size:", file instanceof Buffer ? file.length : (file as Blob).size, "bytes")

    // Upload the file to the specified bucket and path
    const { data, error } = await adminSupabase.storage.from(bucket).upload(path, file, {
      contentType,
      upsert: true,
    })

    if (error) {
      console.error("[ADMIN] Error uploading file:", error)
      return null
    }

    console.log("[ADMIN] Upload successful, data:", data)

    // Get the public URL of the uploaded file
    const { data: urlData } = adminSupabase.storage.from(bucket).getPublicUrl(path)

    if (!urlData || !urlData.publicUrl) {
      console.error("[ADMIN] Failed to generate public URL")
      return null
    }

    console.log("[ADMIN] Public URL:", urlData.publicUrl)
    return urlData.publicUrl
  } catch (error) {
    console.error("[ADMIN] Error in uploadFileAdmin function:", error)
    return null
  }
}

/**
 * Lists all buckets in the storage
 * @returns Array of bucket names or null if failed
 */
export async function listBuckets(): Promise<string[] | null> {
  try {
    const { data, error } = await adminSupabase.storage.listBuckets()

    if (error) {
      console.error("[ADMIN] Error listing buckets:", error)
      return null
    }

    return data.map((bucket) => bucket.name)
  } catch (error) {
    console.error("[ADMIN] Error in listBuckets function:", error)
    return null
  }
}

/**
 * Ensures a bucket exists, creates it if it doesn't
 * @param bucketName The name of the bucket
 * @returns True if the bucket exists or was created successfully
 */
export async function ensureBucketExistsAdmin(bucketName: string): Promise<boolean> {
  try {
    const buckets = await listBuckets()

    if (!buckets) {
      return false
    }

    if (buckets.includes(bucketName)) {
      console.log(`[ADMIN] Bucket "${bucketName}" already exists`)
      return true
    }

    // Create the bucket
    const { error } = await adminSupabase.storage.createBucket(bucketName, {
      public: true,
    })

    if (error) {
      console.error(`[ADMIN] Error creating bucket "${bucketName}":`, error)
      return false
    }

    console.log(`[ADMIN] Bucket "${bucketName}" created successfully`)
    return true
  } catch (error) {
    console.error("[ADMIN] Error in ensureBucketExistsAdmin function:", error)
    return false
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @returns True if the file was deleted successfully
 */
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const { error } = await adminSupabase.storage.from(bucket).remove([path])

    if (error) {
      console.error(`Error deleting file: ${error.message}`)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteFile function:", error)
    return false
  }
}

/**
 * Extracts the path from a Supabase Storage URL
 * @param url The Supabase Storage URL
 * @param bucket The bucket name
 * @returns The path within the bucket or null if not a valid URL
 */
export function getPathFromUrl(url: string, bucket: string): string | null {
  try {
    // Example URL: https://xxxx.supabase.co/storage/v1/object/public/${bucket}/path/to/file.jpg
    const regex = new RegExp(`/storage/v1/object/public/${bucket}/(.+)`)
    const match = url.match(regex)
    return match ? match[1] : null
  } catch (error) {
    console.error("Error extracting path from URL:", error)
    return null
  }
}
