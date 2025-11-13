import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OrdersApiDocs() {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-4">Orders API</h2>

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
              <h3 className="text-xl font-semibold">Orders API Overview</h3>
              <p>
                The Orders API allows you to manage customer orders in the grocery management system. You can create,
                retrieve, update, and manage the lifecycle of orders through various endpoints.
              </p>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">Base URL</h4>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`https://api.grocerymanagement.com/api/orders`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">Authentication</h4>
                <p>All endpoints require authentication using a Bearer token in the Authorization header.</p>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`Authorization: Bearer YOUR_API_TOKEN`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">Rate Limiting</h4>
                <p>
                  API requests are limited to 100 requests per minute per API token. If you exceed this limit, you will
                  receive a 429 Too Many Requests response.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Orders API Endpoints</h3>

              {/* List Orders */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">List Orders</h4>
                <p>Retrieves a list of orders with optional filtering and pagination.</p>

                <div className="space-y-2">
                  <h5 className="font-medium">Request</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`GET /api/orders`}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Query Parameters</h5>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <code>status</code> - Filter by order status (pending, processing, completed, cancelled)
                    </li>
                    <li>
                      <code>customer_id</code> - Filter by customer ID
                    </li>
                    <li>
                      <code>from_date</code> - Filter orders created after this date (ISO format)
                    </li>
                    <li>
                      <code>to_date</code> - Filter orders created before this date (ISO format)
                    </li>
                    <li>
                      <code>page</code> - Page number for pagination (default: 1)
                    </li>
                    <li>
                      <code>limit</code> - Number of results per page (default: 20, max: 100)
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Response</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "data": [
    {
      "id": "ord_123456",
      "customer_id": "cus_789012",
      "status": "processing",
      "total_amount": 125.50,
      "items_count": 8,
      "payment_status": "paid",
      "created_at": "2023-06-15T10:30:00Z",
      "updated_at": "2023-06-15T10:35:00Z"
    },
    {
      "id": "ord_123457",
      "customer_id": "cus_789012",
      "status": "pending",
      "total_amount": 75.25,
      "items_count": 5,
      "payment_status": "pending",
      "created_at": "2023-06-14T14:20:00Z",
      "updated_at": "2023-06-14T14:20:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Get Order by ID */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Get Order by ID</h4>
                <p>Retrieves detailed information about a specific order.</p>

                <div className="space-y-2">
                  <h5 className="font-medium">Request</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`GET /api/orders/{order_id}`}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Path Parameters</h5>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <code>order_id</code> - The unique identifier of the order
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Response</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "data": {
    "id": "ord_123456",
    "customer_id": "cus_789012",
    "customer": {
      "id": "cus_789012",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890"
    },
    "status": "processing",
    "total_amount": 125.50,
    "subtotal": 115.50,
    "tax": 10.00,
    "discount": 0,
    "payment_status": "paid",
    "payment_method": "credit_card",
    "shipping_address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "postal_code": "12345",
      "country": "USA"
    },
    "items": [
      {
        "id": "oi_123",
        "product_id": "prod_456",
        "product_name": "Organic Apples",
        "quantity": 5,
        "unit_price": 1.50,
        "total_price": 7.50
      },
      {
        "id": "oi_124",
        "product_id": "prod_789",
        "product_name": "Whole Grain Bread",
        "quantity": 2,
        "unit_price": 4.00,
        "total_price": 8.00
      }
    ],
    "notes": "Please leave at the front door",
    "created_at": "2023-06-15T10:30:00Z",
    "updated_at": "2023-06-15T10:35:00Z"
  }
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Create Order */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Create Order</h4>
                <p>Creates a new order in the system.</p>

                <div className="space-y-2">
                  <h5 className="font-medium">Request</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`POST /api/orders`}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Request Body</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "customer_id": "cus_789012",
  "items": [
    {
      "product_id": "prod_456",
      "quantity": 5
    },
    {
      "product_id": "prod_789",
      "quantity": 2
    }
  ],
  "shipping_address_id": "addr_123",
  "payment_method": "credit_card",
  "notes": "Please leave at the front door"
}`}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Response</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "data": {
    "id": "ord_123456",
    "customer_id": "cus_789012",
    "status": "pending",
    "total_amount": 125.50,
    "subtotal": 115.50,
    "tax": 10.00,
    "discount": 0,
    "payment_status": "pending",
    "payment_method": "credit_card",
    "items": [
      {
        "id": "oi_123",
        "product_id": "prod_456",
        "product_name": "Organic Apples",
        "quantity": 5,
        "unit_price": 1.50,
        "total_price": 7.50
      },
      {
        "id": "oi_124",
        "product_id": "prod_789",
        "product_name": "Whole Grain Bread",
        "quantity": 2,
        "unit_price": 4.00,
        "total_price": 8.00
      }
    ],
    "notes": "Please leave at the front door",
    "created_at": "2023-06-15T10:30:00Z",
    "updated_at": "2023-06-15T10:30:00Z"
  }
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Update Order */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Update Order</h4>
                <p>Updates an existing order. Only certain fields can be updated depending on the order status.</p>

                <div className="space-y-2">
                  <h5 className="font-medium">Request</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`PUT /api/orders/{order_id}`}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Path Parameters</h5>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <code>order_id</code> - The unique identifier of the order
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Request Body</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "shipping_address_id": "addr_456",
  "notes": "Updated delivery instructions: Please ring the doorbell"
}`}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Response</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "data": {
    "id": "ord_123456",
    "customer_id": "cus_789012",
    "status": "pending",
    "total_amount": 125.50,
    "shipping_address_id": "addr_456",
    "notes": "Updated delivery instructions: Please ring the doorbell",
    "updated_at": "2023-06-15T11:30:00Z"
  }
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Cancel Order */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Cancel Order</h4>
                <p>Cancels an existing order. Only orders in 'pending' or 'processing' status can be cancelled.</p>

                <div className="space-y-2">
                  <h5 className="font-medium">Request</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`PATCH /api/orders/{order_id}/cancel`}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Path Parameters</h5>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <code>order_id</code> - The unique identifier of the order
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Request Body</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "cancellation_reason": "Customer requested cancellation",
  "refund_requested": true
}`}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Response</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "data": {
    "id": "ord_123456",
    "status": "cancelled",
    "cancellation_reason": "Customer requested cancellation",
    "refund_requested": true,
    "cancelled_at": "2023-06-15T12:30:00Z",
    "updated_at": "2023-06-15T12:30:00Z"
  }
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Complete Order */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Complete Order</h4>
                <p>Marks an order as completed. Only orders in 'processing' status can be completed.</p>

                <div className="space-y-2">
                  <h5 className="font-medium">Request</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`PATCH /api/orders/{order_id}/complete`}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Path Parameters</h5>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <code>order_id</code> - The unique identifier of the order
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Response</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "data": {
    "id": "ord_123456",
    "status": "completed",
    "completed_at": "2023-06-15T14:30:00Z",
    "updated_at": "2023-06-15T14:30:00Z"
  }
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Get Order Items */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Get Order Items</h4>
                <p>Retrieves all items in a specific order.</p>

                <div className="space-y-2">
                  <h5 className="font-medium">Request</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`GET /api/orders/{order_id}/items`}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Path Parameters</h5>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <code>order_id</code> - The unique identifier of the order
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Response</h5>
                  <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "data": [
    {
      "id": "oi_123",
      "order_id": "ord_123456",
      "product_id": "prod_456",
      "product_name": "Organic Apples",
      "product_sku": "APL-ORG-001",
      "quantity": 5,
      "unit_price": 1.50,
      "total_price": 7.50,
      "discount": 0,
      "tax": 0.75,
      "created_at": "2023-06-15T10:30:00Z"
    },
    {
      "id": "oi_124",
      "order_id": "ord_123456",
      "product_id": "prod_789",
      "product_name": "Whole Grain Bread",
      "product_sku": "BRD-WHG-002",
      "quantity": 2,
      "unit_price": 4.00,
      "total_price": 8.00,
      "discount": 0,
      "tax": 0.80,
      "created_at": "2023-06-15T10:30:00Z"
    }
  ]
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Orders API Models</h3>

              {/* Order Model */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Order Model</h4>
                <p>The Order model represents a customer order in the system.</p>

                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-300 px-4 py-2 text-left">Field</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">id</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">Unique identifier for the order</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">customer_id</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">ID of the customer who placed the order</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">status</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Order status (pending, processing, completed, cancelled)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">total_amount</td>
                      <td className="border border-gray-300 px-4 py-2">number</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Total order amount including tax and discounts
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">subtotal</td>
                      <td className="border border-gray-300 px-4 py-2">number</td>
                      <td className="border border-gray-300 px-4 py-2">Order subtotal before tax and discounts</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">tax</td>
                      <td className="border border-gray-300 px-4 py-2">number</td>
                      <td className="border border-gray-300 px-4 py-2">Tax amount applied to the order</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">discount</td>
                      <td className="border border-gray-300 px-4 py-2">number</td>
                      <td className="border border-gray-300 px-4 py-2">Discount amount applied to the order</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">payment_status</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Payment status (pending, paid, failed, refunded)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">payment_method</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Payment method used (credit_card, cash, bank_transfer)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">shipping_address_id</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">ID of the shipping address</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">shipping_address</td>
                      <td className="border border-gray-300 px-4 py-2">object</td>
                      <td className="border border-gray-300 px-4 py-2">Shipping address details</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">items</td>
                      <td className="border border-gray-300 px-4 py-2">array</td>
                      <td className="border border-gray-300 px-4 py-2">Array of order items</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">notes</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">Additional notes for the order</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">created_at</td>
                      <td className="border border-gray-300 px-4 py-2">string (ISO date)</td>
                      <td className="border border-gray-300 px-4 py-2">Timestamp when the order was created</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">updated_at</td>
                      <td className="border border-gray-300 px-4 py-2">string (ISO date)</td>
                      <td className="border border-gray-300 px-4 py-2">Timestamp when the order was last updated</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">completed_at</td>
                      <td className="border border-gray-300 px-4 py-2">string (ISO date)</td>
                      <td className="border border-gray-300 px-4 py-2">Timestamp when the order was completed</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">cancelled_at</td>
                      <td className="border border-gray-300 px-4 py-2">string (ISO date)</td>
                      <td className="border border-gray-300 px-4 py-2">Timestamp when the order was cancelled</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Order Item Model */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Order Item Model</h4>
                <p>The Order Item model represents an individual item within an order.</p>

                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-300 px-4 py-2 text-left">Field</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">id</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">Unique identifier for the order item</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">order_id</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">ID of the parent order</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">product_id</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">ID of the product</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">product_name</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">Name of the product</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">product_sku</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">SKU of the product</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">quantity</td>
                      <td className="border border-gray-300 px-4 py-2">number</td>
                      <td className="border border-gray-300 px-4 py-2">Quantity of the product ordered</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">unit_price</td>
                      <td className="border border-gray-300 px-4 py-2">number</td>
                      <td className="border border-gray-300 px-4 py-2">Price per unit of the product</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">total_price</td>
                      <td className="border border-gray-300 px-4 py-2">number</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Total price for this item (quantity × unit_price)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">discount</td>
                      <td className="border border-gray-300 px-4 py-2">number</td>
                      <td className="border border-gray-300 px-4 py-2">Discount amount applied to this item</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">tax</td>
                      <td className="border border-gray-300 px-4 py-2">number</td>
                      <td className="border border-gray-300 px-4 py-2">Tax amount applied to this item</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">created_at</td>
                      <td className="border border-gray-300 px-4 py-2">string (ISO date)</td>
                      <td className="border border-gray-300 px-4 py-2">Timestamp when the order item was created</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Orders API Examples</h3>

              {/* JavaScript Example */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">JavaScript Example</h4>
                <p>Here's how to interact with the Orders API using JavaScript:</p>

                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`// Get all orders
