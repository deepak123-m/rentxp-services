import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ArticlesApiDocs() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Articles API</CardTitle>
        <CardDescription>Endpoints for managing product articles with the new schema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">GET /api/articles</h3>
            <p className="mb-2">List all articles with optional filtering</p>
            <p className="text-sm text-muted-foreground mb-2">Query Parameters:</p>
            <ul className="list-disc pl-5 text-sm">
              <li>
                <code>category_id</code> - Filter by category ID
              </li>
              <li>
                <code>sub_category_id</code> - Filter by sub-category ID
              </li>
              <li>
                <code>limit</code> - Number of items to return (default: 50)
              </li>
              <li>
                <code>offset</code> - Pagination offset (default: 0)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">GET /api/articles/:id</h3>
            <p>Get a specific article by ID with its photos</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">POST /api/articles</h3>
            <p className="mb-2">Create a new article with optional image uploads</p>
            <p className="text-sm text-muted-foreground mb-2">Supports both JSON and multipart/form-data:</p>

            <h4 className="text-md font-medium mt-4 mb-2">
              Option 1: Multipart Form Data (Recommended for image uploads)
            </h4>
            <p className="text-sm text-muted-foreground mb-2">Use form-data with the following fields:</p>
            <ul className="list-disc pl-5 text-sm">
              <li>
                <code>name</code> - Article name
              </li>
              <li>
                <code>description</code> - Article description
              </li>
              <li>
                <code>weight</code> - Weight value (numeric)
              </li>
              <li>
                <code>unit_of_measurement</code> - Unit of measurement (e.g., kg, g, pcs)
              </li>
              <li>
                <code>category_id</code> - Category ID
              </li>
              <li>
                <code>sub_category_id</code> - Sub-category ID
              </li>
              <li>
                <code>mrp</code> - Maximum retail price (numeric)
              </li>
              <li>
                <code>cost_price</code> - Cost price (numeric)
              </li>
              <li>
                <code>hsn_code</code> - HSN code
              </li>
              <li>
                <code>gst_percentage</code> - GST percentage (numeric)
              </li>
              <li>
                <code>images</code> - Image files (can include multiple files with the same field name)
              </li>
            </ul>

            <h4 className="text-md font-medium mt-4 mb-2">Option 2: JSON Request</h4>
            <pre className="bg-muted p-2 rounded text-sm">
              {`{
  "name": "Article Name",
  "description": "Detailed description of the article",
  "weight": 1.5,
  "unit_of_measurement": "kg",
  "category_id": "category-uuid",
  "sub_category_id": "sub-category-uuid",
  "mrp": 150.00,
  "cost_price": 100.00,
  "hsn_code": "HSN12345",
  "gst_percentage": 5,
  "product_photos": [], // Optional array of existing photo URLs
  "images": [ // Optional array of base64 encoded images
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
  ]
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">PATCH /api/articles/:id</h3>
            <p className="mb-2">Update an existing article</p>
            <p className="text-sm text-muted-foreground mb-2">Request Body:</p>
            <pre className="bg-muted p-2 rounded text-sm">
              {`{
  "name": "Updated Article Name", // Optional
  "description": "Updated description", // Optional
  "weight": 2.0, // Optional
  "unit_of_measurement": "pcs", // Optional
  "category_id": "updated-category-uuid", // Optional
  "sub_category_id": "updated-sub-category-uuid", // Optional
  "mrp": 160.00, // Optional
  "cost_price": 110.00, // Optional
  "hsn_code": "UPDATED12345", // Optional
  "gst_percentage": 12 // Optional
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">POST /api/articles/:id/photos</h3>
            <p className="mb-2">Upload photos for an existing article</p>
            <p className="text-sm text-muted-foreground mb-2">Supports both JSON and multipart/form-data:</p>

            <h4 className="text-md font-medium mt-4 mb-2">Option 1: Multipart Form Data (Recommended)</h4>
            <p className="text-sm text-muted-foreground mb-2">Use form-data with the following field:</p>
            <ul className="list-disc pl-5 text-sm">
              <li>
                <code>images</code> - Image files (can include multiple files with the same field name)
              </li>
            </ul>

            <h4 className="text-md font-medium mt-4 mb-2">Option 2: JSON Request</h4>
            <pre className="bg-muted p-2 rounded text-sm">
              {`{
  "photos": [ // Optional array of existing photo URLs to add
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ],
  "images": [ // Optional array of base64 encoded images
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
  ]
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">DELETE /api/articles/:id/photos</h3>
            <p className="mb-2">Delete specific photos from an article</p>
            <p className="text-sm text-muted-foreground mb-2">Request Body:</p>
            <pre className="bg-muted p-2 rounded text-sm">
              {`{
  "photos": [
    "https://example.com/storage/articles/article-id/photo1.jpg",
    "https://example.com/storage/articles/article-id/photo2.jpg"
  ]
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">DELETE /api/articles/:id</h3>
            <p>Delete an article (this will also delete all associated photos)</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Response Format</h3>
            <p className="mb-2">Example response for GET /api/articles/:id:</p>
            <pre className="bg-muted p-2 rounded text-sm">
              {`{
  "article": {
    "id": "article-uuid",
    "name": "Fresh Apples",
    "description": "Premium quality fresh apples",
    "weight": 1.5,
    "unit_of_measurement": "kg",
    "category_id": "category-uuid",
    "sub_category_id": "sub-category-uuid",
    "mrp": 150.00,
    "cost_price": 100.00,
    "hsn_code": "HSN12345",
    "gst_percentage": 5,
    "product_photos": [
      "https://example.com/storage/articles/article-uuid/photo1.jpg",
      "https://example.com/storage/articles/article-uuid/photo2.jpg"
    ],
    "created_at": "2023-05-15T10:30:00Z",
    "updated_at": "2023-05-15T10:30:00Z"
  }
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Image Upload Response</h3>
            <p className="mb-2">Example response for POST /api/articles/:id/photos:</p>
            <pre className="bg-muted p-2 rounded text-sm">
              {`{
  "message": "Photos added successfully",
  "article": {
    "id": "article-uuid",
    "name": "Fresh Apples",
    "description": "Premium quality fresh apples",
    "product_photos": [
      "https://example.com/storage/articles/article-uuid/photo1.jpg",
      "https://example.com/storage/articles/article-uuid/photo2.jpg",
      "https://example.com/storage/articles/article-uuid/new-photo1.jpg",
      "https://example.com/storage/articles/article-uuid/new-photo2.jpg"
    ],
    // Other article fields...
  },
  "added_photos": [
    "https://example.com/storage/articles/article-uuid/new-photo1.jpg",
    "https://example.com/storage/articles/article-uuid/new-photo2.jpg"
  ]
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Testing in Postman</h3>
            <p className="mb-2">To test image uploads in Postman:</p>

            <h4 className="text-md font-medium mt-4 mb-2">For creating an article with images:</h4>
            <ol className="list-decimal pl-5 text-sm space-y-2">
              <li>
                Select <strong>POST</strong> method and enter the URL <code>/api/articles</code>
              </li>
              <li>
                Select the <strong>Body</strong> tab
              </li>
              <li>
                Select <strong>form-data</strong> option
              </li>
              <li>Add key-value pairs for all the article fields (name, description, etc.)</li>
              <li>
                For images, add a key named <strong>images</strong> and select <strong>File</strong> as the type
              </li>
              <li>
                Click on <strong>Select Files</strong> and choose the image files
              </li>
              <li>
                To add multiple images, click the <strong>Add</strong> button to add more rows with the same key name{" "}
                <strong>images</strong>
              </li>
              <li>
                Click <strong>Send</strong> to submit the request
              </li>
            </ol>

            <h4 className="text-md font-medium mt-4 mb-2">For adding photos to an existing article:</h4>
            <ol className="list-decimal pl-5 text-sm space-y-2">
              <li>
                Select <strong>POST</strong> method and enter the URL <code>/api/articles/{"{article_id}"}/photos</code>
              </li>
              <li>
                Follow the same steps as above, but only include the <strong>images</strong> field
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Error Handling</h3>
            <p className="mb-2">The API provides detailed error messages for common issues:</p>
            <ul className="list-disc pl-5 text-sm">
              <li>400 Bad Request - Invalid input data or file format</li>
              <li>404 Not Found - Article not found</li>
              <li>500 Internal Server Error - Server-side processing error</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">Example error response:</p>
            <pre className="bg-muted p-2 rounded text-sm">
              {`{
  "error": "Error message",
  "details": "Detailed error information" // Only included for certain errors
}`}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
