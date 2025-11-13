import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GRNDocumentation() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Goods Received Notes (GRN) API</h2>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Introduction</h3>
              <p>
                The Goods Received Notes (GRN) API allows you to manage the receipt of goods against purchase orders.
                GRNs are created when goods are physically received at the warehouse or store and need to be recorded in
                the system.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Base URL</h3>
              <p>
                <code className="bg-slate-800 text-slate-50 px-1 py-0.5 rounded">
                  https://api.groceryapp.com/api/grn
                </code>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Authentication</h3>
              <p>All GRN API endpoints require authentication. Include your API key in the request header:</p>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto mt-2">
                <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Rate Limiting</h3>
              <p>
                API requests are limited to 100 requests per minute per API key. If you exceed this limit, you will
                receive a 429 Too Many Requests response.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints">
          <div className="space-y-8">
            {/* List GRNs */}
            <div>
              <h3 className="text-xl font-semibold mb-2">List GRNs</h3>
              <p className="mb-2">Retrieves a list of all GRNs with optional filtering.</p>

              <h4 className="font-medium mt-4 mb-1">Endpoint</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>GET /api/grn</code>
              </pre>

              <h4 className="font-medium mt-4 mb-1">Query Parameters</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <code>purchase_order_id</code> (optional) - Filter GRNs by purchase order ID
                </li>
                <li>
                  <code>status</code> (optional) - Filter by status (pending, completed, rejected)
                </li>
                <li>
                  <code>date_from</code> (optional) - Filter by date range start (YYYY-MM-DD)
                </li>
                <li>
                  <code>date_to</code> (optional) - Filter by date range end (YYYY-MM-DD)
                </li>
                <li>
                  <code>page</code> (optional) - Page number for pagination (default: 1)
                </li>
                <li>
                  <code>limit</code> (optional) - Number of results per page (default: 20, max: 100)
                </li>
              </ul>

              <h4 className="font-medium mt-4 mb-1">Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "data": [
    {
      "id": "grn_123456",
      "purchase_order_id": "po_789012",
      "received_date": "2023-06-15T10:30:00Z",
      "received_by": "user_345678",
      "status": "completed",
      "notes": "All items received in good condition",
      "created_at": "2023-06-15T10:35:22Z",
      "updated_at": "2023-06-15T10:35:22Z"
    },
    {
      "id": "grn_123457",
      "purchase_order_id": "po_789013",
      "received_date": "2023-06-16T14:20:00Z",
      "received_by": "user_345679",
      "status": "pending",
      "notes": "Partial delivery, waiting for remaining items",
      "created_at": "2023-06-16T14:25:18Z",
      "updated_at": "2023-06-16T14:25:18Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}`}</code>
              </pre>
            </div>

            {/* Get GRN by ID */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Get GRN by ID</h3>
              <p className="mb-2">Retrieves a specific GRN by its ID.</p>

              <h4 className="font-medium mt-4 mb-1">Endpoint</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>GET /api/grn/{"{grn_id}"}</code>
              </pre>

              <h4 className="font-medium mt-4 mb-1">Path Parameters</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <code>grn_id</code> (required) - The ID of the GRN to retrieve
                </li>
              </ul>

              <h4 className="font-medium mt-4 mb-1">Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "data": {
    "id": "grn_123456",
    "purchase_order_id": "po_789012",
    "received_date": "2023-06-15T10:30:00Z",
    "received_by": "user_345678",
    "status": "completed",
    "notes": "All items received in good condition",
    "created_at": "2023-06-15T10:35:22Z",
    "updated_at": "2023-06-15T10:35:22Z",
    "items": [
      {
        "id": "grni_234567",
        "grn_id": "grn_123456",
        "product_id": "prod_456789",
        "quantity_ordered": 50,
        "quantity_received": 50,
        "unit_price": 2.99,
        "batch_number": "BT20230615",
        "expiry_date": "2024-06-15",
        "notes": "Good condition"
      },
      {
        "id": "grni_234568",
        "grn_id": "grn_123456",
        "product_id": "prod_456790",
        "quantity_ordered": 30,
        "quantity_received": 30,
        "unit_price": 1.99,
        "batch_number": "BT20230615",
        "expiry_date": "2024-03-15",
        "notes": null
      }
    ]
  }
}`}</code>
              </pre>
            </div>

            {/* Create GRN */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Create GRN</h3>
              <p className="mb-2">Creates a new Goods Received Note for a purchase order.</p>

              <h4 className="font-medium mt-4 mb-1">Endpoint</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>POST /api/grn</code>
              </pre>

              <h4 className="font-medium mt-4 mb-1">Request Body</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "purchase_order_id": "po_789012",
  "received_date": "2023-06-15T10:30:00Z",
  "received_by": "user_345678",
  "notes": "All items received in good condition",
  "items": [
    {
      "product_id": "prod_456789",
      "quantity_received": 50,
      "batch_number": "BT20230615",
      "expiry_date": "2024-06-15",
      "notes": "Good condition"
    },
    {
      "product_id": "prod_456790",
      "quantity_received": 30,
      "batch_number": "BT20230615",
      "expiry_date": "2024-03-15"
    }
  ]
}`}</code>
              </pre>

              <h4 className="font-medium mt-4 mb-1">Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "data": {
    "id": "grn_123456",
    "purchase_order_id": "po_789012",
    "received_date": "2023-06-15T10:30:00Z",
    "received_by": "user_345678",
    "status": "completed",
    "notes": "All items received in good condition",
    "created_at": "2023-06-15T10:35:22Z",
    "updated_at": "2023-06-15T10:35:22Z",
    "items": [
      {
        "id": "grni_234567",
        "grn_id": "grn_123456",
        "product_id": "prod_456789",
        "quantity_ordered": 50,
        "quantity_received": 50,
        "unit_price": 2.99,
        "batch_number": "BT20230615",
        "expiry_date": "2024-06-15",
        "notes": "Good condition"
      },
      {
        "id": "grni_234568",
        "grn_id": "grn_123456",
        "product_id": "prod_456790",
        "quantity_ordered": 30,
        "quantity_received": 30,
        "unit_price": 1.99,
        "batch_number": "BT20230615",
        "expiry_date": "2024-03-15",
        "notes": null
      }
    ]
  }
}`}</code>
              </pre>
            </div>

            {/* Update GRN */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Update GRN</h3>
              <p className="mb-2">Updates an existing GRN. Only allowed if the GRN status is 'pending'.</p>

              <h4 className="font-medium mt-4 mb-1">Endpoint</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>PUT /api/grn/{"{grn_id}"}</code>
              </pre>

              <h4 className="font-medium mt-4 mb-1">Path Parameters</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <code>grn_id</code> (required) - The ID of the GRN to update
                </li>
              </ul>

              <h4 className="font-medium mt-4 mb-1">Request Body</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "received_date": "2023-06-15T11:30:00Z",
  "notes": "Updated notes - some items had minor damage",
  "items": [
    {
      "id": "grni_234567",
      "quantity_received": 48,
      "notes": "2 items damaged"
    },
    {
      "id": "grni_234568",
      "quantity_received": 30,
      "batch_number": "BT20230615-A"
    }
  ]
}`}</code>
              </pre>

              <h4 className="font-medium mt-4 mb-1">Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "data": {
    "id": "grn_123456",
    "purchase_order_id": "po_789012",
    "received_date": "2023-06-15T11:30:00Z",
    "received_by": "user_345678",
    "status": "completed",
    "notes": "Updated notes - some items had minor damage",
    "created_at": "2023-06-15T10:35:22Z",
    "updated_at": "2023-06-15T11:40:15Z",
    "items": [
      {
        "id": "grni_234567",
        "grn_id": "grn_123456",
        "product_id": "prod_456789",
        "quantity_ordered": 50,
        "quantity_received": 48,
        "unit_price": 2.99,
        "batch_number": "BT20230615",
        "expiry_date": "2024-06-15",
        "notes": "2 items damaged"
      },
      {
        "id": "grni_234568",
        "grn_id": "grn_123456",
        "product_id": "prod_456790",
        "quantity_ordered": 30,
        "quantity_received": 30,
        "unit_price": 1.99,
        "batch_number": "BT20230615-A",
        "expiry_date": "2024-03-15",
        "notes": null
      }
    ]
  }
}`}</code>
              </pre>
            </div>

            {/* Complete GRN */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Complete GRN</h3>
              <p className="mb-2">
                Marks a GRN as completed, which updates inventory levels and finalizes the receipt process.
              </p>

              <h4 className="font-medium mt-4 mb-1">Endpoint</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>PATCH /api/grn/{"{grn_id}"}/complete</code>
              </pre>

              <h4 className="font-medium mt-4 mb-1">Path Parameters</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <code>grn_id</code> (required) - The ID of the GRN to complete
                </li>
              </ul>

              <h4 className="font-medium mt-4 mb-1">Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "data": {
    "id": "grn_123456",
    "status": "completed",
    "updated_at": "2023-06-15T12:05:33Z",
    "message": "GRN has been marked as completed and inventory has been updated"
  }
}`}</code>
              </pre>
            </div>

            {/* Reject GRN */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Reject GRN</h3>
              <p className="mb-2">Marks a GRN as rejected, which cancels the receipt process.</p>

              <h4 className="font-medium mt-4 mb-1">Endpoint</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>PATCH /api/grn/{"{grn_id}"}/reject</code>
              </pre>

              <h4 className="font-medium mt-4 mb-1">Path Parameters</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <code>grn_id</code> (required) - The ID of the GRN to reject
                </li>
              </ul>

              <h4 className="font-medium mt-4 mb-1">Request Body</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "rejection_reason": "Items received were damaged beyond acceptable limits"
}`}</code>
              </pre>

              <h4 className="font-medium mt-4 mb-1">Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "data": {
    "id": "grn_123456",
    "status": "rejected",
    "rejection_reason": "Items received were damaged beyond acceptable limits",
    "updated_at": "2023-06-15T12:10:45Z",
    "message": "GRN has been marked as rejected"
  }
}`}</code>
              </pre>
            </div>

            {/* Get GRN Items */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Get GRN Items</h3>
              <p className="mb-2">Retrieves all items for a specific GRN.</p>

              <h4 className="font-medium mt-4 mb-1">Endpoint</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>GET /api/grn/{"{grn_id}"}/items</code>
              </pre>

              <h4 className="font-medium mt-4 mb-1">Path Parameters</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <code>grn_id</code> (required) - The ID of the GRN
                </li>
              </ul>

              <h4 className="font-medium mt-4 mb-1">Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "data": [
    {
      "id": "grni_234567",
      "grn_id": "grn_123456",
      "product_id": "prod_456789",
      "product_name": "Organic Apples",
      "quantity_ordered": 50,
      "quantity_received": 48,
      "unit_price": 2.99,
      "batch_number": "BT20230615",
      "expiry_date": "2024-06-15",
      "notes": "2 items damaged"
    },
    {
      "id": "grni_234568",
      "grn_id": "grn_123456",
      "product_id": "prod_456790",
      "product_name": "Fresh Milk",
      "quantity_ordered": 30,
      "quantity_received": 30,
      "unit_price": 1.99,
      "batch_number": "BT20230615-A",
      "expiry_date": "2024-03-15",
      "notes": null
    }
  ]
}`}</code>
              </pre>
            </div>
          </div>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">GRN Model</h3>
              <table className="min-w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Field</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">id</td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">Unique identifier for the GRN</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">purchase_order_id</td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">Reference to the purchase order</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">received_date</td>
                    <td className="border border-gray-300 px-4 py-2">datetime</td>
                    <td className="border border-gray-300 px-4 py-2">Date and time when goods were received</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">received_by</td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">User ID of the person who received the goods</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">status</td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">
                      Status of the GRN (pending, completed, rejected)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">notes</td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">Additional notes about the receipt</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">rejection_reason</td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">Reason for rejection (if status is 'rejected')</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">created_at</td>
                    <td className="border border-gray-300 px-4 py-2">datetime</td>
                    <td className="border border-gray-300 px-4 py-2">Timestamp when the GRN was created</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">updated_at</td>
                    <td className="border border-gray-300 px-4 py-2">datetime</td>
                    <td className="border border-gray-300 px-4 py-2">Timestamp when the GRN was last updated</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">GRN Item Model</h3>
              <table className="min-w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Field</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">id</td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">Unique identifier for the GRN item</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">grn_id</td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">Reference to the parent GRN</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">product_id</td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">Reference to the product</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">quantity_ordered</td>
                    <td className="border border-gray-300 px-4 py-2">number</td>
                    <td className="border border-gray-300 px-4 py-2">Quantity ordered in the purchase order</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">quantity_received</td>
                    <td className="border border-gray-300 px-4 py-2">number</td>
                    <td className="border border-gray-300 px-4 py-2">Quantity actually received</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">unit_price</td>
                    <td className="border border-gray-300 px-4 py-2">number</td>
                    <td className="border border-gray-300 px-4 py-2">Price per unit</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">batch_number</td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">Batch or lot number of the received goods</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">expiry_date</td>
                    <td className="border border-gray-300 px-4 py-2">date</td>
                    <td className="border border-gray-300 px-4 py-2">Expiry date of the product (if applicable)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">notes</td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">Additional notes about the item</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Creating a GRN</h3>
              <p className="mb-4">This example demonstrates how to create a new GRN for a purchase order.</p>

              <h4 className="font-medium mb-2">JavaScript Example</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`// Create a new GRN
