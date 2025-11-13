import { CodeBlock } from "@/components/code-block"
import { DocPaper } from "@/components/doc-paper"

export default function UsersApiDocs() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Users API Documentation</h1>

      {/* Overview Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The Users API allows you to manage user accounts in the grocery management system. This includes user
          registration, authentication, profile management, and preferences.
        </p>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Base URL</h3>
          <CodeBlock language="plaintext">https://api.groceryapp.com/api</CodeBlock>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Authentication</h3>
          <p>Most endpoints require authentication using a Bearer token in the Authorization header:</p>
          <CodeBlock language="plaintext">Authorization: Bearer YOUR_API_TOKEN</CodeBlock>
          <p className="mt-2">Authentication tokens are obtained by using the login endpoint.</p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Rate Limiting</h3>
          <p>
            Requests are limited to 100 per minute per IP address or API token. If you exceed this limit, you will
            receive a 429 Too Many Requests response.
          </p>
        </div>
      </DocPaper>

      {/* Endpoints Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>

        {/* User Registration */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">User Registration</h3>
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono">POST</span>
            <span className="font-mono">/api/users/register</span>
          </div>
          <p className="mb-3">Creates a new user account. No authentication required.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890"
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "id": "user_123456",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "created_at": "2023-06-15T10:30:00Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* User Login */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">User Login</h3>
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono">POST</span>
            <span className="font-mono">/api/users/login</span>
          </div>
          <p className="mb-3">Authenticates a user and returns a JWT token. No authentication required.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "id": "user_123456",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get User Profile */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get User Profile</h3>
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/users/profile</span>
          </div>
          <p className="mb-3">Returns the profile information of the authenticated user. Requires authentication.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "id": "user_123456",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "profile_image": "https://example.com/images/profiles/user_123456.jpg",
    "addresses": [
      {
        "id": "addr_123",
        "type": "home",
        "street": "123 Main St",
        "city": "Springfield",
        "state": "IL",
        "postal_code": "62704",
        "country": "USA",
        "is_default": true
      }
    ],
    "payment_methods": [
      {
        "id": "pm_456",
        "type": "credit_card",
        "last4": "4242",
        "brand": "Visa",
        "expiry_month": 12,
        "expiry_year": 2025,
        "is_default": true
      }
    ],
    "created_at": "2023-06-15T10:30:00Z",
    "updated_at": "2023-06-15T10:30:00Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Update User Profile */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Update User Profile</h3>
          <div className="mb-3">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono">PUT</span>
            <span className="font-mono">/api/users/profile</span>
          </div>
          <p className="mb-3">Updates the profile information of the authenticated user. Requires authentication.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "first_name": "Johnny",
  "last_name": "Doe",
  "phone_number": "+1987654321"
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "id": "user_123456",
    "email": "user@example.com",
    "first_name": "Johnny",
    "last_name": "Doe",
    "phone_number": "+1987654321",
    "updated_at": "2023-06-16T09:45:00Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Change Password */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Change Password</h3>
          <div className="mb-3">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono">PUT</span>
            <span className="font-mono">/api/users/password</span>
          </div>
          <p className="mb-3">Changes the password of the authenticated user. Requires authentication.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "current_password": "SecurePassword123!",
  "new_password": "EvenMoreSecure456!"
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "message": "Password updated successfully"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Forgot Password</h3>
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono">POST</span>
            <span className="font-mono">/api/users/forgot-password</span>
          </div>
          <p className="mb-3">Sends a password reset email to the user. No authentication required.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "email": "user@example.com"
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "message": "Password reset email sent"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Reset Password */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Reset Password</h3>
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono">POST</span>
            <span className="font-mono">/api/users/reset-password</span>
          </div>
          <p className="mb-3">Resets the user's password using a reset token. No authentication required.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "token": "reset_token_from_email",
  "new_password": "NewSecurePassword456!"
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "message": "Password has been reset successfully"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get User Preferences */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get User Preferences</h3>
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/users/preferences</span>
          </div>
          <p className="mb-3">Returns the preferences of the authenticated user. Requires authentication.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "notification_preferences": {
      "email": {
        "order_updates": true,
        "promotions": false,
        "newsletter": true
      },
      "sms": {
        "order_updates": true,
        "promotions": false
      },
      "push": {
        "order_updates": true,
        "promotions": true,
        "stock_alerts": true
      }
    },
    "dietary_preferences": ["vegetarian", "low_carb"],
    "favorite_categories": ["cat_fruits", "cat_dairy"],
    "language": "en",
    "currency": "USD"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Update User Preferences */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Update User Preferences</h3>
          <div className="mb-3">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono">PUT</span>
            <span className="font-mono">/api/users/preferences</span>
          </div>
          <p className="mb-3">Updates the preferences of the authenticated user. Requires authentication.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "notification_preferences": {
    "email": {
      "promotions": true
    },
    "push": {
      "stock_alerts": false
    }
  },
  "dietary_preferences": ["vegetarian", "gluten_free"],
  "favorite_categories": ["cat_fruits", "cat_dairy", "cat_organic"]
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "notification_preferences": {
      "email": {
        "order_updates": true,
        "promotions": true,
        "newsletter": true
      },
      "sms": {
        "order_updates": true,
        "promotions": false
      },
      "push": {
        "order_updates": true,
        "promotions": true,
        "stock_alerts": false
      }
    },
    "dietary_preferences": ["vegetarian", "gluten_free"],
    "favorite_categories": ["cat_fruits", "cat_dairy", "cat_organic"],
    "language": "en",
    "currency": "USD"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Delete User Account */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Delete User Account</h3>
          <div className="mb-3">
            <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 font-mono">DELETE</span>
            <span className="font-mono">/api/users/account</span>
          </div>
          <p className="mb-3">
            Deletes the authenticated user's account. This action is irreversible. Requires authentication.
          </p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "password": "SecurePassword123!",
  "reason": "No longer using the service"
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "message": "Account deleted successfully"
}`}
            </CodeBlock>
          </div>
        </div>
      </DocPaper>

      {/* Models Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Models</h2>

        {/* User Model */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">User</h3>
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
                <td className="border p-2">string</td>
                <td className="border p-2">Unique identifier for the user</td>
              </tr>
              <tr>
                <td className="border p-2">email</td>
                <td className="border p-2">string</td>
                <td className="border p-2">User's email address</td>
              </tr>
              <tr>
                <td className="border p-2">first_name</td>
                <td className="border p-2">string</td>
                <td className="border p-2">User's first name</td>
              </tr>
              <tr>
                <td className="border p-2">last_name</td>
                <td className="border p-2">string</td>
                <td className="border p-2">User's last name</td>
              </tr>
              <tr>
                <td className="border p-2">phone_number</td>
                <td className="border p-2">string</td>
                <td className="border p-2">User's phone number</td>
              </tr>
              <tr>
                <td className="border p-2">profile_image</td>
                <td className="border p-2">string | null</td>
                <td className="border p-2">URL to the user's profile image</td>
              </tr>
              <tr>
                <td className="border p-2">addresses</td>
                <td className="border p-2">array</td>
                <td className="border p-2">List of user's addresses</td>
              </tr>
              <tr>
                <td className="border p-2">payment_methods</td>
                <td className="border p-2">array</td>
                <td className="border p-2">List of user's payment methods</td>
              </tr>
              <tr>
                <td className="border p-2">created_at</td>
                <td className="border p-2">string (ISO date)</td>
                <td className="border p-2">When the user account was created</td>
              </tr>
              <tr>
                <td className="border p-2">updated_at</td>
                <td className="border p-2">string (ISO date)</td>
                <td className="border p-2">When the user account was last updated</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Address Model */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Address</h3>
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
                <td className="border p-2">string</td>
                <td className="border p-2">Unique identifier for the address</td>
              </tr>
              <tr>
                <td className="border p-2">type</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Address type (home, work, other)</td>
              </tr>
              <tr>
                <td className="border p-2">street</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Street address</td>
              </tr>
              <tr>
                <td className="border p-2">city</td>
                <td className="border p-2">string</td>
                <td className="border p-2">City</td>
              </tr>
              <tr>
                <td className="border p-2">state</td>
                <td className="border p-2">string</td>
                <td className="border p-2">State or province</td>
              </tr>
              <tr>
                <td className="border p-2">postal_code</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Postal or ZIP code</td>
              </tr>
              <tr>
                <td className="border p-2">country</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Country</td>
              </tr>
              <tr>
                <td className="border p-2">is_default</td>
                <td className="border p-2">boolean</td>
                <td className="border p-2">Whether this is the default address</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Method Model */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Payment Method</h3>
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
                <td className="border p-2">string</td>
                <td className="border p-2">Unique identifier for the payment method</td>
              </tr>
              <tr>
                <td className="border p-2">type</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Payment method type (credit_card, debit_card, wallet)</td>
              </tr>
              <tr>
                <td className="border p-2">last4</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Last 4 digits of the card number</td>
              </tr>
              <tr>
                <td className="border p-2">brand</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Card brand (Visa, Mastercard, etc.)</td>
              </tr>
              <tr>
                <td className="border p-2">expiry_month</td>
                <td className="border p-2">number</td>
                <td className="border p-2">Card expiration month</td>
              </tr>
              <tr>
                <td className="border p-2">expiry_year</td>
                <td className="border p-2">number</td>
                <td className="border p-2">Card expiration year</td>
              </tr>
              <tr>
                <td className="border p-2">is_default</td>
                <td className="border p-2">boolean</td>
                <td className="border p-2">Whether this is the default payment method</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* User Preferences Model */}
        <div>
          <h3 className="text-xl font-medium mb-3">User Preferences</h3>
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
                <td className="border p-2">notification_preferences</td>
                <td className="border p-2">object</td>
                <td className="border p-2">User's notification preferences</td>
              </tr>
              <tr>
                <td className="border p-2">dietary_preferences</td>
                <td className="border p-2">array</td>
                <td className="border p-2">User's dietary preferences</td>
              </tr>
              <tr>
                <td className="border p-2">favorite_categories</td>
                <td className="border p-2">array</td>
                <td className="border p-2">User's favorite product categories</td>
              </tr>
              <tr>
                <td className="border p-2">language</td>
                <td className="border p-2">string</td>
                <td className="border p-2">User's preferred language</td>
              </tr>
              <tr>
                <td className="border p-2">currency</td>
                <td className="border p-2">string</td>
                <td className="border p-2">User's preferred currency</td>
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
            {`// User Registration
