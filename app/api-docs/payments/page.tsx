import type { Metadata } from "next"
import { CodeBlock } from "@/components/code-block"
import { DocPaper } from "@/components/doc-paper"

export const metadata: Metadata = {
  title: "Payments API Documentation",
  description: "API documentation for managing payments in the grocery management system",
}

export default function PaymentsApiDocs() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payments API</h1>

      {/* Overview Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The Payments API allows you to process payments, manage payment methods, and retrieve transaction history in
          the grocery management system. It provides secure endpoints for handling financial transactions.
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

        {/* Process Payment */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Process Payment</h3>
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              POST
            </span>
            <code className="font-mono">/api/payments</code>
          </div>
          <p className="mb-3">Processes a payment for an order.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Request Body</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "order_id": "ord_67890",
  "payment_method_id": "pm_12345",
  "amount": 89.97,
  "currency": "USD",
  "description": "Payment for grocery order #67890"
}`}
            </CodeBlock>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Response</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "id": "pay_12345",
  "order_id": "ord_67890",
  "amount": 89.97,
  "currency": "USD",
  "status": "succeeded",
  "payment_method": {
    "id": "pm_12345",
    "type": "credit_card",
    "last4": "4242",
    "brand": "visa"
  },
  "created_at": "2023-09-15T14:30:00Z"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get Payment by ID */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get Payment by ID</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              GET
            </span>
            <code className="font-mono">/api/payments/{"{payment_id}"}</code>
          </div>
          <p className="mb-3">Retrieves detailed information about a specific payment.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Path Parameters</h4>
            <ul className="list-disc pl-5">
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">payment_id</code> - The ID of the payment
              </li>
            </ul>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Response</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "id": "pay_12345",
  "order_id": "ord_67890",
  "user_id": "usr_54321",
  "amount": 89.97,
  "currency": "USD",
  "status": "succeeded",
  "payment_method": {
    "id": "pm_12345",
    "type": "credit_card",
    "last4": "4242",
    "brand": "visa",
    "exp_month": 12,
    "exp_year": 2025
  },
  "receipt_url": "https://api.grocerymanagement.com/receipts/pay_12345",
  "description": "Payment for grocery order #67890",
  "created_at": "2023-09-15T14:30:00Z",
  "updated_at": "2023-09-15T14:30:00Z"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* List User Payments */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">List User Payments</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              GET
            </span>
            <code className="font-mono">/api/payments</code>
          </div>
          <p className="mb-3">Retrieves a list of payments for the authenticated user.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Query Parameters</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">status</code> - Filter by payment status (succeeded,
                pending, failed)
              </li>
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">order_id</code> - Filter by order ID
              </li>
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">from_date</code> - Filter payments created after this
                date (ISO format)
              </li>
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">to_date</code> - Filter payments created before this
                date (ISO format)
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
      "id": "pay_12345",
      "order_id": "ord_67890",
      "amount": 89.97,
      "currency": "USD",
      "status": "succeeded",
      "payment_method": {
        "id": "pm_12345",
        "type": "credit_card",
        "last4": "4242",
        "brand": "visa"
      },
      "created_at": "2023-09-15T14:30:00Z"
    },
    {
      "id": "pay_12346",
      "order_id": "ord_67891",
      "amount": 45.50,
      "currency": "USD",
      "status": "succeeded",
      "payment_method": {
        "id": "pm_12345",
        "type": "credit_card",
        "last4": "4242",
        "brand": "visa"
      },
      "created_at": "2023-09-10T11:15:00Z"
    }
  ],
  "meta": {
    "total": 12,
    "limit": 20,
    "offset": 0
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Create Payment Method */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Create Payment Method</h3>
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              POST
            </span>
            <code className="font-mono">/api/payment-methods</code>
          </div>
          <p className="mb-3">Creates a new payment method for the authenticated user.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Request Body</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "type": "credit_card",
  "token": "tok_visa", // Token from payment processor
  "is_default": true
}`}
            </CodeBlock>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Response</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "id": "pm_12345",
  "type": "credit_card",
  "last4": "4242",
  "brand": "visa",
  "exp_month": 12,
  "exp_year": 2025,
  "is_default": true,
  "created_at": "2023-09-15T14:30:00Z"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* List Payment Methods */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">List Payment Methods</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              GET
            </span>
            <code className="font-mono">/api/payment-methods</code>
          </div>
          <p className="mb-3">Retrieves all payment methods for the authenticated user.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Response</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "data": [
    {
      "id": "pm_12345",
      "type": "credit_card",
      "last4": "4242",
      "brand": "visa",
      "exp_month": 12,
      "exp_year": 2025,
      "is_default": true,
      "created_at": "2023-09-15T14:30:00Z"
    },
    {
      "id": "pm_12346",
      "type": "credit_card",
      "last4": "1234",
      "brand": "mastercard",
      "exp_month": 10,
      "exp_year": 2024,
      "is_default": false,
      "created_at": "2023-08-20T09:45:00Z"
    }
  ]
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Delete Payment Method */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Delete Payment Method</h3>
          <div className="mb-2">
            <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              DELETE
            </span>
            <code className="font-mono">/api/payment-methods/{"{payment_method_id}"}</code>
          </div>
          <p className="mb-3">Deletes a payment method for the authenticated user.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Path Parameters</h4>
            <ul className="list-disc pl-5">
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">payment_method_id</code> - The ID of the payment
                method
              </li>
            </ul>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Response</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "deleted": true,
  "id": "pm_12345"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Issue Refund */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Issue Refund</h3>
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
              POST
            </span>
            <code className="font-mono">/api/payments/{"{payment_id}"}/refund</code>
          </div>
          <p className="mb-3">Issues a refund for a payment. Admin access required.</p>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Path Parameters</h4>
            <ul className="list-disc pl-5">
              <li>
                <code className="bg-slate-100 px-1 py-0.5 rounded">payment_id</code> - The ID of the payment to refund
              </li>
            </ul>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Request Body</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "amount": 89.97, // Optional, if not provided, full amount will be refunded
  "reason": "Customer request"
}`}
            </CodeBlock>
          </div>

          <div className="mb-3">
            <h4 className="font-medium mb-1">Response</h4>
            <CodeBlock language="json" className="bg-slate-800 text-slate-50">
              {`{
  "id": "ref_12345",
  "payment_id": "pay_12345",
  "amount": 89.97,
  "currency": "USD",
  "status": "succeeded",
  "reason": "Customer request",
  "created_at": "2023-09-16T10:15:00Z"
}`}
            </CodeBlock>
          </div>
        </div>
      </DocPaper>

      {/* Models Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Models</h2>

        {/* Payment Model */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Payment</h3>
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
                <td className="py-2 px-4 border-b">Unique identifier for the payment</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>order_id</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ID of the order associated with this payment</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>user_id</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ID of the user who made the payment</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>amount</code>
                </td>
                <td className="py-2 px-4 border-b">number</td>
                <td className="py-2 px-4 border-b">Payment amount</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>currency</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Currency code (e.g., USD, EUR)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>status</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Payment status (succeeded, pending, failed)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>payment_method</code>
                </td>
                <td className="py-2 px-4 border-b">object</td>
                <td className="py-2 px-4 border-b">Payment method details</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>receipt_url</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">URL to the payment receipt</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>description</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Description of the payment</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>created_at</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ISO timestamp of when the payment was created</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>updated_at</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ISO timestamp of when the payment was last updated</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Method Model */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Payment Method</h3>
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
                <td className="py-2 px-4 border-b">Unique identifier for the payment method</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>type</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Type of payment method (credit_card, debit_card, paypal, etc.)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>last4</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Last 4 digits of the card number (for card types)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>brand</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Card brand (visa, mastercard, amex, etc.)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>exp_month</code>
                </td>
                <td className="py-2 px-4 border-b">number</td>
                <td className="py-2 px-4 border-b">Expiration month (for card types)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>exp_year</code>
                </td>
                <td className="py-2 px-4 border-b">number</td>
                <td className="py-2 px-4 border-b">Expiration year (for card types)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>is_default</code>
                </td>
                <td className="py-2 px-4 border-b">boolean</td>
                <td className="py-2 px-4 border-b">Whether this is the default payment method</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>created_at</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ISO timestamp of when the payment method was created</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Refund Model */}
        <div>
          <h3 className="text-xl font-medium mb-3">Refund</h3>
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
                <td className="py-2 px-4 border-b">Unique identifier for the refund</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>payment_id</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ID of the payment being refunded</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>amount</code>
                </td>
                <td className="py-2 px-4 border-b">number</td>
                <td className="py-2 px-4 border-b">Refund amount</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>currency</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Currency code (e.g., USD, EUR)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>status</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Refund status (succeeded, pending, failed)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>reason</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">Reason for the refund</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>created_at</code>
                </td>
                <td className="py-2 px-4 border-b">string</td>
                <td className="py-2 px-4 border-b">ISO timestamp of when the refund was created</td>
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
            {`// Process a payment
