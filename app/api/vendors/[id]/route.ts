import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { v4 as uuidv4 } from "uuid"

// Define the bucket name to use for vendor files
const VENDOR_FILES_BUCKET = "productsimages"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

  const { data, error } = await supabase.from("vendors").select("*").eq("id", params.id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
  }

  return NextResponse.json({ vendor: data })
}


// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   const cookieStore = cookies()
//   const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
//   const supabaseAdmin = createClient()

//   const vendorId = params.id

//   // Check if vendor exists
//   const { data: existingVendor, error: vendorError } = await supabase
//     .from("vendors")
//     .select("*")
//     .eq("id", vendorId)
//     .single()

//   if (vendorError || !existingVendor) {
//     return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
//   }

//   // Check if the request is multipart/form-data
//   const contentType = request.headers.get("content-type") || ""
//   const isMultipart = contentType.includes("multipart/form-data")

//   const vendorData: any = {}
//   const files: { [key: string]: File } = {}
//   const fileUploadErrors: { [key: string]: string } = {}

//   if (isMultipart) {
//     try {
//       const formData = await request.formData()

//       // Extract vendor data from form fields
//       const formFields = [
//         "name",
//         "address",
//         "contact_number",
//         "email",
//         "trade_license",
//         "gst_number",
//         "fssai_license",
//         "bank_account_number",
//         "bank_name",
//         "bank_ifsc",
//         "vendor_type",
//       ]

//       formFields.forEach((field) => {
//         const value = formData.get(field)
//         if (value !== null && value !== undefined) {
//           vendorData[field] = value
//         }
//       })

//       // Handle is_active separately as it's a boolean
//       const isActive = formData.get("is_active")
//       if (isActive !== null && isActive !== undefined) {
//         vendorData.is_active = isActive === "true"
//       }

//       // Extract files
//       const fileFields = ["gst_file", "fssai_file", "aadhar_file", "pan_file"]
//       for (const field of fileFields) {
//         const file = formData.get(field) as File
//         if (file && file.size > 0) {
//           files[field] = file
//         }
//       }
//     } catch (error) {
//       console.error("Error parsing form data:", error)
//       return NextResponse.json(
//         { error: "Failed to parse form data. Please check your request format." },
//         { status: 400 },
//       )
//     }
//   } else {
//     // Handle JSON request
//     try {
//       const jsonData = await request.json()

//       // Extract vendor data fields
//       const jsonFields = [
//         "name",
//         "address",
//         "contact_number",
//         "email",
//         "trade_license",
//         "gst_number",
//         "fssai_license",
//         "bank_account_number",
//         "bank_name",
//         "bank_ifsc",
//         "is_active",
//         "vendor_type",
//       ]

//       jsonFields.forEach((field) => {
//         if (jsonData[field] !== undefined) {
//           vendorData[field] = jsonData[field]
//         }
//       })

//       // Handle base64 encoded files
//       const base64Fields = {
//         gst_file_base64: "gst_file",
//         fssai_file_base64: "fssai_file",
//         aadhar_file_base64: "aadhar_file",
//         pan_file_base64: "pan_file",
//       }

//       for (const [base64Field, fileField] of Object.entries(base64Fields)) {
//         if (jsonData[base64Field]) {
//           try {
//             // Convert base64 to File object
//             const base64Data = jsonData[base64Field]
//             const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

//             if (matches && matches.length === 3) {
//               const contentType = matches[1]
//               const base64Content = matches[2]
//               const binaryString = atob(base64Content)
//               const byteArray = new Uint8Array(binaryString.length)

//               for (let i = 0; i < binaryString.length; i++) {
//                 byteArray[i] = binaryString.charCodeAt(i)
//               }

//               const blob = new Blob([byteArray], { type: contentType })
//               const extension = contentType.split("/")[1] || "pdf"
//               const fileName = `${fileField}_${Date.now()}.${extension}`

