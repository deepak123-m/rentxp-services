import { NextResponse } from "next/server"
import { setupStorage } from "@/lib/storage-setup"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await setupStorage()

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Failed to set up storage",
          details: result.error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: "Storage setup completed successfully",
    })
  } catch (error) {
    console.error("Error in storage setup:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
