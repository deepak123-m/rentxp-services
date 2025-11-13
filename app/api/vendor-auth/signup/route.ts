import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"
import { supabaseAdmin } from "@/lib/supabase"
import { setCorsHeaders } from "@/lib/cors"
import { v4 as uuidv4 } from "uuid"

const VENDOR_FILES_BUCKET = "vendor-documents" // Adjust as needed

export async function POST(request: NextRequest) {
  try {
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
          email: formData.get("email"),
          password: formData.get("password"),
          name: formData.get("name"),
          address: formData.get("address"),
          contact_number: formData.get("contact_number"),
          trade_license: formData.get("trade_license"),
          gst_number: formData.get("gst_number"),
          fssai_license: formData.get("fssai_license"),
          bank_account_number: formData.get("bank_account_number"),
          bank_name: formData.get("bank_name"),
          bank_ifsc: formData.get("bank_ifsc"),
          vendor_type: formData.get("vendor_type") || null,
          device_token: formData.get("device_token"),
          device_type: formData.get("device_type") || "unknown",
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
        const response = NextResponse.json(
          { error: "Failed to parse form data. Please check your request format." },
          { status: 400 },
        )
        return setCorsHeaders(request, response)
      }
    } else {
      // Handle JSON request
      try {
        const jsonData = await request.json()
        vendorData = {
          email: jsonData.email,
          password: jsonData.password,
          name: jsonData.name,
          address: jsonData.address,
          contact_number: jsonData.contact_number,
          trade_license: jsonData.trade_license,
          gst_number: jsonData.gst_number,
          fssai_license: jsonData.fssai_license,
          bank_account_number: jsonData.bank_account_number,
          bank_name: jsonData.bank_name,
          bank_ifsc: jsonData.bank_ifsc,
          vendor_type: jsonData.vendor_type || null,
          device_token: jsonData.device_token,
          device_type: jsonData.device_type || "unknown",
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
        const response = NextResponse.json({ error: "Failed to parse JSON data" }, { status: 400 })
        return setCorsHeaders(request, response)
      }
    }

    // Validate required fields
    if (!vendorData.email || !vendorData.password || !vendorData.name) {
      const response = NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
      return setCorsHeaders(request, response)
    }

    const supabase = createClient()

    // Create vendor auth user (with role metadata)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: vendorData.email,
      password: vendorData.password,
      options: {
        data: {
          full_name: vendorData.name,
          role: "vendor",
        },
      },
    })

    if (authError) {
      const response = NextResponse.json({ error: authError.message }, { status: 400 })
      return setCorsHeaders(request, response)
    }

    if (!authData.user) {
      const response = NextResponse.json({ error: "User creation failed" }, { status: 500 })
      return setCorsHeaders(request, response)
    }

    const vendorId = authData.user.id

    // Upload files if any
    const fileUrls: { [key: string]: string } = {}
    if (Object.keys(files).length > 0) {
      const storageFolder = `vendors/${vendorId}/documents`

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
            }
          }
        } catch (error) {
          console.error(`Error processing ${fieldName}:`, error)
          fileUploadErrors[fieldName] = `Failed to process ${fieldName}`
        }
      }
    }

    // Create vendor entry in vendors table
    const { error: vendorError } = await supabaseAdmin.from("vendors").insert({
      id: vendorId,
      name: vendorData.name,
      email: vendorData.email,
      address: vendorData.address,
      contact_number: vendorData.contact_number,
      trade_license: vendorData.trade_license,
      gst_number: vendorData.gst_number,
      fssai_license: vendorData.fssai_license,
      bank_account_number: vendorData.bank_account_number,
      bank_name: vendorData.bank_name,
      bank_ifsc: vendorData.bank_ifsc,
      vendor_type: vendorData.vendor_type,
      ...fileUrls, // Include any file URLs that were uploaded
    })

    if (vendorError) {
      const response = NextResponse.json({ error: vendorError.message }, { status: 500 })
      return setCorsHeaders(request, response)
    }

    // Store device token if provided
    if (vendorData.device_token) {
      await supabaseAdmin.from("device_tokens").delete().eq("user_id", vendorId)

      await supabaseAdmin.from("device_tokens").insert({
        user_id: vendorId,
        device_token: vendorData.device_token,
        device_type: vendorData.device_type,
      })
    }

    // Sign in to get tokens
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: vendorData.email,
      password: vendorData.password,
    })

    const responseData: any = {
      message: "Vendor created successfully",
      user: authData.user,
      ...(Object.keys(fileUploadErrors).length > 0 && { fileUploadErrors }),
    }

    if (sessionData?.session) {
      responseData.tokens = {
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        expires_at: sessionData.session.expires_at,
      }
    } else if (sessionError) {
      console.error("Session error:", sessionError)
      responseData.warning = "Could not establish session"
    }

    const response = NextResponse.json(responseData)
    return setCorsHeaders(request, response)
  } catch (error) {
    console.error("Vendor signup error:", error)
    const response = NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    return setCorsHeaders(request, response)
  }
}