//               files[fileField] = new File([blob], fileName, { type: contentType })
//             }
//           } catch (error) {
//             console.error(`Error processing ${base64Field}:`, error)
//             fileUploadErrors[fileField] = `Failed to process ${base64Field}`
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error parsing JSON:", error)
//       return NextResponse.json({ error: "Failed to parse JSON data" }, { status: 400 })
//     }
//   }

//   try {
//     // Custom function to upload files with the correct bucket name
//     async function uploadVendorFile(file: File, path: string) {
//       try {
//         const arrayBuffer = await file.arrayBuffer()
//         const buffer = Buffer.from(arrayBuffer)

//         const { data, error } = await supabaseAdmin.storage.from(VENDOR_FILES_BUCKET).upload(path, buffer, {
//           contentType: file.type,
//           upsert: true,
//         })

//         if (error) {
//           console.error("Error uploading file:", error)
//           return { url: null, error }
//         }

//         // Get the public URL
//         const { data: urlData } = supabaseAdmin.storage.from(VENDOR_FILES_BUCKET).getPublicUrl(path)

//         return { url: urlData.publicUrl, error: null }
//       } catch (error) {
//         console.error("Error in uploadVendorFile:", error)
//         return { url: null, error: { message: "Failed to upload file" } }
//       }
//     }

//     // Upload files to storage and get URLs
//     const fileUrls: { [key: string]: string } = {}
//     const storageFolder = `vendors/${vendorId}/documents`

//     for (const [fieldName, file] of Object.entries(files)) {
//       try {
//         const fileExtension = file.name.split(".").pop() || "pdf"
//         const fileName = `${fieldName}_${uuidv4()}.${fileExtension}`
//         const filePath = `${storageFolder}/${fileName}`

//         console.log(`Uploading ${fieldName} to ${VENDOR_FILES_BUCKET}/${filePath}`)

//         const { url, error } = await uploadVendorFile(file, filePath)

//         if (error) {
//           fileUploadErrors[fieldName] = error.message
//           console.error(`Error uploading ${fieldName}:`, error)
//         } else if (url) {
//           // Map file field names to database column names
//           const fieldMapping: { [key: string]: string } = {
//             gst_file: "gst_file_url",
//             fssai_file: "fssai_file_url",
//             aadhar_file: "aadhar_file_url",
//             pan_file: "pan_file_url",
//           }

//           if (fieldMapping[fieldName]) {
//             fileUrls[fieldMapping[fieldName]] = url
//             console.log(`Successfully uploaded ${fieldName} to ${url}`)
//           }
//         }
//       } catch (error) {
//         console.error(`Error processing ${fieldName}:`, error)
//         fileUploadErrors[fieldName] = `Failed to process ${fieldName}`
//       }
//     }

//     // Update vendor record with file URLs
//     const vendorRecord = {
//       ...vendorData,
//       ...fileUrls,
//       updated_at: new Date().toISOString(),
//     }

//     const { data: vendor, error } = await supabaseAdmin
//       .from("vendors")
//       .update(vendorRecord)
//       .eq("id", vendorId)
//       .select()
//       .single()

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 })
//     }

//     return NextResponse.json({
//       message: "Vendor updated successfully",
//       vendor,
//       ...(Object.keys(fileUploadErrors).length > 0 && { fileUploadErrors }),
//     })
//   } catch (error) {
//     console.error("Error updating vendor:", error)
//     return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 })
//   }
// }




export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
  const supabaseAdmin = createClient()

  const vendorId = params.id

  // Check if vendor exists
  const { data: existingVendor, error: vendorError } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", vendorId)
    .single()

  if (vendorError || !existingVendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
  }

  // Delete vendor record
  const { error } = await supabaseAdmin.from("vendors").delete().eq("id", vendorId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Delete vendor files from storage
  try {
    const storageFolder = `vendors/${vendorId}`
    await supabaseAdmin.storage.from(VENDOR_FILES_BUCKET).remove([`${storageFolder}`])
  } catch (error) {
    console.error("Error deleting vendor files:", error)
    // Continue with the response even if file deletion fails
  }

  return NextResponse.json({ message: "Vendor deleted successfully" })
}


