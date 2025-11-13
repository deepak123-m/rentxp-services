import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"

/**
 * POST /api/webhooks/payment
 * Webhook handler for payment gateway callbacks
 * This is a generic handler that can be customized for specific payment gateways
 */
export async function POST(request: Request) {
  // Get the raw body for signature verification
  const rawBody = await request.text()
  const signature = request.headers.get("x-payment-signature")

  // For security, verify the webhook signature if provided
  // This example uses a generic approach - customize for your payment gateway
  if (process.env.PAYMENT_WEBHOOK_SECRET && signature) {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.PAYMENT_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex")

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })
    const payload = JSON.parse(rawBody)

    // Extract payment information from the webhook payload
    // This will vary based on your payment gateway
    const {
      payment_id, // Your internal payment ID
      transaction_id, // Payment gateway transaction ID
      order_id, // Your order ID
      status, // Payment status from gateway
      amount, // Payment amount
      metadata, // Additional information
    } = payload

    // Map the payment gateway status to your internal status
    let paymentStatus
    switch (status) {
      case "success":
      case "captured":
      case "authorized":
      case "paid":
        paymentStatus = "completed"
        break
      case "failed":
      case "declined":
        paymentStatus = "failed"
        break
      case "refunded":
        paymentStatus = "refunded"
        break
      case "pending":
      case "processing":
        paymentStatus = "processing"
        break
      default:
        paymentStatus = "pending"
    }

    // Find the payment by transaction_id or payment_id
    let paymentQuery = supabase.from("payments").select("id, order_id, payment_status")

    if (payment_id) {
      paymentQuery = paymentQuery.eq("id", payment_id)
    } else if (transaction_id) {
      paymentQuery = paymentQuery.eq("transaction_id", transaction_id)
    } else if (order_id) {
      // If only order_id is available, get the most recent payment for this order
      paymentQuery = paymentQuery.eq("order_id", order_id).order("created_at", { ascending: false }).limit(1)
    } else {
      return NextResponse.json(
        {
          error: "Cannot identify payment - missing payment_id, transaction_id, or order_id",
        },
        { status: 400 },
      )
    }

    const { data: payment, error: findError } = await paymentQuery.single()

    if (findError) {
      console.error("Payment not found:", findError)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Update the payment status and details
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        payment_status: paymentStatus,
        transaction_id: transaction_id || payment.transaction_id,
        payment_details: {
          gateway_response: payload,
          updated_at: new Date().toISOString(),
        },
      })
      .eq("id", payment.id)

    if (updateError) {
      console.error("Error updating payment:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // If payment is completed, update the order status if needed
    if (paymentStatus === "completed" && payment.payment_status !== "completed") {
      const { data: orderData } = await supabase.from("orders").select("status").eq("id", payment.order_id).single()

      if (orderData && orderData.status === "pending") {
        await supabase.from("orders").update({ status: "processing" }).eq("id", payment.order_id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      {
        error: "Failed to process webhook",
      },
      { status: 500 },
    )
  }
}
