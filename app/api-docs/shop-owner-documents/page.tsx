import { CodeBlock } from "@/components/code-block"
import { DocPaper } from "@/components/doc-paper"

export default function ShopOwnerDocumentsApiDocs() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Shop Owner Documents API Documentation</h1>

      {/* Overview Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The Shop Owner Documents API allows shop owners to manage their identification documents required for
          registration. This includes listing, creating, retrieving, updating, and deleting document records.
        </p>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Base URL</h3>
          <CodeBlock language="plaintext">https://api.groceryapp.com/api</CodeBlock>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Authentication</h3>
          <p>
            All API requests require authentication using a Bearer token in the Authorization header. Only users with
            the "customer" role can access these endpoints.
          </p>
          <CodeBlock language="plaintext">Authorization: Bearer YOUR_API_TOKEN</CodeBlock>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Document Types</h3>
          <p className="mb-2">The API supports the following document types:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>aadhar</strong>: Aadhar card
            </li>
            <li>
              <strong>pan</strong>: PAN card
            </li>
            <li>
              <strong>voter_id</strong>: Voter ID card
            </li>
            <li>
              <strong>driving_license</strong>: Driving license
            </li>
            <li>
              <strong>passport</strong>: Passport
            </li>
            <li>
              <strong>ration_card</strong>: Ration card
            </li>
            <li>
              <strong>other</strong>: Other identification document
            </li>
          </ul>
        </div>
      </DocPaper>

      {/* Endpoints Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>

        {/* List Shop Owner Documents */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">List Shop Owner Documents</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/shop-owner-documents</span>
          </div>
          <p className="mb-3">
            Retrieves a list of all shop owner documents for a given registration ID. Only accessible to users with the
            "customer" role.
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
"shop_owner_documents": [
  {
    "id": "doc_123456",
    "registration_id": "reg_789012",
    "document_type": "aadhar_card",
    "document_number": "123456789012",
    "document_name": "Aadhar Card",
    "document_url": "https://example.com/documents/aadhar.pdf",
    "issue_date": "2010-01-01",
    "expiry_date": null,
    "created_at": "2023-06-15T10:30:00Z",
    "updated_at": "2023-06-15T10:30:00Z"
  },
  {
    "id": "doc_123457",
    "registration_id": "reg_789012",
    "document_type": "pan_card",
    "document_number": "ABCDE1234F",
    "document_name": "PAN Card",
    "document_url": "https://example.com/documents/pan.pdf",
    "issue_date": "2015-05-20",
    "expiry_date": null,
    "created_at": "2023-06-16T14:20:00Z",
    "updated_at": "2023-06-16T14:20:00Z"
  }
]
}
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get Shop Owner Document by ID */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get Shop Owner Document by ID</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/shop-owner-documents/{"{id}"}</span>
          </div>
          <p className="mb-3">
            Retrieves detailed information about a specific shop owner document. Only accessible to users with the
            "customer" role.
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
                  <td className="border p-2">Unique identifier of the shop owner document</td>
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
"id": "doc_123456",
"registration_id": "reg_789012",
"document_type": "aadhar_card",
"document_number": "123456789012",
"document_name": "Aadhar Card",
"document_url": "https://example.com/documents/aadhar.pdf",
"issue_date": "2010-01-01",
"expiry_date": null,
"created_at": "2023-06-15T10:30:00Z",
"updated_at": "2023-06-15T10:30:00Z"
}
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Create Shop Owner Document */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Create Shop Owner Document</h3>
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono">POST</span>
            <span className="font-mono">/api/shop-owner-documents</span>
          </div>
          <p className="mb-3">Creates a new shop owner document. Only accessible to users with the "customer" role.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
"registration_id": "reg_789012",
"document_type": "aadhar_card",
"document_number": "123456789012",
"document_name": "Aadhar Card",
"document_url": "https://example.com/documents/aadhar.pdf",
"issue_date": "2010-01-01",
"expiry_date": null
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
"success": true,
"data": {
"id": "doc_123458",
"registration_id": "reg_789012",
"document_type": "aadhar_card",
"document_number": "123456789012",
"document_name": "Aadhar Card",
"document_url": "https://example.com/documents/aadhar.pdf",
"issue_date": "2010-01-01",
"expiry_date": null,
"created_at": "2023-06-23T10:30:00Z",
"updated_at": "2023-06-23T10:30:00Z"
}
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Update Shop Owner Document */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Update Shop Owner Document</h3>
          <div className="mb-2">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono">PATCH</span>
            <span className="font-mono">/api/shop-owner-documents/{"{id}"}</span>
          </div>
          <p className="mb-3">
            Updates an existing shop owner document. Only accessible to users with the "customer" role.
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
                  <td className="border p-2">Unique identifier of the shop owner document</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
"document_type": "pan_card",
"document_number": "ABCDE1234F",
"document_name": "PAN Card",
"document_url": "https://example.com/documents/pan.pdf",
"issue_date": "2015-05-20",
"expiry_date": null
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
"success": true,
"data": {
"id": "doc_123457",
"registration_id": "reg_789012",
"document_type": "pan_card",
"document_number": "ABCDE1234F",
"document_name": "PAN Card",
"document_url": "https://example.com/documents/pan.pdf",
"issue_date": "2015-05-20",
"expiry_date": null,
"created_at": "2023-06-16T14:20:00Z",
"updated_at": "2023-06-23T11:00:00Z"
}
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Delete Shop Owner Document */}
        <div>
          <h3 className="text-xl font-medium mb-3">Delete Shop Owner Document</h3>
          <div className="mb-2">
            <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 font-mono">DELETE</span>
            <span className="font-mono">/api/shop-owner-documents/{"{id}"}</span>
          </div>
          <p className="mb-3">Deletes a shop owner document. Only accessible to users with the "customer" role.</p>
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
                  <td className="border p-2">Unique identifier of the shop owner document</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
"success": true,
"message": "Shop owner document deleted successfully"
}`}
            </CodeBlock>
          </div>
        </div>
      </DocPaper>
    </div>
  )
}
