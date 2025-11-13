import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Update the bucket name to match your manually created bucket
export const PRODUCT_IMAGES_BUCKET = "productsimages"

/**
 * Uploads a file to Supabase Storage with enhanced debugging
 * @param file The file to upload (Buffer or Blob)
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @param contentType The content type of the file
 * @returns The URL of the uploaded file or null if upload failed
 */
export async function uploadFile(
  file: Buffer | Blob,
  bucket: string,
  path: string,
  contentType: string,
): Promise<string | null> {
  try {
    // Validate input parameters
    if (!file || !bucket || !path || !contentType) {
      console.error("Missing required parameters:", { file: !!file, bucket, path, contentType })
      throw new Error("Missing required parameters: file, bucket, path, or contentType")
    }

    console.log("File size:", file.byteLength || (file as Blob).size, "bytes")
    console.log("Content type:", contentType)
    console.log("Bucket:", bucket)
    console.log("Path:", path)

    // Check if the bucket exists
    const { data: buckets, error: listBucketsError } = await supabase.storage.listBuckets()

    if (listBucketsError) {
      console.error("Error listing buckets:", listBucketsError)
      throw new Error(`Error listing buckets: ${listBucketsError.message}`)
    }

    console.log(
      "Available buckets:",
      buckets.map((b) => b.name),
    )

    const bucketExists = buckets.some((b) => b.name === bucket)
    if (!bucketExists) {
      console.error(`Bucket "${bucket}" does not exist!`)
      throw new Error(`Bucket "${bucket}" does not exist. Please create it manually in the Supabase Dashboard.`)
    }

    // Upload the file to the specified bucket and path
    console.log(`Uploading file to bucket "${bucket}" at path "${path}"...`)
    const { data: uploadData, error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      contentType,
      upsert: true, // Overwrite the file if it already exists
    })

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      throw new Error(`Error uploading file: ${uploadError.message}`)
    }

    if (!uploadData) {
      console.error("Upload succeeded but no data was returned.")
      throw new Error("Upload succeeded but no data was returned.")
    }

    console.log("Upload successful, data:", uploadData)

    // Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uploadData.path)

    console.log("URL data:", urlData)

    if (!urlData || !urlData.publicUrl) {
      console.error("Failed to generate public URL for the uploaded file.")
      throw new Error("Failed to generate public URL for the uploaded file.")
    }

    console.log(`Public URL for the uploaded file: ${urlData.publicUrl}`)
    return urlData.publicUrl
  } catch (error) {
    console.error("Error in uploadFile function:", error)
    return null
  }
}

/**
 * Uploads multiple files to Supabase Storage
 * @param files Array of files to upload
 * @param bucket The storage bucket name
 * @param basePath The base path within the bucket
 * @returns Array of URLs for the uploaded files
 */
export async function uploadMultipleFiles(
  files: Array<{ file: Buffer | Blob; contentType: string; filename: string }>,
  bucket: string,
  basePath: string,
): Promise<string[]> {
  const uploadedUrls: string[] = []

  // Upload each file
  for (const { file, contentType, filename } of files) {
    const path = `${basePath}/${filename}`
    const url = await uploadFile(file, bucket, path, contentType)
    if (url) {
      uploadedUrls.push(url)
    }
  }

  return uploadedUrls
}

/**
 * Deletes a file from Supabase Storage
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @returns True if the file was deleted successfully
 */
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

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
    // Example URL: https://xxxx.supabase.co/storage/v1/object/public/bucket-name/path/to/file.jpg
    const regex = new RegExp(`/storage/v1/object/public/${bucket}/(.+)`)
    const match = url.match(regex)
    return match ? match[1] : null
  } catch (error) {
    console.error("Error extracting path from URL:", error)
    return null
  }
}

export async function ensureBucketExists(bucketName: string): Promise<boolean> {
  return true // Always return true to bypass bucket creation
}

export async function uploadFileSimple(
  file: Buffer,
  bucket: string,
  path: string,
  contentType: string,
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType,
      upsert: true,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return null
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
    return urlData.publicUrl
  } catch (error) {
    console.error("Error in uploadFileSimple function:", error)
    return null
  }
}
