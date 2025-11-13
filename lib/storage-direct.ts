import { createClient } from "@supabase/supabase-js"

// Create a direct Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Update the bucket name to match your manually created bucket
export const PRODUCT_IMAGES_BUCKET = "productsimages"

/**
 * Uploads a file to Supabase Storage using a direct client
 * @param file The file to upload (Buffer or Blob)
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @param contentType The content type of the file
 * @returns The URL of the uploaded file or null if upload failed
 */
export async function uploadFileDirect(
  file: Buffer | Blob,
  bucket: string,
  path: string,
  contentType: string,
): Promise<string | null> {
  try {
    console.log(`Uploading file to bucket "${bucket}" at path "${path}"...`)
    console.log("File size:", file instanceof Buffer ? file.length : (file as Blob).size, "bytes")

    // Upload the file to the specified bucket and path
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType,
      upsert: true,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return null
    }

    console.log("Upload successful, data:", data)

    // Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)

    if (!urlData || !urlData.publicUrl) {
      console.error("Failed to generate public URL")
      return null
    }

    console.log("Public URL:", urlData.publicUrl)
    return urlData.publicUrl
  } catch (error) {
    console.error("Error in uploadFileDirect function:", error)
    return null
  }
}
