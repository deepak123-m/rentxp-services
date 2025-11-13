import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { corsHeaders } from "@/lib/cors"

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400, headers: corsHeaders })
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: "deepakm@ismart.today",
        pass: "Error@0987",
      },
    })

    

    const mailOptions = {
      from: `"deepakm@ismart.today`,
      to: "venkateswararaok@ismart.today", // Your own inbox to receive messages
      subject: `New message from deepak ismart`,
      text: "text message",
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true }, { status: 200, headers: corsHeaders })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500, headers: corsHeaders })
  }
}
