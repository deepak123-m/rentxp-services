import { type NextRequest, NextResponse } from "next/server"

// List of allowed origins
const allowedOrigins = [
  "https://fancy-marshmallow-a491c8.netlify.app",
  "http://localhost:3000", // For local development
  "http://localhost:62084", // Local testing
  "http://localhost:5173", //customer website local testing
  "https://v0-grocery-testingapp.vercel.app", // User's deployed frontend application
  "https://v0-frontend-ecomercetesting-app-atstqv.vercel.app", // New frontend application
  "https://v0-frontend-ecomercetesting-app.vercel.app", // Another frontend application
  "https://v0-frontend-ecomercetesting-app-vpil0a.vercel.app", // Additional frontend application
  "http://localhost:xxxx", // Add Flutter app origin here
]

export function setCorsHeaders(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin") || ""

  // Only set the CORS headers if the origin is in our allowed list
  if (allowedOrigins.includes(origin)) {
    // Set the Access-Control-Allow-Origin header to the specific origin that made the request
    res.headers.set("Access-Control-Allow-Origin", origin)
    res.headers.set("Access-Control-Allow-Credentials", "true")
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
    )
  }

  return res
}

export function handleCors(req: NextRequest) {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    const origin = req.headers.get("origin") || ""
    const res = new NextResponse(null, { status: 204 })

    // Only set the CORS headers if the origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin)
      res.headers.set("Access-Control-Allow-Credentials", "true")
      res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
      res.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      )
      res.headers.set("Access-Control-Max-Age", "86400")
    }

    return res
  }

  return null
}


export const corsHeaders = (req: NextRequest) => {
  const origin = req.headers.get("origin") || "*"
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  }
}
