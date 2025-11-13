import { CodeBlock } from "@/components/code-block"
import { DocPaper } from "@/components/doc-paper"

export default function CustomerOrdersApiDocs() {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <DocPaper>
        <h1 className="text-2xl font-bold mb-4">Customer Orders API</h1>
        <p className="mb-4">
          The Customer Orders API allows customers to manage their orders, including viewing order history, creating new
          orders, tracking existing orders, and canceling orders when necessary.
        </p>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Base URL</h2>
          <CodeBlock language="bash">https://api.groceryapp.com/api/customer/orders</CodeBlock>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Authentication</h2>
          <p>
            All endpoints require authentication using a JWT token in the Authorization header. The token must belong to
            the customer whose orders are being accessed.
          </p>
          <CodeBlock language="bash">Authorization: Bearer {"{your_jwt_token}"}</CodeBlock>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Rate Limiting</h2>
          <p>
            Requests are limited to 100 requests per minute per user. If you exceed this limit, you will receive a 429
            Too Many Requests response.
          </p>
        </div>
      </DocPaper>

      {/* Endpoints Section */}
      <DocPaper>
        <h2 className="text-2xl font-bold mb-4">Endpoints</h2>

        {/* List Customer Orders */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">List Customer Orders</h3>
          <CodeBlock language="http">GET /api/customer/orders</CodeBlock>

          <h4 className="font-semibold mt-4 mb-2">Query Parameters</h4>
          <table className="min-w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">page</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Page number (default: 1)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">limit</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Number of orders per page (default: 10, max: 50)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">status</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">
                  Filter by order status (pending, processing, shipped, delivered, canceled)
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">sort</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">
                  Sort orders by (created_at, total_amount) (default: created_at)
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">order</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Sort direction (asc, desc) (default: desc)</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-semibold mt-4 mb-2">Response</h4>
          <CodeBlock language="json">
            {`{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ord_12345",
        "order_number": "GRO-12345",
        "status": "delivered",
        "created_at": "2023-06-15T10:30:00Z",
        "updated_at": "2023-06-15T16:45:00Z",
        "total_amount": 78.50,
        "items_count": 12,
        "delivery_address": {
          "street": "123 Main St",
          "city": "Springfield",
          "state": "IL",
          "postal_code": "62704",
          "country": "USA"
        },
        "delivery_date": "2023-06-16T14:00:00Z"
      },
      {
        "id": "ord_12346",
        "order_number": "GRO-12346",
        "status": "processing",
        "created_at": "2023-06-18T09:15:00Z",
        "updated_at": "2023-06-18T09:30:00Z",
        "total_amount": 45.75,
        "items_count": 8,
        "delivery_address": {
          "street": "123 Main St",
          "city": "Springfield",
          "state": "IL",
          "postal_code": "62704",
          "country": "USA"
        },
        "delivery_date": "2023-06-19T14:00:00Z"
      }
    ],
    "pagination": {
      "total": 24,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}`}
          </CodeBlock>
        </div>

        {/* Get Customer Order by ID */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Get Customer Order by ID</h3>
          <CodeBlock language="http">GET /api/customer/orders/{"{order_id}"}</CodeBlock>

          <h4 className="font-semibold mt-4 mb-2">Path Parameters</h4>
          <table className="min-w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">order_id</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Unique identifier of the order</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-semibold mt-4 mb-2">Response</h4>
          <CodeBlock language="json">
            {`{
  "success": true,
  "data": {
    "id": "ord_12345",
    "order_number": "GRO-12345",
    "status": "delivered",
    "created_at": "2023-06-15T10:30:00Z",
    "updated_at": "2023-06-15T16:45:00Z",
    "total_amount": 78.50,
    "subtotal": 72.00,
    "tax": 6.50,
    "delivery_fee": 0.00,
    "discount": 0.00,
    "payment_method": "credit_card",
    "payment_status": "paid",
    "items": [
      {
        "id": "item_1",
        "product_id": "prod_5678",
        "product_name": "Organic Bananas",
        "quantity": 2,
        "unit_price": 3.50,
        "total_price": 7.00,
        "image_url": "https://example.com/images/organic-bananas.jpg"
      },
      {
        "id": "item_2",
        "product_id": "prod_5679",
        "product_name": "Whole Milk",
        "quantity": 1,
        "unit_price": 4.25,
        "total_price": 4.25,
        "image_url": "https://example.com/images/whole-milk.jpg"
      }
    ],
    "delivery_address": {
      "street": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "postal_code": "62704",
      "country": "USA"
    },
    "delivery_date": "2023-06-16T14:00:00Z",
    "delivery_notes": "Please leave at the front door",
    "tracking_info": {
      "tracking_number": "TRACK123456",
      "carrier": "Local Delivery",
      "estimated_delivery": "2023-06-16T14:00:00Z",
      "tracking_url": "https://tracking.groceryapp.com/TRACK123456"
    }
  }
}`}
          </CodeBlock>
        </div>

        {/* Create Customer Order */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Create Customer Order</h3>
          <CodeBlock language="http">POST /api/customer/orders</CodeBlock>

          <h4 className="font-semibold mt-4 mb-2">Request Body</h4>
          <CodeBlock language="json">
            {`{
  "items": [
    {
      "product_id": "prod_5678",
      "quantity": 2
    },
    {
      "product_id": "prod_5679",
      "quantity": 1
    }
  ],
  "delivery_address_id": "addr_123",
  "payment_method_id": "pm_456",
  "delivery_notes": "Please leave at the front door",
  "coupon_code": "SUMMER10",
  "scheduled_delivery": "2023-06-16T14:00:00Z"
}`}
          </CodeBlock>

          <h4 className="font-semibold mt-4 mb-2">Response</h4>
          <CodeBlock language="json">
            {`{
  "success": true,
  "data": {
    "id": "ord_12347",
    "order_number": "GRO-12347",
    "status": "pending",
    "created_at": "2023-06-19T10:30:00Z",
    "total_amount": 11.25,
    "subtotal": 11.25,
    "tax": 1.01,
    "delivery_fee": 0.00,
    "discount": 1.01,
    "payment_method": "credit_card",
    "payment_status": "pending",
    "estimated_delivery": "2023-06-20T14:00:00Z",
    "tracking_info": {
      "tracking_number": "TRACK123457",
      "carrier": "Local Delivery",
      "tracking_url": "https://tracking.groceryapp.com/TRACK123457"
    }
  }
}`}
          </CodeBlock>
        </div>

        {/* Cancel Customer Order */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Cancel Customer Order</h3>
          <CodeBlock language="http">PATCH /api/customer/orders/{"{order_id}"}/cancel</CodeBlock>

          <h4 className="font-semibold mt-4 mb-2">Path Parameters</h4>
          <table className="min-w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">order_id</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Unique identifier of the order</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-semibold mt-4 mb-2">Request Body</h4>
          <CodeBlock language="json">
            {`{
  "reason": "Changed my mind",
  "request_refund": true
}`}
          </CodeBlock>

          <h4 className="font-semibold mt-4 mb-2">Response</h4>
          <CodeBlock language="json">
            {`{
  "success": true,
  "data": {
    "id": "ord_12347",
    "status": "canceled",
    "updated_at": "2023-06-19T11:15:00Z",
    "refund_status": "processing",
    "refund_amount": 11.25,
    "cancellation_reason": "Changed my mind"
  }
}`}
          </CodeBlock>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              <strong>Note:</strong> Orders can only be canceled if they are in the "pending" or "processing" status.
              Orders that have already been shipped cannot be canceled through this endpoint.
            </p>
          </div>
        </div>

        {/* Track Customer Order */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Track Customer Order</h3>
          <CodeBlock language="http">GET /api/customer/orders/{"{order_id}"}/tracking</CodeBlock>

          <h4 className="font-semibold mt-4 mb-2">Path Parameters</h4>
          <table className="min-w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">order_id</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Unique identifier of the order</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-semibold mt-4 mb-2">Response</h4>
          <CodeBlock language="json">
            {`{
  "success": true,
  "data": {
    "order_id": "ord_12345",
    "order_number": "GRO-12345",
    "status": "shipped",
    "tracking_number": "TRACK123456",
    "carrier": "Local Delivery",
    "estimated_delivery": "2023-06-16T14:00:00Z",
    "tracking_url": "https://tracking.groceryapp.com/TRACK123456",
    "current_location": "Local Distribution Center",
    "tracking_history": [
      {
        "status": "order_placed",
        "timestamp": "2023-06-15T10:30:00Z",
        "description": "Order has been placed"
      },
      {
        "status": "processing",
        "timestamp": "2023-06-15T11:00:00Z",
        "description": "Order is being processed"
      },
      {
        "status": "packed",
        "timestamp": "2023-06-15T13:45:00Z",
        "description": "Order has been packed"
      },
      {
        "status": "shipped",
        "timestamp": "2023-06-15T14:30:00Z",
        "description": "Order has been shipped"
      }
    ]
  }
}`}
          </CodeBlock>
        </div>

        {/* Get Customer Order History */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Get Customer Order History</h3>
          <CodeBlock language="http">GET /api/customer/orders/history</CodeBlock>

          <h4 className="font-semibold mt-4 mb-2">Query Parameters</h4>
          <table className="min-w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">page</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Page number (default: 1)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">limit</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Number of orders per page (default: 10, max: 50)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">from_date</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Filter orders from this date (ISO format)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">to_date</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Filter orders until this date (ISO format)</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-semibold mt-4 mb-2">Response</h4>
          <CodeBlock language="json">
            {`{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ord_12345",
        "order_number": "GRO-12345",
        "status": "delivered",
        "created_at": "2023-06-15T10:30:00Z",
        "total_amount": 78.50,
        "items_count": 12,
        "delivery_date": "2023-06-16T14:00:00Z"
      },
      {
        "id": "ord_12340",
        "order_number": "GRO-12340",
        "status": "delivered",
        "created_at": "2023-06-10T09:15:00Z",
        "total_amount": 45.75,
        "items_count": 8,
        "delivery_date": "2023-06-11T13:30:00Z"
      }
    ],
    "statistics": {
      "total_orders": 24,
      "total_spent": 1245.75,
      "average_order_value": 51.91,
      "most_ordered_product": "Organic Bananas"
    },
    "pagination": {
      "total": 24,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}`}
          </CodeBlock>
        </div>

        {/* Reorder Previous Order */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Reorder Previous Order</h3>
          <CodeBlock language="http">POST /api/customer/orders/reorder/{"{order_id}"}</CodeBlock>

          <h4 className="font-semibold mt-4 mb-2">Path Parameters</h4>
          <table className="min-w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">order_id</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Unique identifier of the previous order</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-semibold mt-4 mb-2">Request Body (Optional)</h4>
          <CodeBlock language="json">
            {`{
  "delivery_address_id": "addr_124",
  "payment_method_id": "pm_456",
  "delivery_notes": "Please ring the doorbell",
  "scheduled_delivery": "2023-06-20T16:00:00Z",
  "exclude_items": ["item_2"],
  "modify_quantities": {
    "item_1": 3
  }
}`}
          </CodeBlock>

          <h4 className="font-semibold mt-4 mb-2">Response</h4>
          <CodeBlock language="json">
            {`{
  "success": true,
  "data": {
    "id": "ord_12348",
    "order_number": "GRO-12348",
    "status": "pending",
    "created_at": "2023-06-19T14:30:00Z",
    "total_amount": 10.50,
    "subtotal": 10.50,
    "tax": 0.95,
    "delivery_fee": 0.00,
    "discount": 0.00,
    "payment_method": "credit_card",
    "payment_status": "pending",
    "estimated_delivery": "2023-06-20T16:00:00Z",
    "items": [
      {
        "id": "item_3",
        "product_id": "prod_5678",
        "product_name": "Organic Bananas",
        "quantity": 3,
        "unit_price": 3.50,
        "total_price": 10.50,
        "image_url": "https://example.com/images/organic-bananas.jpg"
      }
    ],
    "reordered_from": "ord_12345"
  }
}`}
          </CodeBlock>
        </div>
      </DocPaper>

      {/* Models Section */}
      <DocPaper>
        <h2 className="text-2xl font-bold mb-4">Models</h2>

        {/* Customer Order Model */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Customer Order</h3>
          <table className="min-w-full border-collapse mb-4">
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
                <td className="border border-gray-300 px-4 py-2">Unique identifier for the order</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">order_number</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Human-readable order number</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">user_id</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">ID of the customer who placed the order</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">status</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">
                  Order status (pending, processing, shipped, delivered, canceled)
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">created_at</td>
                <td className="border border-gray-300 px-4 py-2">string (ISO date)</td>
                <td className="border border-gray-300 px-4 py-2">Date and time when the order was created</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">updated_at</td>
                <td className="border border-gray-300 px-4 py-2">string (ISO date)</td>
                <td className="border border-gray-300 px-4 py-2">Date and time when the order was last updated</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">total_amount</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Total order amount including tax and fees</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">subtotal</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Order subtotal before tax and fees</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">tax</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Tax amount</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">delivery_fee</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Delivery fee</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">discount</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Discount amount</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">items</td>
                <td className="border border-gray-300 px-4 py-2">array</td>
                <td className="border border-gray-300 px-4 py-2">Array of order items</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">items_count</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Total number of items in the order</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">delivery_address</td>
                <td className="border border-gray-300 px-4 py-2">object</td>
                <td className="border border-gray-300 px-4 py-2">Delivery address details</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">delivery_date</td>
                <td className="border border-gray-300 px-4 py-2">string (ISO date)</td>
                <td className="border border-gray-300 px-4 py-2">Scheduled or actual delivery date and time</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">delivery_notes</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Special instructions for delivery</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">payment_method</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">
                  Payment method used (credit_card, debit_card, wallet, etc.)
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">payment_status</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Payment status (pending, paid, failed, refunded)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">tracking_info</td>
                <td className="border border-gray-300 px-4 py-2">object</td>
                <td className="border border-gray-300 px-4 py-2">Order tracking information</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Order Item Model */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Order Item</h3>
          <table className="min-w-full border-collapse mb-4">
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
                <td className="border border-gray-300 px-4 py-2">Unique identifier for the order item</td>
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
                <td className="border border-gray-300 px-4 py-2">quantity</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Quantity ordered</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">unit_price</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Price per unit</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">total_price</td>
                <td className="border border-gray-300 px-4 py-2">number</td>
                <td className="border border-gray-300 px-4 py-2">Total price for this item (quantity * unit_price)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">image_url</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">URL to the product image</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Order Tracking Model */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Order Tracking</h3>
          <table className="min-w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Field</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">tracking_number</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Tracking number for the order</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">carrier</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Delivery carrier name</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">estimated_delivery</td>
                <td className="border border-gray-300 px-4 py-2">string (ISO date)</td>
                <td className="border border-gray-300 px-4 py-2">Estimated delivery date and time</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">tracking_url</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">URL to track the order</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">current_location</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">Current location of the order</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">tracking_history</td>
                <td className="border border-gray-300 px-4 py-2">array</td>
                <td className="border border-gray-300 px-4 py-2">Array of tracking history events</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Order Status Values */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Order Status Values</h3>
          <table className="min-w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">pending</td>
                <td className="border border-gray-300 px-4 py-2">Order has been placed but not yet processed</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">processing</td>
                <td className="border border-gray-300 px-4 py-2">Order is being processed (items being picked)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">packed</td>
                <td className="border border-gray-300 px-4 py-2">Order has been packed and is ready for shipping</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">shipped</td>
                <td className="border border-gray-300 px-4 py-2">Order has been shipped and is in transit</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">delivered</td>
                <td className="border border-gray-300 px-4 py-2">Order has been delivered to the customer</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">canceled</td>
                <td className="border border-gray-300 px-4 py-2">Order has been canceled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocPaper>

      {/* Examples Section */}
      <DocPaper>
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        {/* JavaScript Example */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">JavaScript Example</h3>
          <CodeBlock language="javascript">
            {`// Get customer orders
async function getCustomerOrders() {
  try {
    const response = await fetch('https://api.groceryapp.com/api/customer/orders', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch orders');
    }
    
    return data.data.orders;
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
}

// Create a new order
async function createOrder(orderData) {
  try {
    const response = await fetch('https://api.groceryapp.com/api/customer/orders', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create order');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Track an order
async function trackOrder(orderId) {
  try {
    const response = await fetch(\`https://api.groceryapp.com/api/customer/orders/\${orderId}/tracking\`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to track order');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error tracking order:', error);
    throw error;
  }
}

// Cancel an order
async function cancelOrder(orderId, reason) {
  try {
    const response = await fetch(\`https://api.groceryapp.com/api/customer/orders/\${orderId}/cancel\`, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason,
        request_refund: true
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to cancel order');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error canceling order:', error);
    throw error;
  }
}`}
          </CodeBlock>
        </div>

        {/* cURL Example */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">cURL Example</h3>
          <CodeBlock language="bash">
            {`# Get customer orders
curl -X GET \\
  'https://api.groceryapp.com/api/customer/orders?page=1&limit=10' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json'

# Get a specific order
curl -X GET \\
  'https://api.groceryapp.com/api/customer/orders/ord_12345' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json'

# Create a new order
curl -X POST \\
  'https://api.groceryapp.com/api/customer/orders' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "items": [
      {
        "product_id": "prod_5678",
        "quantity": 2
      },
      {
        "product_id": "prod_5679",
        "quantity": 1
      }
    ],
    "delivery_address_id": "addr_123",
    "payment_method_id": "pm_456",
    "delivery_notes": "Please leave at the front door",
    "scheduled_delivery": "2023-06-16T14:00:00Z"
  }'

# Cancel an order
curl -X PATCH \\
  'https://api.groceryapp.com/api/customer/orders/ord_12347/cancel' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "reason": "Changed my mind",
    "request_refund": true
  }'

# Track an order
curl -X GET \\
  'https://api.groceryapp.com/api/customer/orders/ord_12345/tracking' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json'`}
          </CodeBlock>
        </div>
      </DocPaper>

      {/* Errors Section */}
      <DocPaper>
        <h2 className="text-2xl font-bold mb-4">Errors</h2>

        <p className="mb-4">
          The Customer Orders API uses conventional HTTP response codes to indicate the success or failure of an API
          request. In general, codes in the 2xx range indicate success, codes in the 4xx range indicate an error that
          failed given the information provided, and codes in the 5xx range indicate an error with the server.
        </p>

        <table className="min-w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Error Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">400</td>
              <td className="border border-gray-300 px-4 py-2">
                Bad Request - The request was unacceptable, often due to missing a required parameter.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">401</td>
              <td className="border border-gray-300 px-4 py-2">
                Unauthorized - No valid API key provided or invalid JWT token.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">403</td>
              <td className="border border-gray-300 px-4 py-2">
                Forbidden - The API key doesn't have permissions to perform the request.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">404</td>
              <td className="border border-gray-300 px-4 py-2">Not Found - The requested resource doesn't exist.</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">409</td>
              <td className="border border-gray-300 px-4 py-2">
                Conflict - The request conflicts with another request or with the current state of the resource.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">422</td>
              <td className="border border-gray-300 px-4 py-2">
                Unprocessable Entity - The request was well-formed but was unable to be followed due to semantic errors.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">429</td>
              <td className="border border-gray-300 px-4 py-2">
                Too Many Requests - Too many requests hit the API too quickly.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">500</td>
              <td className="border border-gray-300 px-4 py-2">Server Error - Something went wrong on the server.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold mb-2">Error Response Format</h3>
        <CodeBlock language="json">
          {`{
  "success": false,
  "error": {
    "code": "order_not_found",
    "message": "The requested order could not be found.",
    "status": 404,
    "details": {
      "order_id": "ord_invalid"
    }
  }
}`}
        </CodeBlock>

        <h3 className="text-xl font-semibold mt-6 mb-2">Common Error Codes</h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Error Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">order_not_found</td>
              <td className="border border-gray-300 px-4 py-2">The requested order could not be found.</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">invalid_order_status</td>
              <td className="border border-gray-300 px-4 py-2">
                The order status is invalid or cannot be changed to the requested status.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">order_already_canceled</td>
              <td className="border border-gray-300 px-4 py-2">The order has already been canceled.</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">order_cannot_be_canceled</td>
              <td className="border border-gray-300 px-4 py-2">
                The order cannot be canceled (e.g., already shipped or delivered).
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">invalid_product</td>
              <td className="border border-gray-300 px-4 py-2">
                One or more products in the order are invalid or unavailable.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">insufficient_stock</td>
              <td className="border border-gray-300 px-4 py-2">
                One or more products in the order have insufficient stock.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">invalid_address</td>
              <td className="border border-gray-300 px-4 py-2">The delivery address is invalid or does not exist.</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">invalid_payment_method</td>
              <td className="border border-gray-300 px-4 py-2">The payment method is invalid or does not exist.</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">payment_failed</td>
              <td className="border border-gray-300 px-4 py-2">The payment for the order failed.</td>
            </tr>
          </tbody>
        </table>
      </DocPaper>
    </div>
  )
}
