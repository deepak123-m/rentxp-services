import { CodeBlock } from "@/components/code-block"
import { DocPaper } from "@/components/doc-paper"

export default function NotificationsApiDocs() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Notifications API Documentation</h1>

      {/* Overview Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The Notifications API allows you to manage user notifications in the grocery management system. This includes
          retrieving notifications, marking them as read, and managing notification preferences.
        </p>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Base URL</h3>
          <CodeBlock language="plaintext">https://api.groceryapp.com/api</CodeBlock>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Authentication</h3>
          <p>
            All endpoints in the Notifications API require authentication using a Bearer token in the Authorization
            header:
          </p>
          <CodeBlock language="plaintext">Authorization: Bearer YOUR_API_TOKEN</CodeBlock>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Notification Types</h3>
          <p className="mb-2">The system supports various notification types:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>order_status</strong>: Updates about order status changes
            </li>
            <li>
              <strong>promotion</strong>: Special offers and promotions
            </li>
            <li>
              <strong>stock_alert</strong>: Alerts when items in your wishlist are back in stock
            </li>
            <li>
              <strong>price_drop</strong>: Notifications about price reductions on items you've shown interest in
            </li>
            <li>
              <strong>delivery</strong>: Updates about delivery status
            </li>
            <li>
              <strong>system</strong>: System-related notifications
            </li>
          </ul>
        </div>
      </DocPaper>

      {/* Endpoints Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>

        {/* Get All Notifications */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get All Notifications</h3>
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/notifications</span>
          </div>
          <p className="mb-3">
            Retrieves all notifications for the authenticated user. Results can be filtered and paginated.
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
                  <td className="border p-2">number</td>
                  <td className="border p-2">Page number for pagination (default: 1)</td>
                </tr>
                <tr>
                  <td className="border p-2">limit</td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">Number of notifications per page (default: 20, max: 100)</td>
                </tr>
                <tr>
                  <td className="border p-2">type</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Filter by notification type</td>
                </tr>
                <tr>
                  <td className="border p-2">is_read</td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2">Filter by read status (true/false)</td>
                </tr>
                <tr>
                  <td className="border p-2">start_date</td>
                  <td className="border p-2">string (ISO date)</td>
                  <td className="border p-2">Filter notifications created on or after this date</td>
                </tr>
                <tr>
                  <td className="border p-2">end_date</td>
                  <td className="border p-2">string (ISO date)</td>
                  <td className="border p-2">Filter notifications created on or before this date</td>
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
    "notifications": [
      {
        "id": "notif_123456",
        "type": "order_status",
        "title": "Order Shipped",
        "message": "Your order #12345 has been shipped and is on its way!",
        "reference_id": "order_12345",
        "reference_type": "order",
        "is_read": false,
        "created_at": "2023-06-15T10:30:00Z",
        "updated_at": "2023-06-15T10:30:00Z"
      },
      {
        "id": "notif_123457",
        "type": "promotion",
        "title": "Weekend Sale!",
        "message": "Enjoy 20% off on all fresh produce this weekend.",
        "reference_id": "promo_789",
        "reference_type": "promotion",
        "is_read": true,
        "created_at": "2023-06-14T08:15:00Z",
        "updated_at": "2023-06-14T09:20:00Z"
      }
    ],
    "pagination": {
      "total": 24,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get Notification by ID */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get Notification by ID</h3>
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/notifications/{"{notification_id}"}</span>
          </div>
          <p className="mb-3">Retrieves a specific notification by its ID.</p>
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
                  <td className="border p-2">notification_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the notification</td>
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
    "id": "notif_123456",
    "type": "order_status",
    "title": "Order Shipped",
    "message": "Your order #12345 has been shipped and is on its way!",
    "reference_id": "order_12345",
    "reference_type": "order",
    "is_read": false,
    "created_at": "2023-06-15T10:30:00Z",
    "updated_at": "2023-06-15T10:30:00Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Mark Notification as Read */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Mark Notification as Read</h3>
          <div className="mb-3">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono">PATCH</span>
            <span className="font-mono">/api/notifications/{"{notification_id}"}/read</span>
          </div>
          <p className="mb-3">Marks a specific notification as read.</p>
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
                  <td className="border p-2">notification_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the notification</td>
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
    "id": "notif_123456",
    "is_read": true,
    "updated_at": "2023-06-16T14:25:00Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Mark All Notifications as Read */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Mark All Notifications as Read</h3>
          <div className="mb-3">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono">PATCH</span>
            <span className="font-mono">/api/notifications/read-all</span>
          </div>
          <p className="mb-3">Marks all notifications for the authenticated user as read. Can be filtered by type.</p>
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
                  <td className="border p-2">type</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Only mark notifications of this type as read (optional)</td>
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
    "count": 5,
    "updated_at": "2023-06-16T14:30:00Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Delete Notification */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Delete Notification</h3>
          <div className="mb-3">
            <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 font-mono">DELETE</span>
            <span className="font-mono">/api/notifications/{"{notification_id}"}</span>
          </div>
          <p className="mb-3">Deletes a specific notification.</p>
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
                  <td className="border p-2">notification_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the notification</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "message": "Notification deleted successfully"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Subscribe to Push Notifications */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Subscribe to Push Notifications</h3>
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono">POST</span>
            <span className="font-mono">/api/notifications/subscribe</span>
          </div>
          <p className="mb-3">Subscribes a device to push notifications.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtfZOc6eBTWRTDXRoo...",
    "auth": "tBHItJI5svbpVQ..."
  }
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "id": "sub_123456",
    "created_at": "2023-06-16T14:30:00Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get Unread Notification Count */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get Unread Notification Count</h3>
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/notifications/unread-count</span>
          </div>
          <p className="mb-3">Returns the count of unread notifications for the authenticated user.</p>
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
                  <td className="border p-2">type</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Only count notifications of this type (optional)</td>
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
    "count": 7
  }
}`}
            </CodeBlock>
          </div>
        </div>
      </DocPaper>

      {/* Models Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Models</h2>

        {/* Notification Model */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Notification</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Field</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">id</td>
                <td className="border p-2">uuid</td>
                <td className="border p-2">Unique identifier for the notification</td>
              </tr>
              <tr>
                <td className="border p-2">user_id</td>
                <td className="border p-2">uuid</td>
                <td className="border p-2">ID of the user this notification belongs to</td>
              </tr>
              <tr>
                <td className="border p-2">type</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Type of notification (order_status, promotion, etc.)</td>
              </tr>
              <tr>
                <td className="border p-2">title</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Short title of the notification</td>
              </tr>
              <tr>
                <td className="border p-2">message</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Detailed message content</td>
              </tr>
              <tr>
                <td className="border p-2">reference_id</td>
                <td className="border p-2">uuid</td>
                <td className="border p-2">ID of the referenced entity (e.g., order_id)</td>
              </tr>
              <tr>
                <td className="border p-2">reference_type</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Type of the referenced entity (e.g., order, product)</td>
              </tr>
              <tr>
                <td className="border p-2">is_read</td>
                <td className="border p-2">boolean</td>
                <td className="border p-2">Whether the notification has been read</td>
              </tr>
              <tr>
                <td className="border p-2">created_at</td>
                <td className="border p-2">timestamp</td>
                <td className="border p-2">When the notification was created</td>
              </tr>
              <tr>
                <td className="border p-2">updated_at</td>
                <td className="border p-2">timestamp</td>
                <td className="border p-2">When the notification was last updated</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Push Subscription Model */}
        <div>
          <h3 className="text-xl font-medium mb-3">Push Subscription</h3>
          <p className="mb-4">For push notifications, you'll need to create a push_subscriptions table:</p>
          <CodeBlock language="sql">
            {`CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);`}
          </CodeBlock>
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Field</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">id</td>
                <td className="border p-2">uuid</td>
                <td className="border p-2">Unique identifier for the subscription</td>
              </tr>
              <tr>
                <td className="border p-2">user_id</td>
                <td className="border p-2">uuid</td>
                <td className="border p-2">ID of the user this subscription belongs to</td>
              </tr>
              <tr>
                <td className="border p-2">endpoint</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Push notification endpoint URL</td>
              </tr>
              <tr>
                <td className="border p-2">p256dh</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Public key for encryption</td>
              </tr>
              <tr>
                <td className="border p-2">auth</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Authentication secret</td>
              </tr>
              <tr>
                <td className="border p-2">created_at</td>
                <td className="border p-2">timestamp</td>
                <td className="border p-2">When the subscription was created</td>
              </tr>
              <tr>
                <td className="border p-2">updated_at</td>
                <td className="border p-2">timestamp</td>
                <td className="border p-2">When the subscription was last updated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocPaper>

      {/* Examples Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Examples</h2>

        {/* JavaScript Example */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">JavaScript</h3>
          <CodeBlock language="javascript">
            {`// Get all notifications
