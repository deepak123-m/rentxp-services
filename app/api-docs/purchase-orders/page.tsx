import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PurchaseOrdersApiDocs() {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-4">Purchase Orders API</h2>

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
              <h3 className="text-xl font-semibold">Purchase Orders API Overview</h3>
              <p>
                The Purchase Orders API allows you to manage purchase orders in the grocery management system. Purchase
                orders represent inventory orders placed with vendors.
              </p>

              <h4 className="text-lg font-medium mt-4">Base URL</h4>
              <p>
                <code>/api/purchase-orders</code>
              </p>

              <h4 className="text-lg font-medium mt-4">Authentication</h4>
              <p>
                All endpoints require authentication using a JWT token in the Authorization header. Only users with
                admin or inventory manager roles can access these endpoints.
              </p>

              <h4 className="text-lg font-medium mt-4">Rate Limiting</h4>
              <p>
                API requests are limited to 100 requests per minute per user. Exceeding this limit will result in a 429
                Too Many Requests response.
              </p>
            </div>
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Endpoints</h3>

              {/* List Purchase Orders */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium">List Purchase Orders</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md mr-2">GET</span>
                  <code>/api/purchase-orders</code>
                </p>
                <p>Retrieves a list of purchase orders with optional filtering.</p>

                <h5>Query Parameters</h5>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <code>status</code> - Filter by status (pending, approved, received, cancelled)
                  </li>
                  <li>
                    <code>vendor_id</code> - Filter by vendor ID
                  </li>
                  <li>
                    <code>from_date</code> - Filter by order date (from)
                  </li>
                  <li>
                    <code>to_date</code> - Filter by order date (to)
                  </li>
                  <li>
                    <code>limit</code> - Number of records to return (default: 20, max: 100)
                  </li>
                  <li>
                    <code>offset</code> - Number of records to skip (default: 0)
                  </li>
                </ul>

                <h5>Response</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "data": [
    {
      "id": "po-123456",
      "vendor_id": "v-789012",
      "vendor_name": "Fresh Farms Inc.",
      "status": "pending",
      "order_date": "2023-06-15T10:30:00Z",
      "expected_delivery_date": "2023-06-20T10:00:00Z",
      "total_amount": 2450.75,
      "items_count": 12,
      "created_at": "2023-06-15T10:30:00Z",
      "updated_at": "2023-06-15T10:30:00Z"
    },
    {
      "id": "po-123457",
      "vendor_id": "v-789013",
      "vendor_name": "Organic Supplies Co.",
      "status": "approved",
      "order_date": "2023-06-14T09:15:00Z",
      "expected_delivery_date": "2023-06-19T14:00:00Z",
      "total_amount": 1875.50,
      "items_count": 8,
      "created_at": "2023-06-14T09:15:00Z",
      "updated_at": "2023-06-14T15:20:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}`}</code>
                </pre>
              </div>

              {/* Get Purchase Order by ID */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Get Purchase Order by ID</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md mr-2">GET</span>
                  <code>/api/purchase-orders/{"{purchase_order_id}"}</code>
                </p>
                <p>Retrieves detailed information about a specific purchase order including all line items.</p>

                <h5>Path Parameters</h5>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <code>purchase_order_id</code> - The ID of the purchase order
                  </li>
                </ul>

                <h5>Response</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "id": "po-123456",
  "vendor_id": "v-789012",
  "vendor_name": "Fresh Farms Inc.",
  "status": "pending",
  "order_date": "2023-06-15T10:30:00Z",
  "expected_delivery_date": "2023-06-20T10:00:00Z",
  "delivery_address": {
    "street": "123 Warehouse Ave",
    "city": "Stockton",
    "state": "CA",
    "postal_code": "95204",
    "country": "USA"
  },
  "contact_person": "John Manager",
  "contact_email": "john@grocerystore.com",
  "contact_phone": "+1-555-123-4567",
  "notes": "Please deliver before 2 PM",
  "total_amount": 2450.75,
  "items": [
    {
      "id": "poi-111",
      "product_id": "prod-555",
      "product_name": "Organic Apples",
      "sku": "OA-12345",
      "quantity": 200,
      "unit": "kg",
      "unit_price": 2.50,
      "total_price": 500.00
    },
    {
      "id": "poi-112",
      "product_id": "prod-556",
      "product_name": "Fresh Milk",
      "sku": "FM-67890",
      "quantity": 150,
      "unit": "liter",
      "unit_price": 1.75,
      "total_price": 262.50
    }
  ],
  "created_at": "2023-06-15T10:30:00Z",
  "updated_at": "2023-06-15T10:30:00Z",
  "created_by": "user-789",
  "approved_by": null,
  "approved_at": null
}`}</code>
                </pre>
              </div>

              {/* Create Purchase Order */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Create Purchase Order</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2">POST</span>
                  <code>/api/purchase-orders</code>
                </p>
                <p>Creates a new purchase order.</p>

                <h5>Request Body</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "vendor_id": "v-789012",
  "expected_delivery_date": "2023-06-20T10:00:00Z",
  "delivery_address": {
    "street": "123 Warehouse Ave",
    "city": "Stockton",
    "state": "CA",
    "postal_code": "95204",
    "country": "USA"
  },
  "contact_person": "John Manager",
  "contact_email": "john@grocerystore.com",
  "contact_phone": "+1-555-123-4567",
  "notes": "Please deliver before 2 PM",
  "items": [
    {
      "product_id": "prod-555",
      "quantity": 200,
      "unit_price": 2.50
    },
    {
      "product_id": "prod-556",
      "quantity": 150,
      "unit_price": 1.75
    }
  ]
}`}</code>
                </pre>

                <h5>Response</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "id": "po-123456",
  "vendor_id": "v-789012",
  "status": "pending",
  "order_date": "2023-06-15T10:30:00Z",
  "expected_delivery_date": "2023-06-20T10:00:00Z",
  "total_amount": 762.50,
  "items_count": 2,
  "created_at": "2023-06-15T10:30:00Z",
  "updated_at": "2023-06-15T10:30:00Z"
}`}</code>
                </pre>
              </div>

              {/* Update Purchase Order */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Update Purchase Order</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md mr-2">PUT</span>
                  <code>/api/purchase-orders/{"{purchase_order_id}"}</code>
                </p>
                <p>Updates an existing purchase order. Only pending purchase orders can be updated.</p>

                <h5>Path Parameters</h5>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <code>purchase_order_id</code> - The ID of the purchase order to update
                  </li>
                </ul>

                <h5>Request Body</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "expected_delivery_date": "2023-06-21T14:00:00Z",
  "notes": "Updated: Please deliver before 4 PM",
  "items": [
    {
      "product_id": "prod-555",
      "quantity": 250,
      "unit_price": 2.50
    },
    {
      "product_id": "prod-556",
      "quantity": 150,
      "unit_price": 1.75
    }
  ]
}`}</code>
                </pre>

                <h5>Response</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "id": "po-123456",
  "vendor_id": "v-789012",
  "status": "pending",
  "order_date": "2023-06-15T10:30:00Z",
  "expected_delivery_date": "2023-06-21T14:00:00Z",
  "total_amount": 887.50,
  "items_count": 2,
  "created_at": "2023-06-15T10:30:00Z",
  "updated_at": "2023-06-15T14:45:00Z"
}`}</code>
                </pre>
              </div>

              {/* Approve Purchase Order */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Approve Purchase Order</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md mr-2">PATCH</span>
                  <code>/api/purchase-orders/{"{purchase_order_id}"}/approve</code>
                </p>
                <p>Approves a pending purchase order. Only users with admin role can approve purchase orders.</p>

                <h5>Path Parameters</h5>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <code>purchase_order_id</code> - The ID of the purchase order to approve
                  </li>
                </ul>

                <h5>Response</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "id": "po-123456",
  "status": "approved",
  "approved_by": "user-001",
  "approved_at": "2023-06-15T16:30:00Z",
  "updated_at": "2023-06-15T16:30:00Z"
}`}</code>
                </pre>
              </div>

              {/* Cancel Purchase Order */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Cancel Purchase Order</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md mr-2">PATCH</span>
                  <code>/api/purchase-orders/{"{purchase_order_id}"}/cancel</code>
                </p>
                <p>Cancels a purchase order. Only pending or approved purchase orders can be cancelled.</p>

                <h5>Path Parameters</h5>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <code>purchase_order_id</code> - The ID of the purchase order to cancel
                  </li>
                </ul>

                <h5>Request Body</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "cancellation_reason": "Vendor unable to fulfill order"
}`}</code>
                </pre>

                <h5>Response</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "id": "po-123456",
  "status": "cancelled",
  "cancellation_reason": "Vendor unable to fulfill order",
  "cancelled_by": "user-789",
  "cancelled_at": "2023-06-16T09:15:00Z",
  "updated_at": "2023-06-16T09:15:00Z"
}`}</code>
                </pre>
              </div>

              {/* Receive Purchase Order */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Receive Purchase Order</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md mr-2">PATCH</span>
                  <code>/api/purchase-orders/{"{purchase_order_id}"}/receive</code>
                </p>
                <p>
                  Marks a purchase order as received and updates inventory. Only approved purchase orders can be
                  received.
                </p>

                <h5>Path Parameters</h5>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <code>purchase_order_id</code> - The ID of the purchase order to receive
                  </li>
                </ul>

                <h5>Request Body</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "received_items": [
    {
      "product_id": "prod-555",
      "quantity_received": 245,
      "notes": "5 units damaged"
    },
    {
      "product_id": "prod-556",
      "quantity_received": 150,
      "notes": "All in good condition"
    }
  ],
  "delivery_notes": "Delivery was on time"
}`}</code>
                </pre>

                <h5>Response</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "id": "po-123456",
  "status": "received",
  "received_by": "user-789",
  "received_at": "2023-06-20T11:30:00Z",
  "updated_at": "2023-06-20T11:30:00Z",
  "grn_id": "grn-456789"
}`}</code>
                </pre>
              </div>
            </div>
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Data Models</h3>

              {/* Purchase Order Model */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Purchase Order</h4>
                <p>The main purchase order object.</p>

                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Field</th>
                      <th className="border p-2 text-left">Type</th>
                      <th className="border p-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">
                        <code>id</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">Unique identifier for the purchase order</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>vendor_id</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">ID of the vendor</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>vendor_name</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">Name of the vendor</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>status</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">
                        Status of the purchase order (pending, approved, received, cancelled)
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>order_date</code>
                      </td>
                      <td className="border p-2">string (ISO 8601)</td>
                      <td className="border p-2">Date when the purchase order was created</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>expected_delivery_date</code>
                      </td>
                      <td className="border p-2">string (ISO 8601)</td>
                      <td className="border p-2">Expected date of delivery</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>delivery_address</code>
                      </td>
                      <td className="border p-2">object</td>
                      <td className="border p-2">Address where items should be delivered</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>contact_person</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">Name of the contact person for this order</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>contact_email</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">Email of the contact person</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>contact_phone</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">Phone number of the contact person</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>notes</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">Additional notes for the purchase order</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>total_amount</code>
                      </td>
                      <td className="border p-2">number</td>
                      <td className="border p-2">Total amount of the purchase order</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>items</code>
                      </td>
                      <td className="border p-2">array</td>
                      <td className="border p-2">Array of purchase order items</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>created_at</code>
                      </td>
                      <td className="border p-2">string (ISO 8601)</td>
                      <td className="border p-2">Timestamp when the purchase order was created</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>updated_at</code>
                      </td>
                      <td className="border p-2">string (ISO 8601)</td>
                      <td className="border p-2">Timestamp when the purchase order was last updated</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>created_by</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">ID of the user who created the purchase order</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>approved_by</code>
                      </td>
                      <td className="border p-2">string | null</td>
                      <td className="border p-2">ID of the user who approved the purchase order</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>approved_at</code>
                      </td>
                      <td className="border p-2">string (ISO 8601) | null</td>
                      <td className="border p-2">Timestamp when the purchase order was approved</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Purchase Order Item Model */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Purchase Order Item</h4>
                <p>Represents an item in a purchase order.</p>

                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Field</th>
                      <th className="border p-2 text-left">Type</th>
                      <th className="border p-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">
                        <code>id</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">Unique identifier for the purchase order item</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>product_id</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">ID of the product</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>product_name</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">Name of the product</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>sku</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">Stock Keeping Unit of the product</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>quantity</code>
                      </td>
                      <td className="border p-2">number</td>
                      <td className="border p-2">Quantity ordered</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>unit</code>
                      </td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">Unit of measurement (e.g., kg, liter, piece)</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>unit_price</code>
                      </td>
                      <td className="border p-2">number</td>
                      <td className="border p-2">Price per unit</td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <code>total_price</code>
                      </td>
                      <td className="border p-2">number</td>
                      <td className="border p-2">Total price for this item (quantity * unit_price)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Code Examples</h3>

              {/* JavaScript Example */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium">JavaScript</h4>
                <p>Example of creating and managing purchase orders using JavaScript.</p>

                <h5>Creating a Purchase Order</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`// Create a new purchase order
async function createPurchaseOrder() {
  const token = localStorage.getItem('auth_token');
  
  const purchaseOrderData = {
    vendor_id: "v-789012",
    expected_delivery_date: "2023-06-20T10:00:00Z",
    delivery_address: {
      street: "123 Warehouse Ave",
      city: "Stockton",
      state: "CA",
      postal_code: "95204",
      country: "USA"
    },
    contact_person: "John Manager",
    contact_email: "john@grocerystore.com",
    contact_phone": "+1-555-123-4567",
    notes": "Please deliver before 2 PM",
    items: [
      {
        product_id: "prod-555",
        quantity: 200,
        unit_price: 2.50
      },
      {
        product_id: "prod-556",
        quantity: 150,
        unit_price: 1.75
      }
    ]
  };

  try {
    const response = await fetch('/api/purchase-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      },
      body: JSON.stringify(purchaseOrderData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create purchase order');
    }
    
    const result = await response.json();
    console.log('Purchase order created:', result);
    return result;
  } catch (error) {
    console.error('Error creating purchase order:', error);
    throw error;
  }
}`}</code>
                </pre>

                <h5>Fetching Purchase Orders</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`// Fetch purchase orders with filtering
async function fetchPurchaseOrders(filters = {}) {
  const token = localStorage.getItem('auth_token');
  
  // Build query string from filters
  const queryParams = new URLSearchParams();
  
  if (filters.status) {
    queryParams.append('status', filters.status);
  }
  
  if (filters.vendor_id) {
    queryParams.append('vendor_id', filters.vendor_id);
  }
  
  if (filters.from_date) {
    queryParams.append('from_date', filters.from_date);
  }
  
  if (filters.to_date) {
    queryParams.append('to_date', filters.to_date);
  }
  
  if (filters.limit) {
    queryParams.append('limit', filters.limit);
  }
  
  if (filters.offset) {
    queryParams.append('offset', filters.offset);
  }
  
  const queryString = queryParams.toString();
  const url = \`/api/purchase-orders\${queryString ? \`?\${queryString}\` : ''}\`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': \`Bearer \${token}\`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch purchase orders');
    }
    
    const result = await response.json();
    console.log('Purchase orders:', result);
    return result;
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
}`}</code>
                </pre>

                <h5>Approving a Purchase Order</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`// Approve a purchase order
async function approvePurchaseOrder(purchaseOrderId) {
  const token = localStorage.getItem('auth_token');
  
  try {
    const response = await fetch(\`/api/purchase-orders/\${purchaseOrderId}/approve\`, {
      method: 'PATCH',
      headers: {
        'Authorization': \`Bearer \${token}\`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve purchase order');
    }
    
    const result = await response.json();
    console.log('Purchase order approved:', result);
    return result;
  } catch (error) {
    console.error('Error approving purchase order:', error);
    throw error;
  }
}`}</code>
                </pre>
              </div>

              {/* cURL Examples */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium">cURL</h4>
                <p>Examples of using cURL to interact with the Purchase Orders API.</p>

                <h5>List Purchase Orders</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`curl -X GET "https://api.grocerystore.com/api/purchase-orders?status=pending&limit=10" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`}</code>
                </pre>

                <h5>Create Purchase Order</h5>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`curl -X POST "https://api.grocerystore.com/api/purchase-orders" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "vendor_id": "v-789012",
    "expected_delivery_date": "2023-06-20T10:00:00Z",
    "delivery_address": {
      "street": "123 Warehouse Ave",
      "city": "Stockton",
      "state": "CA",
      "postal_code": "95204",
      "country": "USA"
    },
    "contact_person": "John Manager",
    "contact_email": "john@grocerystore.com",
    "contact_phone": "+1-555-123-4567",
    "notes": "Please deliver before 2 PM",
    "items": [
      {
        "product_id": "prod-555",
        "quantity": 200,
        "unit_price": 2.50
      },
      {
        "product_id": "prod-556",
        "quantity": 150,
        "unit_price": 1.75
      }
    ]
  }'`}</code>
                </pre>
              </div>
            </div>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Error Handling</h3>
              <p>
                The Purchase Orders API uses conventional HTTP response codes to indicate the success or failure of an
                API request. In general, codes in the 2xx range indicate success, codes in the 4xx range indicate an
                error that failed given the information provided, and codes in the 5xx range indicate an error with the
                server.
              </p>

              <h4 className="text-lg font-medium">HTTP Status Codes</h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">Code</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">200 - OK</td>
                    <td className="border p-2">The request was successful.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">201 - Created</td>
                    <td className="border p-2">The resource was successfully created.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">400 - Bad Request</td>
                    <td className="border p-2">The request was invalid or cannot be otherwise served.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">401 - Unauthorized</td>
                    <td className="border p-2">Authentication credentials were missing or incorrect.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">403 - Forbidden</td>
                    <td className="border p-2">
                      The request is understood, but it has been refused or access is not allowed.
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">404 - Not Found</td>
                    <td className="border p-2">The requested resource could not be found.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">409 - Conflict</td>
                    <td className="border p-2">
                      The request could not be completed due to a conflict with the current state of the resource.
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">422 - Unprocessable Entity</td>
                    <td className="border p-2">
                      The request was well-formed but was unable to be followed due to semantic errors.
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">429 - Too Many Requests</td>
                    <td className="border p-2">The user has sent too many requests in a given amount of time.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">500 - Internal Server Error</td>
                    <td className="border p-2">Something went wrong on the server.</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="text-lg font-medium">Error Response Format</h4>
              <p>When an error occurs, the API will return a JSON object with the following structure:</p>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
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

              <h4 className="text-lg font-medium">Common Error Codes</h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">Error Code</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">INVALID_REQUEST</td>
                    <td className="border p-2">The request body contains invalid data.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">VENDOR_NOT_FOUND</td>
                    <td className="border p-2">The specified vendor does not exist.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">PRODUCT_NOT_FOUND</td>
                    <td className="border p-2">One or more products in the order do not exist.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">PURCHASE_ORDER_NOT_FOUND</td>
                    <td className="border p-2">The specified purchase order does not exist.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">INVALID_STATUS_TRANSITION</td>
                    <td className="border p-2">The requested status change is not allowed.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">INSUFFICIENT_PERMISSIONS</td>
                    <td className="border p-2">The user does not have permission to perform this action.</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="text-lg font-medium">Example Error Response</h4>
              <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{`{
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Cannot approve a purchase order that is not in 'pending' status",
    "details": {
      "current_status": "cancelled",
      "requested_transition": "approve",
      "allowed_transitions": ["delete"]
    }
  }
}`}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