async function processPayment() {
  const response = await fetch('https://api.grocerymanagement.com/api/payments', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      order_id: 'ord_67890',
      payment_method_id: 'pm_12345',
      amount: 89.97,
      currency: 'USD',
      description: 'Payment for grocery order #67890'
    })
  });
  
  const data = await response.json();
  return data;
}

// Get a list of payment methods
async function getPaymentMethods() {
  const response = await fetch('https://api.grocerymanagement.com/api/payment-methods', {
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN'
    }
  });
  
  const data = await response.json();
  return data;
}

// Create a new payment method
async function createPaymentMethod(token) {
  const response = await fetch('https://api.grocerymanagement.com/api/payment-methods', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'credit_card',
      token: token,
      is_default: true
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
            {`# Process a payment
curl -X POST https://api.grocerymanagement.com/api/payments \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "order_id": "ord_67890",
    "payment_method_id": "pm_12345",
    "amount": 89.97,
    "currency": "USD",
    "description": "Payment for grocery order #67890"
  }'

# Get a specific payment
curl -X GET https://api.grocerymanagement.com/api/payments/pay_12345 \\
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Create a new payment method
curl -X POST https://api.grocerymanagement.com/api/payment-methods \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "credit_card",
    "token": "tok_visa",
    "is_default": true
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
    "code": "payment_failed",
    "message": "Your card was declined",
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
                  <code>payment_not_found</code>
                </td>
                <td className="py-2 px-4 border-b">The specified payment does not exist</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>payment_method_not_found</code>
                </td>
                <td className="py-2 px-4 border-b">The specified payment method does not exist</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>payment_failed</code>
                </td>
                <td className="py-2 px-4 border-b">The payment could not be processed</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>insufficient_funds</code>
                </td>
                <td className="py-2 px-4 border-b">The payment method has insufficient funds</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>card_declined</code>
                </td>
                <td className="py-2 px-4 border-b">The card was declined</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>invalid_card</code>
                </td>
                <td className="py-2 px-4 border-b">The card information is invalid</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>expired_card</code>
                </td>
                <td className="py-2 px-4 border-b">The card has expired</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>refund_failed</code>
                </td>
                <td className="py-2 px-4 border-b">The refund could not be processed</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  <code>refund_limit_exceeded</code>
                </td>
                <td className="py-2 px-4 border-b">The refund amount exceeds the original payment amount</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocPaper>
    </div>
  )
}