///------------------PATCH BEFORE VENDOR APP DEPLOY PROD ONE


// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   const cookieStore = cookies()
//   const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
//   const supabaseAdmin = createClient()

//   const vendorId = params.id

//   // Check if vendor exists
//   const { data: existingVendor, error: vendorError } = await supabase
//     .from("vendors")
//     .select("*")
//     .eq("vendor_id", vendorId)
//     .single()

//   if (vendorError || !existingVendor) {
//     return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
//   }

//   // Check if the request is multipart/form-data
//   const contentType = request.headers.get("content-type") || ""
//   const isMultipart = contentType.includes("multipart/form-data")

//   const vendorData: any = {}
//   const files: { [key: string]: File } = {}
//   const fileUploadErrors: { [key: string]: string } = {}

//   if (isMultipart) {
//     try {
//       const formData = await request.formData()

//       // Extract vendor data from form fields
//       const formFields = [
//         "name",
//         "address",
//         "contact_number",
//         "email",
//         "trade_license",
//         "gst_number",
//         "fssai_license",
//         "bank_account_number",
//         "bank_name",
//         "bank_ifsc",
//         "vendor_type",
//       ]

//       formFields.forEach((field) => {
//         const value = formData.get(field)
//         if (value !== null && value !== undefined) {
//           vendorData[field] = value
//         }
//       })

//       // Handle is_active separately as it's a boolean
//       const isActive = formData.get("is_active")
//       if (isActive !== null && isActive !== undefined) {
//         vendorData.is_active = isActive === "true"
//       }

//       // Extract files
//       const fileFields = ["gst_file", "fssai_file", "aadhar_file", "pan_file"]
//       for (const field of fileFields) {
//         const file = formData.get(field) as File
//         if (file && file.size > 0) {
//           files[field] = file
//         }
//       }
//     } catch (error) {
//       console.error("Error parsing form data:", error)
//       return NextResponse.json(
//         { error: "Failed to parse form data. Please check your request format." },
//         { status: 400 },
//       )
//     }
//   } else {
//     // Handle JSON request
//     try {
//       const jsonData = await request.json()

//       // Extract vendor data fields
//       const jsonFields = [
//         "name",
//         "address",
//         "contact_number",
//         "email",
//         "trade_license",
//         "gst_number",
//         "fssai_license",
//         "bank_account_number",
//         "bank_name",
//         "bank_ifsc",
//         "is_active",
//         "vendor_type",
//       ]

//       jsonFields.forEach((field) => {
//         if (jsonData[field] !== undefined) {
//           vendorData[field] = jsonData[field]
//         }
//       })

//       // Handle base64 encoded files
//       const base64Fields = {
//         gst_file_base64: "gst_file",
//         fssai_file_base64: "fssai_file",
//         aadhar_file_base64: "aadhar_file",
//         pan_file_base64: "pan_file",
//       }

//       for (const [base64Field, fileField] of Object.entries(base64Fields)) {
//         if (jsonData[base64Field]) {
//           try {
//             // Convert base64 to File object
//             const base64Data = jsonData[base64Field]
//             const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

//             if (matches && matches.length === 3) {
//               const contentType = matches[1]
//               const base64Content = matches[2]
//               const binaryString = atob(base64Content)
//               const byteArray = new Uint8Array(binaryString.length)

//               for (let i = 0; i < binaryString.length; i++) {
//                 byteArray[i] = binaryString.charCodeAt(i)
//               }

//               const blob = new Blob([byteArray], { type: contentType })
//               const extension = contentType.split("/")[1] || "pdf"
//               const fileName = `${fileField}_${Date.now()}.${extension}`