async function registerUser(userData) {
  try {
    const response = await fetch('https://api.groceryapp.com/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store the token in localStorage or a secure cookie
      localStorage.setItem('auth_token', data.data.token);
      return data.data;
    } else {
      throw new Error(data.error.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// User Login
async function loginUser(email, password) {
  try {
    const response = await fetch('https://api.groceryapp.com/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store the token in localStorage or a secure cookie
      localStorage.setItem('auth_token', data.data.token);
      return data.data;
    } else {
      throw new Error(data.error.message || 'Login failed');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// Get User Profile
async function getUserProfile() {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch('https://api.groceryapp.com/api/users/profile', {
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
      throw new Error(data.error.message || 'Failed to fetch user profile');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Update User Profile
async function updateUserProfile(profileData) {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch('https://api.groceryapp.com/api/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error.message || 'Failed to update user profile');
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}`}
          </CodeBlock>
        </div>

        {/* cURL Example */}
        <div>
          <h3 className="text-xl font-medium mb-3">cURL</h3>
          <CodeBlock language="bash">
            {`# Register a new user
curl -X POST \\
  https://api.groceryapp.com/api/users/register \\
  -H 'Content-Type: application/json' \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890"
  }'

# Login
curl -X POST \\
  https://api.groceryapp.com/api/users/login \\
  -H 'Content-Type: application/json' \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'

# Get user profile
curl -X GET \\
  https://api.groceryapp.com/api/users/profile \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json'

# Update user profile
curl -X PUT \\
  https://api.groceryapp.com/api/users/profile \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "first_name": "Johnny",
    "last_name": "Doe",
    "phone_number": "+1987654321"
  }'

# Change password
curl -X PUT \\
  https://api.groceryapp.com/api/users/password \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "current_password": "SecurePassword123!",
    "new_password": "EvenMoreSecure456!"
  }'`}
          </CodeBlock>
        </div>
      </DocPaper>

      {/* Errors Section */}
      <DocPaper>
        <h2 className="text-2xl font-semibold mb-6">Errors</h2>
        <p className="mb-4">
          The Users API uses conventional HTTP response codes to indicate the success or failure of an API request.
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
              <td className="border p-2">409 - Conflict</td>
              <td className="border p-2">
                The request conflicts with another request or with the current state of the resource
              </td>
            </tr>
            <tr>
              <td className="border p-2">422 - Unprocessable Entity</td>
              <td className="border p-2">
                The request was well-formed but was unable to be followed due to semantic errors
              </td>
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
    "code": "invalid_credentials",
    "message": "The provided credentials are incorrect",
    "status": 401,
    "details": {
      "field": "password",
      "reason": "incorrect_password"
    }
  }
}`}
          </CodeBlock>
        </div>
      </DocPaper>
    </div>
  )
}
