import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { coupon_id, user_id } = body

    if (!coupon_id || !user_id) {
      return NextResponse.json(
        { error: "Missing coupon_id or user_id" },
        { status: 400 }
      )
    }

    // Check if user already used the coupon
    const { data: existingUsage, error: usageError } = await supabase
      .from("coupon_usages")
      .select("id")
      .eq("coupon_id", coupon_id)
      .eq("user_id", user_id)
      .maybeSingle()

    if (usageError) {
      return NextResponse.json(
        { error: "Failed to check coupon usage", details: usageError.message },
        { status: 500 }
      )
    }

    if (existingUsage) {
      return NextResponse.json(
        { error: "Coupon already used by this user" },
        { status: 409 }
      )
    }

    // Insert usage record
    const { error: insertError } = await supabase
      .from("coupon_usages")
      .insert({ coupon_id, user_id })

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to record coupon usage", details: insertError.message },
        { status: 500 }
      )
    }

    // Increment current_uses in coupons table
    const { error: updateError } = await supabase
      .rpc("increment_coupon_usage", { target_coupon_id: coupon_id })

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to increment coupon usage count", details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Coupon usage recorded successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Unexpected server error", details: (error as Error).message },
      { status: 500 }
    )
  }
}
