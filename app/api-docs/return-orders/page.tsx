import type { Metadata } from "next"
import { CodeBlock } from "@/components/code-block"
import { DocPaper } from "@/components/doc-paper"

export const metadata: Metadata = {
  title: "Return Orders API Documentation",
  description: "API documentation for managing return orders in the grocery management system",
}

export default function ReturnOrdersApiDocs() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Return Orders API</h1>

      {/* Overview Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The Return Orders API allows you to manage product returns in the grocery management system. It provides
          endpoints for creating, retrieving, updating, and processing return requests.
        </p>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Base URL</h3>
          <p>
            <code className="bg-slate-100 px-1 py-0.5 rounded">https://api.grocerymanagement.com/api</code>
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Authentication</h3>
          <p className="mb-2">
            All API requests require authentication using a Bearer token in the Authorization header:
          </p>
          <CodeBlock language="bash" className="bg-slate-800 text-slate-50">
            {`Authorization: Bearer YOUR_API_TOKEN`}
          </CodeBlock>
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

        {/* List Return Orders */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">List Return Orders</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              GET
            </span>
            <code className="font-mono">/api/return-orders</code>
          </div>
          <p className="mb-3">Retrieves a list of return orders with optional filtering.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Query Parameters</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">status</code> - Filter by return status (pending,
                approved, rejected, completed)
              </li>
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">user_id</code> - Filter by user ID
              </li>
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">order_id</code> - Filter by original order ID
              </li>
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">limit</code> - Number of results per page (default:
                20, max: 100)
              </li>
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">offset</code> - Pagination offset (default: 0)
              </li>
            </ul>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Response</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "data": [
    {
      "id": "ret_12345",
      "order_id": "ord_67890",
      "user_id": "usr_54321",
      "status": "pending",
      "reason": "Damaged product",
      "created_at": "2023-09-15T14:30:00Z",
      "updated_at": "2023-09-15T14:30:00Z",
      "items": [
        {
          "id": "ri_12345",
          "product_id": "prod_12345",
          "quantity": 2,
          "reason": "Damaged packaging",
          "images": ["https://example.com/image1.jpg"]
        }
      ],
      "refund_amount": 24.98,
      "refund_status": "pending"
    }
  ],
  "meta": {
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get Return Order by ID */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get Return Order by ID</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              GET
            </span>
            <code className="font-mono">/api/return-orders/{"{return_id}"}</code>
          </div>
          <p className="mb-3">Retrieves detailed information about a specific return order.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Path Parameters</h4>
            <ul className="list-disc pl-5">
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">return_id</code> - The ID of the return order
              </li>
            </ul>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Response</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "id": "ret_12345",
  "order_id": "ord_67890",
  "user_id": "usr_54321",
  "status": "pending",
  "reason": "Damaged product",
  "created_at": "2023-09-15T14:30:00Z",
  "updated_at": "2023-09-15T14:30:00Z",
  "items": [
    {
      "id": "ri_12345",
      "product_id": "prod_12345",
      "name": "Organic Apples",
      "quantity": 2,
      "price": 12.49,
      "reason": "Damaged packaging",
      "images": ["https://example.com/image1.jpg"]
    }
  ],
  "refund_amount": 24.98,
  "refund_status": "pending",
  "refund_method": "original_payment",
  "notes": "Customer reported damaged packaging upon delivery"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Create Return Order */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Create Return Order</h3>
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              POST
            </span>
            <code className="font-mono">/api/return-orders</code>
          </div>
          <p className="mb-3">Creates a new return order request.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Request Body</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "order_id": "ord_67890",
  "reason": "Damaged product",
  "items": [
    {
      "product_id": "prod_12345",
      "quantity": 2,
      "reason": "Damaged packaging",
      "images": ["https://example.com/image1.jpg"]
    }
  ],
  "notes": "Products arrived with torn packaging"
}`}
            </CodeBlock>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Response</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "id": "ret_12345",
  "order_id": "ord_67890",
  "user_id": "usr_54321",
  "status": "pending",
  "reason": "Damaged product",
  "created_at": "2023-09-15T14:30:00Z",
  "updated_at": "2023-09-15T14:30:00Z",
  "items": [
    {
      "id": "ri_12345",
      "product_id": "prod_12345",
      "quantity": 2,
      "reason": "Damaged packaging",
      "images": ["https://example.com/image1.jpg"]
    }
  ],
  "refund_amount": 24.98,
  "refund_status": "pending"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Update Return Order Status */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Update Return Order Status</h3>
          <div className="mb-2">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              PATCH
            </span>
            <code className="font-mono">/api/return-orders/{"{return_id}"}/status</code>
          </div>
          <p className="mb-3">Updates the status of a return order. Admin or vendor access required.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Path Parameters</h4>
            <ul className="list-disc pl-5">
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">return_id</code> - The ID of the return order
              </li>
            </ul>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Request Body</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "status": "approved",
  "admin_notes": "Approved after reviewing images of damaged products"
}`}
            </CodeBlock>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Response</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "id": "ret_12345",
  "status": "approved",
  "updated_at": "2023-09-16T10:15:00Z",
  "admin_notes": "Approved after reviewing images of damaged products"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Process Refund */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Process Refund</h3>
          <div className="mb-2">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              POST
            </span>
            <code className="font-mono">/api/return-orders/{"{return_id}"}/refund</code>
          </div>
          <p className="mb-3">Processes a refund for an approved return order. Admin access required.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Path Parameters</h4>
            <ul className="list-disc pl-5">
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">return_id</code> - The ID of the return order
              </li>
            </ul>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Request Body</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "refund_method": "original_payment",
  "refund_amount": 24.98,
  "notes": "Full refund processed"
}`}
            </CodeBlock>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Response</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "id": "ret_12345",
  "refund_id": "ref_98765",
  "refund_status": "completed",
  "refund_amount": 24.98,
  "refund_method": "original_payment",
  "processed_at": "2023-09-16T11:30:00Z"
}`}
            </CodeBlock>
          </div>
        </div>
      </DocPaper>

      {/* Models Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Models</h2>

        {/* Return Order Model */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Return Order</h3>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Field</th>
                <th className="py-2 px-4 border-b text-left">Type</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>id</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Unique identifier for the return order</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>order_id</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ID of the original order</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>user_id</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ID of the user who created the return</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>status</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Status of the return (pending, approved, rejected, completed)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>reason</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">General reason for the return</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>items</code>
                </td>
                <td className="py-2 px-4 border-b">array</td>
                <td className="py-2 px-4 border-b">Array of return items</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>refund_amount</code>
                </td>
                <td className="py-2 px-4 border-b">number</td>
                <td className="py-2 px-4 border-b">Total refund amount</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>refund_status</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Status of the refund (pending, processing, completed, failed)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>refund_method</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Method used for refund (original_payment, store_credit)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>notes</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Additional notes about the return</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>admin_notes</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Admin-only notes about the return</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>created_at</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ISO timestamp of when the return was created</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>updated_at</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ISO timestamp of when the return was last updated</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Return Item Model */}
        <div>
          <h3 className="text-xl font-medium mb-3">Return Item</h3>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Field</th>
                <th className="py-2 px-4 border-b text-left">Type</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>id</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Unique identifier for the return item</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>product_id</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ID of the product being returned</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>name</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Name of the product (included in detailed responses)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>quantity</code>
                </td>
                <td className="py-2 px-4 border-b">number</td>
                <td className="py-2 px-4 border-b">Quantity being returned</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>price</code>
                </td>
                <td className="py-2 px-4 border-b">number</td>
                <td className="py-2 px-4 border-b">Price per unit of the product</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>reason</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Specific reason for returning this item</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>images</code>
                </td>
                <td className="py-2 px-4 border-b">array</td>
                <td className="py-2 px-4 border-b">Array of image URLs showing the issue</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocPaper>

      {/* Examples Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Examples</h2>

        {/* JavaScript Example */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">JavaScript</h3>
          <CodeBlock language="javascript" className="bg-slate-800 text-slate-50">
            {`// Create a new return order
async function createReturnOrder() {
  const response = await fetch('https://api.grocerymanagement.com/api/return-orders', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      order_id: 'ord_67890',
      reason: 'Damaged product',
      items: [
        {
          product_id: 'prod_12345',
          quantity: 2,
          reason: 'Damaged packaging',
          images: ['https://example.com/image1.jpg']
        }
      ],
      notes: 'Products arrived with torn packaging'
    })
  });
  
  const data = await response.json();
  return data;
}

// Get a list of return orders
async function getReturnOrders() {
  const response = await fetch('https://api.grocerymanagement.com/api/return-orders?status=pending&limit=10', {
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN'
    }
  });
  
  const data = await response.json();
  return data;
}

// Update a return order status (admin only)
async function updateReturnStatus(returnId) {
  const response = await fetch(\`https://api.grocerymanagement.com/api/return-orders/\${returnId}/status\`, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer YOUR_ADMIN_API_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'approved',
      admin_notes: 'Approved after reviewing images of damaged products'
    })
  });
  
  const data = await response.json();
  return data;
}`}
          </CodeBlock>
        </div>

        {/* cURL Example */}
        <div>
          <h3 className="text-xl font-medium mb-3">cURL</h3>
          <CodeBlock language="bash" className="bg-slate-800 text-slate-50">
            {`# Create a new return order
curl -X POST https://api.grocerymanagement.com/api/return-orders \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "order_id": "ord_67890",
    "reason": "Damaged product",
    "items": [
      {
        "product_id": "prod_12345",
        "quantity": 2,
        "reason": "Damaged packaging",
        "images": ["https://example.com/image1.jpg"]
      }
    ],
    "notes": "Products arrived with torn packaging"
  }'

# Get a specific return order
curl -X GET https://api.grocerymanagement.com/api/return-orders/ret_12345 \\
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Process a refund (admin only)
curl -X POST https://api.grocerymanagement.com/api/return-orders/ret_12345/refund \\
  -H "Authorization: Bearer YOUR_ADMIN_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "refund_method": "original_payment",
    "refund_amount": 24.98,
    "notes": "Full refund processed"
  }'`}
          </CodeBlock>
        </div>
      </DocPaper>

      {/* Errors Section */}
      <DocPaper>
        <h2 className="text-2xl font-semibold mb-6">Errors</h2>

        <div className="mb-4">
          <p className="mb-2">
            The API uses conventional HTTP response codes to indicate the success or failure of an API request.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>2xx</strong> - Success
            </li>
            <li>
              <strong>4xx</strong> - Client error (invalid request, authentication, etc.)
            </li>
            <li>
              <strong>5xx</strong> - Server error
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Error Response Format</h3>
          <CodeBlock language="json" className="bg-slate-800 text-slate-50">
            {`{
  "error": {
    "code": "invalid_return_status",
    "message": "Cannot process refund for a return that is not approved",
    "status": 400
  }
}`}
          </CodeBlock>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-3">Common Error Codes</h3>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Code</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>authentication_required</code>
                </td>
                <td className="py-2 px-4 border-b">No valid API token provided</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>permission_denied</code>
                </td>
                <td className="py-2 px-4 border-b">
                  The provided API token doesn't have permission to perform the request
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>return_not_found</code>
                </td>
                <td className="py-2 px-4 border-b">The specified return order does not exist</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>order_not_found</code>
                </td>
                <td className="py-2 px-4 border-b">The specified order does not exist</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>invalid_return_status</code>
                </td>
                <td className="py-2 px-4 border-b">The return status transition is not allowed</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>return_window_expired</code>
                </td>
                <td className="py-2 px-4 border-b">The return window for this order has expired</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>invalid_refund_amount</code>
                </td>
                <td className="py-2 px-4 border-b">The refund amount exceeds the original order amount</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>refund_already_processed</code>
                </td>
                <td className="py-2 px-4 border-b">A refund has already been processed for this return</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocPaper>
    </div>
  )
}
