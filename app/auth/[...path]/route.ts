import { type NextRequest, NextResponse } from "next/server"

// List of allowed origins
const allowedOrigins = [
  "https://v0-grocery-testingapp.vercel.app",
  process.env.NEXT_PUBLIC_FRONTEND_URL, // Optional environment variable for flexibility
  "http://localhost:3000", // For local development
]

// This is a catch-all route to handle requests to /auth/* paths
// and redirect them to the correct /api/auth/* paths
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const response = NextResponse.redirect(new URL(`/api/auth/${path}`, request.url))

  // Add CORS headers
  const origin = request.headers.get("origin") || ""
  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Credentials", "true")
  }

  return response
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const response = NextResponse.redirect(new URL(`/api/auth/${path}`, request.url))

  // Add CORS headers
  const origin = request.headers.get("origin") || ""
  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Credentials", "true")
  }

  return response
}

export async function OPTIONS(request: NextRequest) {
  // Handle preflight requests
  const origin = request.headers.get("origin") || ""
  const isAllowedOrigin = allowedOrigins.includes(origin)

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": isAllowedOrigin ? origin : allowedOrigins[0],
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  })
}
