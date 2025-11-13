import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const searchParams = request.nextUrl.searchParams

    const userId = searchParams.get("user_id")
    const code = searchParams.get("code")
    const isActive = searchParams.get("is_active")
    const minOrderAmount = searchParams.get("min_order_amount")
    const discountType = searchParams.get("discount_type")

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id in query" }, { status: 400 })
    }

    // Get IDs of coupons already used by this user
    const { data: usedCoupons, error: usedError } = await supabase
      .from("coupon_usages")
      .select("coupon_id")
      .eq("user_id", userId)

    if (usedError) {
      return NextResponse.json(
        { error: "Failed to fetch used coupons", details: usedError.message },
        { status: 500 },
      )
    }

    const usedCouponIds = usedCoupons.map((usage) => usage.coupon_id)

    // Base query
    let query = supabase
      .from("coupons")
      .select("*")
      .eq("is_active", true)
      .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`)

    // Exclude used coupons
    if (usedCouponIds.length > 0) {
      const formattedIds = `(${usedCouponIds.join(",")})`
      query = query.not("id", "in", formattedIds)
    }

    // Optional filters
    if (code) {
      query = query.eq("code", code)
    }
    if (isActive !== null) {
      query = query.eq("is_active", isActive === "true")
    }
    if (minOrderAmount) {
      query = query.lte("minimum_order_amount", parseFloat(minOrderAmount))
    }
    if (discountType) {
      query = query.eq("discount_type", discountType)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching available coupons:", error)
      return NextResponse.json(
        { error: "Failed to fetch available coupons", details: error.message },
        { status: 500 },
      )
    }

    // Filter out coupons where max_uses is reached
   

    return NextResponse.json({ coupons: data }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred", details: (error as Error).message },
      { status: 500 },
    )
  }
}


//-------------------------use up---route coupond down
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const searchParams = request.nextUrl.searchParams

    const userId = searchParams.get("user_id")
    const code = searchParams.get("code")
    const isActive = searchParams.get("is_active")
    const minOrderAmount = searchParams.get("min_order_amount")
    const discountType = searchParams.get("discount_type")

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id in query" }, { status: 400 })
    }

    // Get IDs of coupons already used by this user
    const { data: usedCoupons, error: usedError } = await supabase
      .from("coupon_usages")
      .select("coupon_id")
      .eq("user_id", userId)

    if (usedError) {
      return NextResponse.json(
        { error: "Failed to fetch used coupons", details: usedError.message },
        { status: 500 },
      )
    }

    const usedCouponIds = usedCoupons.map((usage) => usage.coupon_id)

    // Base query
    let query = supabase
      .from("coupons")
      .select("*")
      .eq("is_active", true)
      .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`)

    // Exclude used coupons
    if (usedCouponIds.length > 0) {
      const formattedIds = `(${usedCouponIds.join(",")})`
      query = query.not("id", "in", formattedIds)
    }

    // Optional filters
    if (code) {
      query = query.eq("code", code)
    }
    if (isActive !== null) {
      query = query.eq("is_active", isActive === "true")
    }
    if (minOrderAmount) {
      query = query.lte("minimum_order_amount", parseFloat(minOrderAmount))
    }
    if (discountType) {
      query = query.eq("discount_type", discountType)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching available coupons:", error)
      return NextResponse.json(
        { error: "Failed to fetch available coupons", details: error.message },
        { status: 500 },
      )
    }

    // Filter out coupons where max_uses is reached
   

    return NextResponse.json({ coupons: data }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred", details: (error as Error).message },
      { status: 500 },
    )
  }
}



