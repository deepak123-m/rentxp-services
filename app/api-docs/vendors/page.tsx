import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VendorsApiPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendors API</CardTitle>
        <CardDescription>API endpoints for managing vendors in the grocery management system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="prose max-w-none">
              <h3>Introduction</h3>
              <p>
                The Vendors API allows you to manage vendor information in the grocery management system. You can
                create, retrieve, update, and delete vendor records, as well as manage vendor categories and contact
                information.
              </p>

              <h3>Base URL</h3>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/vendors`}</code>
              </pre>

              <h3>Authentication</h3>
              <p>
                All vendor API endpoints require authentication. You must include a valid JWT token in the Authorization
                header of your requests.
              </p>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>Authorization: Bearer YOUR_JWT_TOKEN</code>
              </pre>

              <h3>Rate Limiting</h3>
              <p>
                API requests are limited to 100 requests per minute per user. If you exceed this limit, you will receive
                a 429 Too Many Requests response.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <div className="prose max-w-none">
              <h3>List All Vendors</h3>
              <p>
                <code>GET /api/vendors</code>
              </p>
              <p>Retrieves a list of all vendors.</p>

              <h4>Query Parameters</h4>
              <ul>
                <li>
                  <code>page</code> (optional): Page number for pagination (default: 1)
                </li>
                <li>
                  <code>limit</code> (optional): Number of items per page (default: 20, max: 100)
                </li>
                <li>
                  <code>category</code> (optional): Filter vendors by category
                </li>
                <li>
                  <code>search</code> (optional): Search term to filter vendors by name or description
                </li>
              </ul>

              <h4>Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "data": [
    {
      "id": "vendor_123",
      "name": "Fresh Farms Inc.",
      "description": "Local produce supplier",
      "contact_name": "John Smith",
      "email": "john@freshfarms.com",
      "phone": "+1-555-123-4567",
      "address": "123 Farm Road, Farmville, CA 94107",
      "category": "produce",
      "status": "active",
      "created_at": "2023-01-15T08:30:00Z",
      "updated_at": "2023-03-20T14:15:30Z"
    },
    // More vendors...
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}`}</code>
              </pre>

              <h3>Get Vendor by ID</h3>
              <p>
                <code>GET /api/vendors/{"{vendor_id}"}</code>
              </p>
              <p>Retrieves a specific vendor by ID.</p>

              <h4>Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "id": "vendor_123",
  "name": "Fresh Farms Inc.",
  "description": "Local produce supplier",
  "contact_name": "John Smith",
  "email": "john@freshfarms.com",
  "phone": "+1-555-123-4567",
  "address": "123 Farm Road, Farmville, CA 94107",
  "category": "produce",
  "status": "active",
  "created_at": "2023-01-15T08:30:00Z",
  "updated_at": "2023-03-20T14:15:30Z"
}`}</code>
              </pre>

              <h3>Create Vendor</h3>
              <p>
                <code>POST /api/vendors</code>
              </p>
              <p>Creates a new vendor.</p>

              <h4>Request Body</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "name": "Organic Goods Co.",
  "description": "Organic food supplier",
  "contact_name": "Jane Doe",
  "email": "jane@organicgoods.com",
  "phone": "+1-555-987-6543",
  "address": "456 Green Street, Ecoville, CA 94108",
  "category": "organic"
}`}</code>
              </pre>

              <h4>Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "id": "vendor_456",
  "name": "Organic Goods Co.",
  "description": "Organic food supplier",
  "contact_name": "Jane Doe",
  "email": "jane@organicgoods.com",
  "phone": "+1-555-987-6543",
  "address": "456 Green Street, Ecoville, CA 94108",
  "category": "organic",
  "status": "active",
  "created_at": "2023-04-10T09:45:00Z",
  "updated_at": "2023-04-10T09:45:00Z"
}`}</code>
              </pre>

              <h3>Update Vendor</h3>
              <p>
                <code>PUT /api/vendors/{"{vendor_id}"}</code>
              </p>
              <p>Updates an existing vendor.</p>

              <h4>Request Body</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "name": "Organic Goods Company",
  "description": "Premium organic food supplier",
  "contact_name": "Jane Doe",
  "email": "jane@organicgoods.com",
  "phone": "+1-555-987-6543",
  "address": "456 Green Street, Ecoville, CA 94108",
  "category": "organic"
}`}</code>
              </pre>

              <h4>Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "id": "vendor_456",
  "name": "Organic Goods Company",
  "description": "Premium organic food supplier",
  "contact_name": "Jane Doe",
  "email": "jane@organicgoods.com",
  "phone": "+1-555-987-6543",
  "address": "456 Green Street, Ecoville, CA 94108",
  "category": "organic",
  "status": "active",
  "created_at": "2023-04-10T09:45:00Z",
  "updated_at": "2023-04-10T10:30:00Z"
}`}</code>
              </pre>

              <h3>Delete Vendor</h3>
              <p>
                <code>DELETE /api/vendors/{"{vendor_id}"}</code>
              </p>
              <p>Deletes a vendor.</p>

              <h4>Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "success": true,
  "message": "Vendor deleted successfully"
}`}</code>
              </pre>

              <h3>Get Vendor Categories</h3>
              <p>
                <code>GET /api/vendors/categories</code>
              </p>
              <p>Retrieves a list of all vendor categories.</p>

              <h4>Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "categories": [
    "produce",
    "dairy",
    "bakery",
    "meat",
    "seafood",
    "organic",
    "frozen",
    "beverages",
    "snacks",
    "household"
  ]
}`}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <div className="prose max-w-none">
              <h3>Vendor Model</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Field</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">id</td>
                    <td className="border p-2">string</td>
                    <td className="border p-2">Unique identifier for the vendor</td>
                  </tr>
                  <tr>
                    <td className="border p-2">name</td>
                    <td className="border p-2">string</td>
                    <td className="border p-2">Name of the vendor</td>
                  </tr>
                  <tr>
                    <td className="border p-2">description</td>
                    <td className="border p-2">string</td>
                    <td className="border p-2">Description of the vendor</td>
                  </tr>
                  <tr>
                    <td className="border p-2">contact_name</td>
                    <td className="border p-2">string</td>
                    <td className="border p-2">Name of the primary contact person</td>
                  </tr>
                  <tr>
                    <td className="border p-2">email</td>
                    <td className="border p-2">string</td>
                    <td className="border p-2">Email address of the vendor</td>
                  </tr>
                  <tr>
                    <td className="border p-2">phone</td>
                    <td className="border p-2">string</td>
                    <td className="border p-2">Phone number of the vendor</td>
                  </tr>
                  <tr>
                    <td className="border p-2">address</td>
                    <td className="border p-2">string</td>
                    <td className="border p-2">Physical address of the vendor</td>
                  </tr>
                  <tr>
                    <td className="border p-2">category</td>
                    <td className="border p-2">string</td>
                    <td className="border p-2">Category of products the vendor supplies</td>
                  </tr>
                  <tr>
                    <td className="border p-2">status</td>
                    <td className="border p-2">string</td>
                    <td className="border p-2">Status of the vendor (active, inactive)</td>
                  </tr>
                  <tr>
                    <td className="border p-2">created_at</td>
                    <td className="border p-2">string (ISO date)</td>
                    <td className="border p-2">Date and time when the vendor was created</td>
                  </tr>
                  <tr>
                    <td className="border p-2">updated_at</td>
                    <td className="border p-2">string (ISO date)</td>
                    <td className="border p-2">Date and time when the vendor was last updated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <div className="prose max-w-none">
              <h3>JavaScript Example</h3>
              <p>Here's an example of how to use the Vendors API with JavaScript:</p>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`// Get all vendors
