import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"
import { supabaseAdmin } from "@/lib/supabase"
import { setCorsHeaders } from "@/lib/cors"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const jsonData = await request.json()
    
    const { currentPassword, newPassword, userId } = jsonData

    // Validate required fields
    if (!currentPassword || !newPassword || !userId) {
      const response = NextResponse.json(
        { error: "currentPassword, newPassword, and userId are required" }, 
        { status: 400 }
      )
      return setCorsHeaders(request, response)
    }

    // 1. Verify current password against the vendors table
    const { data: vendorData, error: vendorError } = await supabaseAdmin
      .from("vendors")
      .select("*")
      .eq("vendor_id", userId)
      .single()

    if (vendorError || !vendorData) {
      const response = NextResponse.json(
        { error: "Vendor not found" }, 
        { status: 404 }
      )
      return setCorsHeaders(request, response)
    }
    console.log("-----------")
    console.log('vendor-password',vendorData?.password)
    console.log('current-password',vendorData)
    if (vendorData.password !== currentPassword) {
      const response = NextResponse.json(
        { error: "Current password is incorrect" }, 
        { status: 401 }
      )
      return setCorsHeaders(request, response)
    }

    // 2. Update password in Auth
    // const { error: authError } = await supabase.auth.updateUser({
    //   password: newPassword
    // })

        const { data, error:authError } = await supabaseAdmin.auth.admin.updateUserById(vendorData?.vendor_id, {
      password: newPassword,
    });

    if (authError) {
      const response = NextResponse.json(
        { error: `Failed to update auth password: ${authError.message}` }, 
        { status: 400 }
      )
      return setCorsHeaders(request, response)
    }

    // 3. Update password in vendors table and mark as changed
    const { error: updateError } = await supabaseAdmin
      .from("vendors")
      .update({ 
        password: newPassword,
        is_password_changed: true,
        updated_at: new Date().toISOString()
      })
      .eq("vendor_id", userId)

    if (updateError) {
      const response = NextResponse.json(
        { error: `Failed to update vendor record: ${updateError.message}` }, 
        { status: 500 }
      )
      return setCorsHeaders(request, response)
    }

    const response = NextResponse.json(
      { message: "Password updated successfully" }
    )
    return setCorsHeaders(request, response)

  } catch (error) {
    console.error("Change password error:", error)
    const response = NextResponse.json(
      { error: "An unexpected error occurred" }, 
      { status: 500 }
    )
    return setCorsHeaders(request, response)
  }
}
