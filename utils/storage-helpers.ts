import { createClient } from "@/utils/supabase/server"

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param path The path in storage where the file should be saved
 * @returns Object containing the URL of the uploaded file or an error
 */
export async function uploadFileToStorage(file: File, path: string) {
  const supabaseAdmin = createClient()

  try {
    // Determine the bucket based on the file type
    let bucket = "documents"
    const fileType = file.type.split("/")[0]

    if (fileType === "image") {
      bucket = "images"
    }

    // Upload the file
    const { data, error } = await supabaseAdmin.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return { url: null, error }
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error("Error in uploadFileToStorage:", error)
    return {
      url: null,
      error: { message: "Failed to upload file to storage" },
    }
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param url The public URL of the file to delete
 * @returns Success status
 */
export async function deleteFileFromStorage(url: string) {
  const supabaseAdmin = createClient()

  try {
    // Extract the path from the URL
    // URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = url.split("/storage/v1/object/public/")
    if (urlParts.length !== 2) {
      return { success: false, error: { message: "Invalid file URL format" } }
    }

    const bucketAndPath = urlParts[1].split("/")
    const bucket = bucketAndPath[0]
    const path = bucketAndPath.slice(1).join("/")

    // Delete the file
    const { error } = await supabaseAdmin.storage.from(bucket).remove([path])

    if (error) {
      console.error("Error deleting file:", error)
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteFileFromStorage:", error)
    return {
      success: false,
      error: { message: "Failed to delete file from storage" },
    }
  }
}