//               files[fileField] = new File([blob], fileName, { type: contentType })
//             }
//           } catch (error) {
//             console.error(`Error processing ${base64Field}:`, error)
//             fileUploadErrors[fileField] = `Failed to process ${base64Field}`
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error parsing JSON:", error)
//       return NextResponse.json({ error: "Failed to parse JSON data" }, { status: 400 })
//     }
//   }

//   try {
//     // Custom function to upload files with the correct bucket name
//     async function uploadVendorFile(file: File, path: string) {
//       try {
//         const arrayBuffer = await file.arrayBuffer()
//         const buffer = Buffer.from(arrayBuffer)

//         const { data, error } = await supabaseAdmin.storage.from(VENDOR_FILES_BUCKET).upload(path, buffer, {
//           contentType: file.type,
//           upsert: true,
//         })

//         if (error) {
//           console.error("Error uploading file:", error)
//           return { url: null, error }
//         }

//         // Get the public URL
//         const { data: urlData } = supabaseAdmin.storage.from(VENDOR_FILES_BUCKET).getPublicUrl(path)

//         return { url: urlData.publicUrl, error: null }
//       } catch (error) {
//         console.error("Error in uploadVendorFile:", error)
//         return { url: null, error: { message: "Failed to upload file" } }
//       }
//     }

//     // Upload files to storage and get URLs
//     const fileUrls: { [key: string]: string } = {}
//     const storageFolder = `vendors/${vendorId}/documents`

//     for (const [fieldName, file] of Object.entries(files)) {
//       try {
//         const fileExtension = file.name.split(".").pop() || "pdf"
//         const fileName = `${fieldName}_${uuidv4()}.${fileExtension}`
//         const filePath = `${storageFolder}/${fileName}`

//         console.log(`Uploading ${fieldName} to ${VENDOR_FILES_BUCKET}/${filePath}`)

//         const { url, error } = await uploadVendorFile(file, filePath)

//         if (error) {
//           fileUploadErrors[fieldName] = error.message
//           console.error(`Error uploading ${fieldName}:`, error)
//         } else if (url) {
//           // Map file field names to database column names
//           const fieldMapping: { [key: string]: string } = {
//             gst_file: "gst_file_url",
//             fssai_file: "fssai_file_url",
//             aadhar_file: "aadhar_file_url",
//             pan_file: "pan_file_url",
//           }

//           if (fieldMapping[fieldName]) {
//             fileUrls[fieldMapping[fieldName]] = url
//             console.log(`Successfully uploaded ${fieldName} to ${url}`)
//           }
//         }
//       } catch (error) {
//         console.error(`Error processing ${fieldName}:`, error)
//         fileUploadErrors[fieldName] = `Failed to process ${fieldName}`
//       }
//     }

//     // Update vendor record with file URLs
//     const vendorRecord = {
//       ...vendorData,
//       ...fileUrls,
//       updated_at: new Date().toISOString(),
//     }

//     const { data: vendor, error } = await supabaseAdmin
//       .from("vendors")
//       .update(vendorRecord)
//       .eq("id", vendorId)
//       .select()
//       .single()

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 })
//     }

//     return NextResponse.json({
//       message: "Vendor updated successfully",
//       vendor,
//       ...(Object.keys(fileUploadErrors).length > 0 && { fileUploadErrors }),
//     })
//   } catch (error) {
//     console.error("Error updating vendor:", error)
//     return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 })
//   }
// }



///----------BEFORE IMAGE URL PRODUCT


// import { type NextRequest, NextResponse } from "next/server"
// import { createClient } from "@/utils/supabase/server"
// import { cookies } from "next/headers"
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
// import type { Database } from "@/types/supabase"
// import { v4 as uuidv4 } from "uuid"

// // Define the bucket name to use for vendor files
// const VENDOR_FILES_BUCKET = "productsimages"

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   const cookieStore = cookies()
//   const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

//   const { data, error } = await supabase.from("vendors").select("*").eq("vendor_id", params.id).single()

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }

//   if (!data) {
//     return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
//   }

//   return NextResponse.json({ vendor: data })
// }



// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   const cookieStore = cookies()
//   const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
//   const supabaseAdmin = createClient()

