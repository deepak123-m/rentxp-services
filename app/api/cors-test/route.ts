import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "CORS is working correctly!",
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))

  return NextResponse.json({
    message: "CORS POST request successful!",
    receivedData: body,
    timestamp: new Date().toISOString(),
  })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}



