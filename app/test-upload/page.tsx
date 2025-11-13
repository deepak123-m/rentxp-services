"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function TestUpload() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [hsnCode, setHsnCode] = useState("")
  const [images, setImages] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClientComponentClient()

  // Check authentication status on component mount
  useState(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setAuthStatus("Error checking authentication: " + error.message)
      } else if (!data.session) {
        setAuthStatus("Not authenticated. Please log in.")
      } else {
        setAuthStatus("Authenticated as: " + data.session.user.email)
      }
    }

    checkAuth()
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Check authentication first
      const { data: authData } = await supabase.auth.getSession()
      if (!authData.session) {
        setError("You must be logged in to upload products")
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("stock", stock)
      formData.append("category", category)
      formData.append("brand", brand)
      formData.append("hsn_code", hsnCode)

      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i])
        }
      }

      const response = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to upload product")
      }

      setResult(data)

      // Reset form on success
      setName("")
      setDescription("")
      setPrice("")
      setStock("")
      setCategory("")
      setBrand("")
      setHsnCode("")
      setImages(null)
    } catch (err: any) {
      console.error("Error uploading product:", err)
      setError(err.message || "An error occurred while uploading the product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Product Upload</h1>

      {authStatus && (
        <div className={`p-4 mb-4 rounded ${authStatus.includes("Not authenticated") ? "bg-red-100" : "bg-green-100"}`}>
          {authStatus}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Product Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>

        <div>
          <label className="block mb-1">Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Brand:</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">HSN Code:</label>
          <input
            type="text"
            value={hsnCode}
            onChange={(e) => setHsnCode(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Images:</label>
          <input
            type="file"
            onChange={(e) => setImages(e.target.files)}
            className="w-full p-2 border rounded"
            multiple
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <h2 className="font-bold">Success:</h2>
          <p>{result.message}</p>
          <h3 className="font-bold mt-2">Product Details:</h3>
          <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">{JSON.stringify(result.product, null, 2)}</pre>
          {result.imageUrls && result.imageUrls.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold">Uploaded Images:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.imageUrls.map((url: string, index: number) => (
                  <div key={index} className="border rounded overflow-hidden">
                    <img src={url || "/placeholder.svg"} alt={`Product ${index}`} className="w-32 h-32 object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Debug Tools</h2>
        <div className="space-y-2">
          <button
            onClick={async () => {
              try {
                const response = await fetch("/api/debug/auth")
                const data = await response.json()
                setResult(data)
              } catch (err: any) {
                setError(err.message)
              }
            }}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Check Auth Status
          </button>

          <button
            onClick={async () => {
              try {
                const response = await fetch("/api/products")
                const data = await response.json()
                setResult(data)
              } catch (err: any) {
                setError(err.message)
              }
            }}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ml-2"
          >
            List Products
          </button>
        </div>
      </div>
    </div>
  )
}