//   const vendorId = params.id

//   // Check if vendor exists
//   const { data: existingVendor, error: vendorError } = await supabase
//     .from("vendors")
//     .select("*")
//     .eq("id", vendorId)
//     .single()

//   if (vendorError || !existingVendor) {
//     return NextResponse.json({ error: vendorError }, { status: 404 })
//   }

//   // Check if the request is multipart/form-data
//   const contentType = request.headers.get("content-type") || ""
//   const isMultipart = contentType.includes("multipart/form-data")

//   const vendorData: any = {}
//   const files: { [key: string]: File } = {}
//   const fileUploadErrors: { [key: string]: string } = {}

//   if (isMultipart) {
//     try {
//       const formData = await request.formData()

//       // Extract vendor data from form fields
//       const formFields = [
//         "name",
//         "address",
//         "contact_number",
//         "email",
//         "trade_license",
//         "gst_number",
//         "fssai_license",
//         "bank_account_number",
//         "bank_name",
//         "bank_ifsc",
//         "vendor_type",
//       ]

//       formFields.forEach((field) => {
//         const value = formData.get(field)
//         if (value !== null && value !== undefined) {
//           vendorData[field] = value
//         }
//       })

//       // Handle is_active separately as it's a boolean
//       const isActive = formData.get("is_active")
//       if (isActive !== null && isActive !== undefined) {
//         vendorData.is_active = isActive === "true"
//       }

//       // Extract files
//       const fileFields = ["gst_file", "fssai_file", "aadhar_file", "pan_file"]
//       for (const field of fileFields) {
//         const file = formData.get(field) as File
//         if (file && file.size > 0) {
//           files[field] = file
//         }
//       }
//     } catch (error) {
//       console.error("Error parsing form data:", error)
//       return NextResponse.json(
//         { error: "Failed to parse form data. Please check your request format." },
//         { status: 400 },
//       )
//     }
//   } else {
//     // Handle JSON request
//     try {
//       const jsonData = await request.json()

//       // Extract vendor data fields
//       const jsonFields = [
//         "name",
//         "address",
//         "contact_number",
//         "email",
//         "trade_license",
//         "gst_number",
//         "fssai_license",
//         "bank_account_number",
//         "bank_name",
//         "bank_ifsc",
//         "is_active",
//         "vendor_type",
//       ]

//       jsonFields.forEach((field) => {
//         if (jsonData[field] !== undefined) {
//           vendorData[field] = jsonData[field]
//         }
//       })

//       // Handle base64 encoded files
//       const base64Fields = {
//         gst_file_base64: "gst_file",
//         fssai_file_base64: "fssai_file",
//         aadhar_file_base64: "aadhar_file",
//         pan_file_base64: "pan_file",
//       }

//       for (const [base64Field, fileField] of Object.entries(base64Fields)) {
//         if (jsonData[base64Field]) {
//           try {
//             // Convert base64 to File object
//             const base64Data = jsonData[base64Field]
//             const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

//             if (matches && matches.length === 3) {
//               const contentType = matches[1]
//               const base64Content = matches[2]
//               const binaryString = atob(base64Content)
//               const byteArray = new Uint8Array(binaryString.length)

//               for (let i = 0; i < binaryString.length; i++) {
//                 byteArray[i] = binaryString.charCodeAt(i)
//               }

//               const blob = new Blob([byteArray], { type: contentType })
//               const extension = contentType.split("/")[1] || "pdf"
//               const fileName = `${fileField}_${Date.now()}.${extension}`

//               files[fileField] = new File([blob], fileName, { type: contentType })
//             }
//           } catch (error) {
//             console.error(`Error processing ${base64Field}:`, error)
//             fileUploadErrors[fileField] = `Failed to process ${base64Field}`
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error parsing JSON:", error)
//       return NextResponse.json({ error: "Failed to parse JSON data" }, { status: 400 })
//     }
//   }

