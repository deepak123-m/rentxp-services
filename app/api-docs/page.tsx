"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ApiDocsIndex() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the first API doc page
    router.push("/api-docs/articles")
  }, [router])

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Redirecting to API documentation...</p>
      </div>
    </div>
  )
}