async function getVendors() {
  const response = await fetch('${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/vendors', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN',
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch vendors');
  }
  
  return await response.json();
}

// Create a new vendor
async function createVendor(vendorData) {
  const response = await fetch('${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/vendors', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(vendorData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create vendor');
  }
  
  return await response.json();
}

// Update a vendor
async function updateVendor(vendorId, vendorData) {
  const response = await fetch('${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/vendors/' + vendorId, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(vendorData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update vendor');
  }
  
  return await response.json();
}`}</code>
              </pre>

              <h3>cURL Example</h3>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`# Get all vendors
curl -X GET \\
  '${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/vendors' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json'

# Create a new vendor
curl -X POST \\
  '${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/vendors' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Organic Goods Co.",
    "description": "Organic food supplier",
    "contact_name": "Jane Doe",
    "email": "jane@organicgoods.com",
    "phone": "+1-555-987-6543",
    "address": "456 Green Street, Ecoville, CA 94108",
    "category": "organic"
  }'`}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            <div className="prose max-w-none">
              <h3>Error Codes</h3>
              <p>
                The Vendors API uses standard HTTP status codes to indicate the success or failure of an API request.
              </p>

              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Status Code</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">200 OK</td>
                    <td className="border p-2">The request was successful</td>
                  </tr>
                  <tr>
                    <td className="border p-2">201 Created</td>
                    <td className="border p-2">The resource was successfully created</td>
                  </tr>
                  <tr>
                    <td className="border p-2">400 Bad Request</td>
                    <td className="border p-2">The request was invalid or cannot be served</td>
                  </tr>
                  <tr>
                    <td className="border p-2">401 Unauthorized</td>
                    <td className="border p-2">Authentication failed or user doesn't have permissions</td>
                  </tr>
                  <tr>
                    <td className="border p-2">404 Not Found</td>
                    <td className="border p-2">The requested resource could not be found</td>
                  </tr>
                  <tr>
                    <td className="border p-2">409 Conflict</td>
                    <td className="border p-2">The request conflicts with the current state of the server</td>
                  </tr>
                  <tr>
                    <td className="border p-2">429 Too Many Requests</td>
                    <td className="border p-2">Rate limit exceeded</td>
                  </tr>
                  <tr>
                    <td className="border p-2">500 Internal Server Error</td>
                    <td className="border p-2">An error occurred on the server</td>
                  </tr>
                </tbody>
              </table>

              <h3>Error Response Format</h3>
              <p>When an error occurs, the API returns a JSON object with the following structure:</p>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "error": {
    "code": "VENDOR_NOT_FOUND",
    "message": "The requested vendor could not be found",
    "details": {
      "vendor_id": "vendor_999"
    }
  }
}`}</code>
              </pre>

              <h3>Common Error Codes</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Error Code</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">VENDOR_NOT_FOUND</td>
                    <td className="border p-2">The requested vendor could not be found</td>
                  </tr>
                  <tr>
                    <td className="border p-2">INVALID_VENDOR_DATA</td>
                    <td className="border p-2">The vendor data provided is invalid</td>
                  </tr>
                  <tr>
                    <td className="border p-2">DUPLICATE_VENDOR</td>
                    <td className="border p-2">A vendor with the same name already exists</td>
                  </tr>
                  <tr>
                    <td className="border p-2">UNAUTHORIZED</td>
                    <td className="border p-2">You are not authorized to perform this action</td>
                  </tr>
                  <tr>
                    <td className="border p-2">RATE_LIMIT_EXCEEDED</td>
                    <td className="border p-2">You have exceeded the rate limit for this API</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