//   try {
//     // Custom function to upload files with the correct bucket name
//     async function uploadVendorFile(file: File, path: string) {
//       try {
//         const arrayBuffer = await file.arrayBuffer()
//         const buffer = Buffer.from(arrayBuffer)

//         const { data, error } = await supabaseAdmin.storage.from(VENDOR_FILES_BUCKET).upload(path, buffer, {
//           contentType: file.type,
//           upsert: true,
//         })

//         if (error) {
//           console.error("Error uploading file:", error)
//           return { url: null, error }
//         }

//         // Get the public URL
//         const { data: urlData } = supabaseAdmin.storage.from(VENDOR_FILES_BUCKET).getPublicUrl(path)

//         return { url: urlData.publicUrl, error: null }
//       } catch (error) {
//         console.error("Error in uploadVendorFile:", error)
//         return { url: null, error: { message: "Failed to upload file" } }
//       }
//     }

//     // Upload files to storage and get URLs
//     const fileUrls: { [key: string]: string } = {}
//     const storageFolder = `vendors/${vendorId}/documents`

//     for (const [fieldName, file] of Object.entries(files)) {
//       try {
//         const fileExtension = file.name.split(".").pop() || "pdf"
//         const fileName = `${fieldName}_${uuidv4()}.${fileExtension}`
//         const filePath = `${storageFolder}/${fileName}`

//         console.log(`Uploading ${fieldName} to ${VENDOR_FILES_BUCKET}/${filePath}`)

//         const { url, error } = await uploadVendorFile(file, filePath)

//         if (error) {
//           fileUploadErrors[fieldName] = error.message
//           console.error(`Error uploading ${fieldName}:`, error)
//         } else if (url) {
//           // Map file field names to database column names
//           const fieldMapping: { [key: string]: string } = {
//             gst_file: "gst_file_url",
//             fssai_file: "fssai_file_url",
//             aadhar_file: "aadhar_file_url",
//             pan_file: "pan_file_url",
//           }

//           if (fieldMapping[fieldName]) {
//             fileUrls[fieldMapping[fieldName]] = url
//             console.log(`Successfully uploaded ${fieldName} to ${url}`)
//           }
//         }
//       } catch (error) {
//         console.error(`Error processing ${fieldName}:`, error)
//         fileUploadErrors[fieldName] = `Failed to process ${fieldName}`
//       }
//     }

//     // Update vendor record with file URLs
//     const vendorRecord = {
//       ...vendorData,
//       ...fileUrls,
//       updated_at: new Date().toISOString(),
//     }

//     const { data: vendor, error } = await supabaseAdmin
//       .from("vendors")
//       .update(vendorRecord)
//       .eq("id", vendorId)
//       .select()
//       .single()

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 })
//     }

//     return NextResponse.json({
//       message: "Vendor updated successfully",
//       vendor,
//       ...(Object.keys(fileUploadErrors).length > 0 && { fileUploadErrors }),
//     })
//   } catch (error) {
//     console.error("Error updating vendor:", error)
//     return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 })
//   }
// }

// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   const cookieStore = cookies()
//   const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
//   const supabaseAdmin = createClient()

//   const vendorId = params.id

//   // Check if vendor exists
//   const { data: existingVendor, error: vendorError } = await supabase
//     .from("vendors")
//     .select("*")
//     .eq("id", vendorId)
//     .single()

//   if (vendorError || !existingVendor) {
//     return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
//   }

//   // Delete vendor record
//   const { error } = await supabaseAdmin.from("vendors").delete().eq("id", vendorId)

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }

//   // Delete vendor files from storage
//   try {
//     const storageFolder = `vendors/${vendorId}`
//     await supabaseAdmin.storage.from(VENDOR_FILES_BUCKET).remove([`${storageFolder}`])
//   } catch (error) {
//     console.error("Error deleting vendor files:", error)
//     // Continue with the response even if file deletion fails
//   }

//   return NextResponse.json({ message: "Vendor deleted successfully" })
// }