async function createGRN() {
  const token = 'YOUR_API_KEY';
  
  const grnData = {
    purchase_order_id: "po_789012",
    received_date: new Date().toISOString(),
    received_by: "user_345678",
    notes: "Regular delivery, all items in good condition",
    items: [
      {
        product_id: "prod_456789",
        quantity_received: 50,
        batch_number: "BT20230615",
        expiry_date: "2024-06-15",
        notes: "Good condition"
      },
      {
        product_id: "prod_456790",
        quantity_received: 30,
        batch_number: "BT20230615",
        expiry_date: "2024-03-15"
      }
    ]
  };

  try {
    const response = await fetch('https://api.groceryapp.com/api/grn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      },
      body: JSON.stringify(grnData)
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create GRN');
    }

    console.log('GRN created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating GRN:', error);
    throw error;
  }
}`}</code>
              </pre>

              <h4 className="font-medium mt-4 mb-2">cURL Example</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`curl -X POST https://api.groceryapp.com/api/grn \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "purchase_order_id": "po_789012",
    "received_date": "2023-06-15T10:30:00Z",
    "received_by": "user_345678",
    "notes": "All items received in good condition",
    "items": [
      {
        "product_id": "prod_456789",
        "quantity_received": 50,
        "batch_number": "BT20230615",
        "expiry_date": "2024-06-15",
        "notes": "Good condition"
      },
      {
        "product_id": "prod_456790",
        "quantity_received": 30,
        "batch_number": "BT20230615",
        "expiry_date": "2024-03-15"
      }
    ]
  }'`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Completing a GRN</h3>
              <p className="mb-4">This example demonstrates how to mark a GRN as completed.</p>

              <h4 className="font-medium mb-2">JavaScript Example</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`// Complete a GRN
async function completeGRN(grnId) {
  const token = 'YOUR_API_KEY';
  
  try {
    const response = await fetch(\`https://api.groceryapp.com/api/grn/\${grnId}/complete\`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to complete GRN');
    }
    
    console.log('GRN completed successfully:', data);
    return data;
  } catch (error) {
    console.error('Error completing GRN:', error);
    throw error;
  }
}`}</code>
              </pre>

              <h4 className="font-medium mt-4 mb-2">cURL Example</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`curl -X PATCH https://api.groceryapp.com/api/grn/grn_123456/complete \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
              </pre>
            </div>
          </div>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">HTTP Status Codes</h3>
              <table className="min-w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Status Code</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">200 OK</td>
                    <td className="border border-gray-300 px-4 py-2">The request was successful</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">201 Created</td>
                    <td className="border border-gray-300 px-4 py-2">The resource was successfully created</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">400 Bad Request</td>
                    <td className="border border-gray-300 px-4 py-2">The request was invalid or cannot be served</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">401 Unauthorized</td>
                    <td className="border border-gray-300 px-4 py-2">
                      Authentication is required and has failed or not been provided
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">403 Forbidden</td>
                    <td className="border border-gray-300 px-4 py-2">
                      The request is understood but has been refused or access is not allowed
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">404 Not Found</td>
                    <td className="border border-gray-300 px-4 py-2">The requested resource could not be found</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">409 Conflict</td>
                    <td className="border border-gray-300 px-4 py-2">
                      The request conflicts with the current state of the server
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">422 Unprocessable Entity</td>
                    <td className="border border-gray-300 px-4 py-2">
                      The request was well-formed but was unable to be followed due to semantic errors
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">429 Too Many Requests</td>
                    <td className="border border-gray-300 px-4 py-2">
                      Too many requests have been sent in a given amount of time
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">500 Internal Server Error</td>
                    <td className="border border-gray-300 px-4 py-2">An error occurred on the server</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Error Response Format</h3>
              <p className="mb-2">
                When an error occurs, the API will return a JSON response with the following format:
              </p>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto mt-2">
                <code>{`{
  "error": {
    "code": "ERROR_CODE",
    "message": "A human-readable error message",
    "details": {
      // Additional error details if available
    }
  }
}`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Common Error Codes</h3>
              <table className="min-w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Error Code</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">INVALID_REQUEST</td>
                    <td className="border border-gray-300 px-4 py-2">The request body contains invalid data</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">PURCHASE_ORDER_NOT_FOUND</td>
                    <td className="border border-gray-300 px-4 py-2">The referenced purchase order does not exist</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">GRN_NOT_FOUND</td>
                    <td className="border border-gray-300 px-4 py-2">The requested GRN does not exist</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">PRODUCT_NOT_FOUND</td>
                    <td className="border border-gray-300 px-4 py-2">One or more products in the GRN do not exist</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">INVALID_STATUS_TRANSITION</td>
                    <td className="border border-gray-300 px-4 py-2">The requested status change is not allowed</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">PURCHASE_ORDER_ALREADY_RECEIVED</td>
                    <td className="border border-gray-300 px-4 py-2">A GRN already exists for this purchase order</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">INVALID_QUANTITY</td>
                    <td className="border border-gray-300 px-4 py-2">The received quantity is invalid</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">UNAUTHORIZED_ACCESS</td>
                    <td className="border border-gray-300 px-4 py-2">
                      You do not have permission to perform this action
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