async function getOrders() {
  try {
    const response = await fetch('https://api.grocerymanagement.com/api/orders', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

// Create a new order
async function createOrder(orderData) {
  try {
    const response = await fetch('https://api.grocerymanagement.com/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Cancel an order
async function cancelOrder(orderId, cancellationReason) {
  try {
    const response = await fetch(\`https://api.grocerymanagement.com/api/orders/\${orderId}/cancel\`, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cancellation_reason: cancellationReason,
        refund_requested: true
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to cancel order');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
}`}</code>
                </pre>
              </div>

              {/* cURL Example */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">cURL Example</h4>
                <p>Here's how to interact with the Orders API using cURL:</p>

                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`# Get all orders
curl -X GET \\
  https://api.grocerymanagement.com/api/orders \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json'

# Get a specific order
curl -X GET \\
  https://api.grocerymanagement.com/api/orders/ord_123456 \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json'

# Create a new order
curl -X POST \\
  https://api.grocerymanagement.com/api/orders \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "customer_id": "cus_789012",
    "items": [
      {
        "product_id": "prod_456",
        "quantity": 5
      },
      {
        "product_id": "prod_789",
        "quantity": 2
      }
    ],
    "shipping_address_id": "addr_123",
    "payment_method": "credit_card",
    "notes": "Please leave at the front door"
  }'

# Cancel an order
curl -X PATCH \\
  https://api.grocerymanagement.com/api/orders/ord_123456/cancel \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "cancellation_reason": "Customer requested cancellation",
    "refund_requested": true
  }'`}</code>
                </pre>
              </div>
            </div>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Orders API Error Handling</h3>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">HTTP Status Codes</h4>
                <p>The Orders API uses standard HTTP status codes to indicate the success or failure of requests:</p>

                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
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

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Error Response Format</h4>
                <p>When an error occurs, the API returns a JSON object with the following structure:</p>

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
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Common Error Codes</h4>
                <p>The Orders API uses the following error codes:</p>

                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-300 px-4 py-2 text-left">Error Code</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">ORDER_NOT_FOUND</td>
                      <td className="border border-gray-300 px-4 py-2">The specified order could not be found</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">INVALID_ORDER_STATUS</td>
                      <td className="border border-gray-300 px-4 py-2">
                        The order status is invalid for the requested operation
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">PRODUCT_NOT_AVAILABLE</td>
                      <td className="border border-gray-300 px-4 py-2">
                        One or more products in the order are not available
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">INSUFFICIENT_STOCK</td>
                      <td className="border border-gray-300 px-4 py-2">
                        There is insufficient stock for one or more products
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">INVALID_PAYMENT_METHOD</td>
                      <td className="border border-gray-300 px-4 py-2">The specified payment method is invalid</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">CUSTOMER_NOT_FOUND</td>
                      <td className="border border-gray-300 px-4 py-2">The specified customer could not be found</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">ADDRESS_NOT_FOUND</td>
                      <td className="border border-gray-300 px-4 py-2">
                        The specified shipping address could not be found
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">VALIDATION_ERROR</td>
                      <td className="border border-gray-300 px-4 py-2">The request contains invalid data</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Example Error Response</h4>
                <pre className="bg-slate-800 text-slate-50 p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "There is insufficient stock for one or more products",
    "details": {
      "products": [
        {
          "product_id": "prod_456",
          "product_name": "Organic Apples",
          "requested_quantity": 10,
          "available_quantity": 5
        }
      ]
    }
  }
}`}</code>
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