async function getNotifications(filters = {}) {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const response = await fetch(\`https://api.groceryapp.com/api/notifications?\${queryParams}\`, {
      method: 'GET',
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error.message || 'Failed to fetch notifications');
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

// Mark notification as read
async function markNotificationAsRead(notificationId) {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(\`https://api.groceryapp.com/api/notifications/\${notificationId}/read\`, {
      method: 'PATCH',
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error.message || 'Failed to mark notification as read');
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

// Subscribe to push notifications
async function subscribeToPushNotifications(subscription) {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch('https://api.groceryapp.com/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        }
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error.message || 'Failed to subscribe to push notifications');
    }
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
}`}
          </CodeBlock>
        </div>

        {/* cURL Example */}
        <div>
          <h3 className="text-xl font-medium mb-3">cURL</h3>
          <CodeBlock language="bash">
            {`# Get all notifications
curl -X GET \\
  'https://api.groceryapp.com/api/notifications?page=1&limit=20&is_read=false' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json'

# Get notification by ID
curl -X GET \\
  https://api.groceryapp.com/api/notifications/notif_123456 \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json'

# Mark notification as read
curl -X PATCH \\
  https://api.groceryapp.com/api/notifications/notif_123456/read \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json'

# Mark all notifications as read
curl -X PATCH \\
  https://api.groceryapp.com/api/notifications/read-all \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json'

# Subscribe to push notifications
curl -X POST \\
  https://api.groceryapp.com/api/notifications/subscribe \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtfZOc6eBTWRTDXRoo...",
      "auth": "tBHItJI5svbpVQ..."
    }
  }'`}
          </CodeBlock>
        </div>
      </DocPaper>

      {/* Errors Section */}
      <DocPaper>
        <h2 className="text-2xl font-semibold mb-6">Errors</h2>
        <p className="mb-4">
          The Notifications API uses conventional HTTP response codes to indicate the success or failure of an API
          request.
        </p>
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Code</th>
              <th className="border p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">200 - OK</td>
              <td className="border p-2">Everything worked as expected</td>
            </tr>
            <tr>
              <td className="border p-2">400 - Bad Request</td>
              <td className="border p-2">The request was unacceptable, often due to missing a required parameter</td>
            </tr>
            <tr>
              <td className="border p-2">401 - Unauthorized</td>
              <td className="border p-2">No valid API token provided</td>
            </tr>
            <tr>
              <td className="border p-2">403 - Forbidden</td>
              <td className="border p-2">The API token doesn't have permissions to perform the request</td>
            </tr>
            <tr>
              <td className="border p-2">404 - Not Found</td>
              <td className="border p-2">The requested resource doesn't exist</td>
            </tr>
            <tr>
              <td className="border p-2">429 - Too Many Requests</td>
              <td className="border p-2">Too many requests hit the API too quickly</td>
            </tr>
            <tr>
              <td className="border p-2">500, 502, 503, 504 - Server Errors</td>
              <td className="border p-2">Something went wrong on the server</td>
            </tr>
          </tbody>
        </table>
        <div>
          <h3 className="text-xl font-medium mb-3">Error Response Format</h3>
          <CodeBlock language="json">
            {`{
  "success": false,
  "error": {
    "code": "notification_not_found",
    "message": "The requested notification could not be found",
    "status": 404
  }
}`}
          </CodeBlock>
        </div>
      </DocPaper>
    </div>
  )
}
