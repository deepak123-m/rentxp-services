"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TestImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setImagePreview(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      // Send to test endpoint
      const response = await fetch("/api/products/test-image-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: base64,
        }),
      })

      const data = await response.json()
      setResult(data)

      if (!response.ok) {
        setError(`Error: ${data.error || "Unknown error"}`)
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setUploading(false)
    }
  }

  const handleCreateProduct = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      // Create a test product with the image
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Product",
          description: "This is a test product created from the test page",
          price: 19.99,
          stock: 10,
          category: "test",
          imageBase64: base64,
        }),
      })

      const data = await response.json()
      setResult(data)

      if (!response.ok) {
        setError(`Error: ${data.error || "Unknown error"}`)
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Image Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Select Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
          </div>

          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="max-h-40 rounded-md border" />
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1">
              {uploading ? "Uploading..." : "Test Upload"}
            </Button>

            <Button onClick={handleCreateProduct} disabled={!file || uploading} className="flex-1" variant="secondary">
              Create Product
            </Button>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}

          {result && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Result:</p>
              <Textarea readOnly value={JSON.stringify(result, null, 2)} className="font-mono text-xs h-40" />

              {result.success && result.imageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Uploaded Image:</p>
                  <img
                    src={result.imageUrl || "/placeholder.svg"}
                    alt="Uploaded"
                    className="max-h-40 rounded-md border"
                  />
                </div>
              )}

              {result.product && result.product.image_url && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Product Image:</p>
                  <img
                    src={result.product.image_url || "/placeholder.svg"}
                    alt="Product"
                    className="max-h-40 rounded-md border"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
