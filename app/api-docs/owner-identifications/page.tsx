import { CodeBlock } from "@/components/code-block"
import { DocPaper } from "@/components/doc-paper"

export default function OwnerIdentificationsApiDocs() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Owner Identifications API Documentation</h1>

      {/* Overview Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The Owner Identifications API allows administrators to manage identification documents for shop owners. This
          includes listing, creating, retrieving, updating, and deleting identification records.
        </p>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Base URL</h3>
          <CodeBlock language="plaintext">https://api.groceryapp.com/api</CodeBlock>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Authentication</h3>
          <p>
            All API requests require authentication using a Bearer token in the Authorization header. Only users with
            the "admin" role can access these endpoints.
          </p>
          <CodeBlock language="plaintext">Authorization: Bearer YOUR_API_TOKEN</CodeBlock>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Rate Limiting</h3>
          <p>
            API requests are limited to 100 requests per minute per API token. If you exceed this limit, you will
            receive a 429 Too Many Requests response.
          </p>
        </div>
      </DocPaper>

      {/* Endpoints Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>

        {/* List Owner Identifications */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">List Owner Identifications</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/owner-identifications</span>
          </div>
          <p className="mb-3">
            Retrieves a list of all owner identifications for a given registration ID. Only accessible to users with the
            "admin" role.
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
                  <td className="border p-2">registration_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Filter by registration ID (required)</td>
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
  "owner_identifications": [
    {
      "id": "id_123456",
      "registration_id": "reg_789012",
      "id_type": "aadhar",
      "id_number": "123456789012",
      "id_name": "John Doe",
      "id_image_url": "https://example.com/images/aadhar.jpg",
      "issue_date": "2010-01-01",
      "expiry_date": null,
      "is_verified": true,
      "verification_notes": "Verified with UIDAI",
      "created_at": "2023-06-15T10:30:00Z",
      "updated_at": "2023-06-15T10:30:00Z"
    },
    {
      "id": "id_123457",
      "registration_id": "reg_789012",
      "id_type": "pan",
      "id_number": "ABCDE1234F",
      "id_name": "John Doe",
      "id_image_url": "https://example.com/images/pan.jpg",
      "issue_date": "2015-05-20",
      "expiry_date": null,
      "is_verified": true,
      "verification_notes": "Verified with Income Tax Department",
      "created_at": "2023-06-16T14:20:00Z",
      "updated_at": "2023-06-16T14:20:00Z"
    }
  ]
}
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get Owner Identification by ID */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get Owner Identification by ID</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/owner-identifications/{"{id}"}</span>
          </div>
          <p className="mb-3">
            Retrieves detailed information about a specific owner identification. Only accessible to users with the
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
                  <td className="border p-2">id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the owner identification</td>
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
  "id": "id_123456",
  "registration_id": "reg_789012",
  "id_type": "aadhar",
  "id_number": "123456789012",
  "id_name": "John Doe",
  "id_image_url": "https://example.com/images/aadhar.jpg",
  "issue_date": "2010-01-01",
  "expiry_date": null,
  "is_verified": true,
  "verification_notes": "Verified with UIDAI",
  "created_at": "2023-06-15T10:30:00Z",
  "updated_at": "2023-06-15T10:30:00Z"
}
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Create Owner Identification */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Create Owner Identification</h3>
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono">POST</span>
            <span className="font-mono">/api/owner-identifications</span>
          </div>
          <p className="mb-3">Creates a new owner identification. Only accessible to users with the "customer" role.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <p>
              The request body should be formatted as <code>multipart/form-data</code>.
            </p>
            <ul className="list-disc pl-5">
              <li>
                <code>registration_id</code> (string, required): The ID of the shop owner registration.
              </li>
              <li>
                <code>id_type</code> (string, required): The type of identification document (e.g., aadhar, pan).
              </li>
              <li>
                <code>id_image</code> (file, required): The image file of the identification document.
              </li>
            </ul>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
"success": true,
"data": {
  "id": "id_123458",
  "registration_id": "reg_789012",
  "id_type": "aadhar",
  "id_image_url": "https://example.com/storage/owner_identifications/id_123458.jpg",
  "created_at": "2023-06-23T10:30:00Z",
  "updated_at": "2023-06-23T10:30:00Z"
}
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Update Owner Identification */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Update Owner Identification</h3>
          <div className="mb-2">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono">PATCH</span>
            <span className="font-mono">/api/owner-identifications/{"{id}"}</span>
          </div>
          <p className="mb-3">
            Updates an existing owner identification. Only accessible to users with the "admin" role.
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
                  <td className="border p-2">id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the owner identification</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <p>
              The request body should be formatted as <code>multipart/form-data</code>.
            </p>
            <ul className="list-disc pl-5">
              <li>
                <code>id_type</code> (string, optional): The type of identification document (e.g., aadhar, pan).
              </li>
              <li>
                <code>id_image</code> (file, optional): The image file of the identification document.
              </li>
            </ul>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
"success": true,
"data": {
  "id": "id_123457",
  "registration_id": "reg_789012",
  "id_type": "pan",
  "id_image_url": "https://example.com/storage/owner_identifications/id_123457.jpg",
  "created_at": "2023-06-16T14:20:00Z",
  "updated_at": "2023-06-23T11:00:00Z"
}
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Delete Owner Identification */}
        <div>
          <h3 className="text-xl font-medium mb-3">Delete Owner Identification</h3>
          <div className="mb-2">
            <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 font-mono">DELETE</span>
            <span className="font-mono">/api/owner-identifications/{"{id}"}</span>
          </div>
          <p className="mb-3">Deletes an owner identification. Only accessible to users with the "admin" role.</p>
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
                  <td className="border p-2">id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the owner identification</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
"success": true,
"message": "Owner identification deleted successfully"
}`}
            </CodeBlock>
          </div>
        </div>
      </DocPaper>
    </div>
  )
}
