import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { v4 as uuidv4 } from "uuid"

// Define the bucket name to use for vendor files
const VENDOR_FILES_BUCKET = "productsimages"

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

  const { searchParams } = new URL(request.url)
  const isActive = searchParams.get("is_active")
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  let query = supabase.from("vendors").select("*")

  if (isActive !== null) {
    query = query.eq("is_active", isActive === "true")
  }

  const { data, error } = await query.range(offset, offset + limit - 1).order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vendors: data })
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
  const supabaseAdmin = createClient()

  // Check if the request is multipart/form-data
  const contentType = request.headers.get("content-type") || ""
  const isMultipart = contentType.includes("multipart/form-data")

  let vendorData: any = {}
  const files: { [key: string]: File } = {}
  const fileUploadErrors: { [key: string]: string } = {}

  if (isMultipart) {
    try {
      const formData = await request.formData()

      // Extract vendor data from form fields
      vendorData = {
        name: formData.get("name"),
        address: formData.get("address"),
        contact_number: formData.get("contact_number"),
        email: formData.get("email"),
        trade_license: formData.get("trade_license"),
        gst_number: formData.get("gst_number"),
        fssai_license: formData.get("fssai_license"),
        bank_account_number: formData.get("bank_account_number"),
        bank_name: formData.get("bank_name"),
        bank_ifsc: formData.get("bank_ifsc"),
        is_active: formData.get("is_active") === "true",
        vendor_type: (formData.get("vendor_type") as string) || null,
      }

      // Extract files
      const fileFields = ["gst_file", "fssai_file", "aadhar_file", "pan_file"]
      for (const field of fileFields) {
        const file = formData.get(field) as File
        if (file && file.size > 0) {
          files[field] = file
        }
      }
    } catch (error) {
      console.error("Error parsing form data:", error)
      return NextResponse.json(
        { error: "Failed to parse form data. Please check your request format." },
        { status: 400 },
      )
    }
  } else {
    // Handle JSON request
    try {
      const jsonData = await request.json()
      vendorData = {
        name: jsonData.name,
        address: jsonData.address,
        contact_number: jsonData.contact_number,
        email: jsonData.email,
        trade_license: jsonData.trade_license,
        gst_number: jsonData.gst_number,
        fssai_license: jsonData.fssai_license,
        bank_account_number: jsonData.bank_account_number,
        bank_name: jsonData.bank_name,
        bank_ifsc: jsonData.bank_ifsc,
        is_active: jsonData.is_active,
        vendor_type: jsonData.vendor_type || null,
      }

      // Handle base64 encoded files
      const base64Fields = {
        gst_file_base64: "gst_file",
        fssai_file_base64: "fssai_file",
        aadhar_file_base64: "aadhar_file",
        pan_file_base64: "pan_file",
      }

      for (const [base64Field, fileField] of Object.entries(base64Fields)) {
        if (jsonData[base64Field]) {
          try {
            // Convert base64 to File object
            const base64Data = jsonData[base64Field]
            const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

            if (matches && matches.length === 3) {
              const contentType = matches[1]
              const base64Content = matches[2]
              const binaryString = atob(base64Content)
              const byteArray = new Uint8Array(binaryString.length)

              for (let i = 0; i < binaryString.length; i++) {
                byteArray[i] = binaryString.charCodeAt(i)
              }

              const blob = new Blob([byteArray], { type: contentType })
              const extension = contentType.split("/")[1] || "pdf"
              const fileName = `${fileField}_${Date.now()}.${extension}`

              files[fileField] = new File([blob], fileName, { type: contentType })
            }
          } catch (error) {
            console.error(`Error processing ${base64Field}:`, error)
            fileUploadErrors[fileField] = `Failed to process ${base64Field}`
          }
        }
      }
    } catch (error) {
      console.error("Error parsing JSON:", error)
      return NextResponse.json({ error: "Failed to parse JSON data" }, { status: 400 })
    }
  }

  // Validate required fields
  if (!vendorData.name) {
    return NextResponse.json({ error: "Vendor name is required" }, { status: 400 })
  }

  try {
    // We'll create the vendor first to get the ID, then update with file URLs
    const { data: vendor, error: insertError } = await supabaseAdmin
      .from("vendors")
      .insert([vendorData])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Now we have the vendor ID, we can upload files
    const vendorId = vendor.id
    const storageFolder = `vendors/${vendorId}/documents`
    const fileUrls: { [key: string]: string } = {}

    // Custom function to upload files with the correct bucket name
    async function uploadVendorFile(file: File, path: string) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { data, error } = await supabaseAdmin.storage.from(VENDOR_FILES_BUCKET).upload(path, buffer, {
          contentType: file.type,
          upsert: true,
        })

        if (error) {
          console.error("Error uploading file:", error)
          return { url: null, error }
        }

        // Get the public URL
        const { data: urlData } = supabaseAdmin.storage.from(VENDOR_FILES_BUCKET).getPublicUrl(path)

        return { url: urlData.publicUrl, error: null }
      } catch (error) {
        console.error("Error in uploadVendorFile:", error)
        return { url: null, error: { message: "Failed to upload file" } }
      }
    }

    for (const [fieldName, file] of Object.entries(files)) {
      try {
        const fileExtension = file.name.split(".").pop() || "pdf"
        const fileName = `${fieldName}_${uuidv4()}.${fileExtension}`
        const filePath = `${storageFolder}/${fileName}`

        console.log(`Uploading ${fieldName} to ${VENDOR_FILES_BUCKET}/${filePath}`)

        const { url, error } = await uploadVendorFile(file, filePath)

        if (error) {
          fileUploadErrors[fieldName] = error.message
          console.error(`Error uploading ${fieldName}:`, error)
        } else if (url) {
          // Map file field names to database column names
          const fieldMapping: { [key: string]: string } = {
            gst_file: "gst_file_url",
            fssai_file: "fssai_file_url",
            aadhar_file: "aadhar_file_url",
            pan_file: "pan_file_url",
          }

          if (fieldMapping[fieldName]) {
            fileUrls[fieldMapping[fieldName]] = url
            console.log(`Successfully uploaded ${fieldName} to ${url}`)
          }
        }
      } catch (error) {
        console.error(`Error processing ${fieldName}:`, error)
        fileUploadErrors[fieldName] = `Failed to process ${fieldName}`
      }
    }

    // Update vendor with file URLs if any were uploaded
    let updatedVendor = vendor
    if (Object.keys(fileUrls).length > 0) {
      const { data, error: updateError } = await supabaseAdmin
        .from("vendors")
        .update(fileUrls)
        .eq("id", vendorId)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating vendor with file URLs:", updateError)
      } else if (data) {
        updatedVendor = data
      }
    }

    return NextResponse.json({
      message: "Vendor created successfully",
      vendor: updatedVendor,
      ...(Object.keys(fileUploadErrors).length > 0 && { fileUploadErrors }),
    })
  } catch (error) {
    console.error("Error creating vendor:", error)
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 })
  }
}
