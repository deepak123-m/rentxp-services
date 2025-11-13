import { CodeBlock } from "@/components/code-block"
import { DocPaper } from "@/components/doc-paper"

export default function ShopOwnerRegistrationsApiDocs() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Shop Owner Registrations API Documentation</h1>

      {/* Overview Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The Shop Owner Registrations API allows shop owners to submit their registration information. This includes
          listing registrations, viewing details, updating statuses, and deleting registrations.
        </p>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Base URL</h3>
          <CodeBlock language="plaintext">https://api.groceryapp.com/api</CodeBlock>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Authentication</h3>
          <p>All API requests require a valid JWT token in the Authorization header.</p>
          <CodeBlock language="plaintext">Authorization: Bearer YOUR_API_TOKEN</CodeBlock>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">API Request Limits</h3>
          <p>
            API requests are limited to 100 requests per minute per API token. If you exceed this limit, you will
            receive a 429 Too Many Requests response.
          </p>
        </div>
      </DocPaper>

      {/* Endpoints Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>

        {/* List Shop Owner Registrations */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">List Shop Owner Registrations</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/shop-owner-registrations</span>
          </div>
          <p className="mb-3">
            Retrieves a list of all shop owner registrations. Only accessible to users with the "admin" role.
          </p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Query Parameters</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Parameter</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">page</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Page number for pagination (default: 1)</td>
                </tr>
                <tr>
                  <td className="border p-2">limit</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Number of items per page (default: 20, max: 100)</td>
                </tr>
                <tr>
                  <td className="border p-2">status</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">
                    Filter by registration status (pending, under_review, approved, rejected)
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">sales_officer_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Filter by sales officer ID</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
"success": true,
"data": {
"shop_owner_registrations": [
{
 "id": "reg_123456",
 "user_id": "user_789012",
 "shop_name": "Grocery Store",
 "owner_name": "John Doe",
 "status": "pending",
 "created_at": "2023-06-15T10:30:00Z",
 "document_url": "https://example.com/documents/shop_photo.jpg"
},
{
 "id": "reg_123457",
 "user_id": "user_789013",
 "shop_name": "Organic Market",
 "owner_name": "Jane Smith",
 "status": "approved",
 "created_at": "2023-06-14T14:20:00Z",
 "document_url": "https://example.com/documents/shop_photo.jpg"
}
],
"count": 42,
"limit": 20,
"offset": 0
}
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get Shop Owner Registration by ID */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get Shop Owner Registration by ID</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/shop-owner-registrations/{"{registration_id}"}</span>
          </div>
          <p className="mb-3">
            Retrieves detailed information about a specific shop owner registration. Only accessible to users with the
            "admin" role.
          </p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Path Parameters</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Parameter</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">registration_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the shop owner registration</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
"registration": {
"id": "reg_123456",
"user_id": "user_789012",
"merchant_segment": "grocery",
"merchant_sub_segment": "kirana_store",
"shop_name": "Grocery Store",
"shop_display_name": "JG Supermarket",
"shop_phone": "+15557654321",
"shop_email": "contact@johnsgrocery.com",
"shop_website": "https://johnsgrocery.com",
"shop_gstin": "22AAAAA0000A1Z5",
"owner_name": "John Doe",
"owner_phone": "+15551234567",
"owner_email": "john@example.com",
"sales_officer_id": "user_789015",
"status": "pending",
"submitted_at": "2023-06-15T10:30:00Z",
"document_url": "https://example.com/documents/shop_photo.jpg",
"created_at": "2023-06-15T10:30:00Z",
"updated_at": "2023-06-15T10:30:00Z",
"approved_by": null,
"approved_at": null
},
"documents": [
{
 "id": "doc_123",
 "registration_id": "reg_123456",
 "document_type": "identity_proof",
 "document_url": "https://example.com/documents/identity_proof.pdf",
 "file_name": "identity_proof.pdf",
 "file_size": 1024000,
 "file_type": "application/pdf",
 "uploaded_by": "user_789012",
 "created_at": "2023-06-15T11:30:00Z"
},
{
 "id": "doc_124",
 "registration_id": "reg_123456",
 "document_type": "business_license",
 "document_url": "https://example.com/documents/business_license.pdf",
 "file_name": "business_license.pdf",
 "file_size": 2048000,
 "file_type": "application/pdf",
 "uploaded_by": "user_789012",
 "created_at": "2023-06-15T11:35:00Z"
}
]
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Create Shop Owner Registration */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Create Shop Owner Registration</h3>
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono">POST</span>
            <span className="font-mono">/api/shop-owner-registrations</span>
          </div>
          <p className="mb-3">
            Creates a new shop owner registration. This endpoint is used by shop owners to submit their registration
            information.
          </p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <p className="mb-2">
              The request body should be formatted as <code>multipart/form-data</code>.
            </p>
            <ul className="list-disc pl-5 mb-3">
              <li>
                <code>merchant_segment</code>: (string, required) The segment of the merchant (e.g., grocery,
                electronics)
              </li>
              <li>
                <code>merchant_sub_segment</code>: (string, optional) The sub-segment of the merchant (e.g.,
                kirana_store)
              </li>
              <li>
                <code>shop_name</code>: (string, required) The name of the shop
              </li>
              <li>
                <code>shop_display_name</code>: (string, optional) The display name of the shop
              </li>
              <li>
                <code>shop_phone</code>: (string, required) The phone number of the shop
              </li>
              <li>
                <code>shop_email</code>: (string, optional) The email address of the shop
              </li>
              <li>
                <code>shop_website</code>: (string, optional) The website of the shop
              </li>
              <li>
                <code>shop_gstin</code>: (string, optional) The GSTIN of the shop
              </li>
              <li>
                <code>owner_name</code>: (string, required) The name of the shop owner
              </li>
              <li>
                <code>owner_phone</code>: (string, optional) The phone number of the shop owner
              </li>
              <li>
                <code>owner_email</code>: (string, optional) The email address of the shop owner
              </li>
              <li>
                <code>sales_officer_id</code>: (string, optional) The ID of the sales officer assigned to the shop
              </li>
              <li>
                <code>document</code>: (file, optional) A file containing a shop photo or other relevant document
              </li>
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">
              Note: For testing purposes, this endpoint does not require authentication.
            </p>
          </div>
        </div>

        {/* Update Shop Owner Registration Status */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Update Shop Owner Registration Status</h3>
          <div className="mb-2">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono">PATCH</span>
            <span className="font-mono">/api/shop-owner-registrations/{"{registration_id}"}/status</span>
          </div>
          <p className="mb-3">
            Updates the status of a shop owner registration. Only accessible to users with the "admin" role.
          </p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Path Parameters</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Parameter</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">registration_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the shop owner registration</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
"status": "approved",
"rejection_reason": null // Only required if status is "rejected"
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
"message": "Shop owner registration approved",
"registration": {
"id": "reg_123456",
"user_id": "user_789012",
"shop_name": "Grocery Store",
"owner_name": "John Doe",
"status": "approved",
"created_at": "2023-06-15T10:30:00Z",
"updated_at": "2023-06-22T14:15:30Z",
"approved_at": "2023-06-22T14:15:30Z",
"approved_by": "admin_123"
}
}`}
            </CodeBlock>
          </div>
        </div>
      </DocPaper>
    </div>
  )
}
