import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function AuthDocs() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Link href="/api-docs" className="flex items-center text-primary-foreground hover:underline mr-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to API Docs
            </Link>
            <h1 className="text-3xl font-bold">Authentication Documentation</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Authentication Overview Section */}
            <section id="auth-overview" className="space-y-6">
              <div className="border-b pb-2">
                <h2 className="text-2xl font-bold">Authentication Overview</h2>
                <p className="text-muted-foreground">
                  This API uses JWT (JSON Web Tokens) for authentication with automatic token refresh.
                </p>
              </div>

              <div className="space-y-4">
                <p>
                  The authentication system uses Supabase Auth for user management and JWT-based authentication. When a
                  user signs in, they receive an access token and a refresh token. The access token is used to
                  authenticate API requests, while the refresh token is used to obtain a new access token when the
                  current one expires.
                </p>

                <h3 className="text-xl font-semibold mt-6">Authentication Flow</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Sign In</strong>: User signs in with email and password, receiving an access token and
                    refresh token.
                  </li>
                  <li>
                    <strong>API Requests</strong>: The access token is included in the Authorization header of API
                    requests.
                  </li>
                  <li>
                    <strong>Token Validation</strong>: The server validates the token for each request.
                  </li>
                  <li>
                    <strong>Token Expiration</strong>: When the access token expires, the client uses the refresh token
                    to obtain a new access token.
                  </li>
                  <li>
                    <strong>Session Persistence</strong>: The session is maintained until the user explicitly signs out
                    or the refresh token expires.
                  </li>
                </ol>

                <h3 className="text-xl font-semibold mt-6">Session Management</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Session Verification</strong>: The client should verify the session validity before making
                    authenticated requests.
                  </li>
                  <li>
                    <strong>Token Expiration Check</strong>: Check if the access token has expired based on the
                    expiration timestamp.
                  </li>
                  <li>
                    <strong>Server Validation</strong>: Validate the token with the server using the session endpoint.
                  </li>
                  <li>
                    <strong>Automatic Refresh</strong>: If the token is expired or invalid, automatically refresh it
                    using the refresh token.
                  </li>
                  <li>
                    <strong>Graceful Degradation</strong>: Handle authentication failures by redirecting to the login
                    page.
                  </li>
                </ol>
              </div>
            </section>

            {/* Authentication Endpoints Section */}
            <section id="auth-endpoints" className="space-y-6">
              <div className="border-b pb-2">
                <h2 className="text-2xl font-bold">Authentication Endpoints</h2>
                <p className="text-muted-foreground">API endpoints for authentication operations.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded">POST</span>
                    <h3 className="text-xl font-semibold">/api/auth/signin</h3>
                  </div>
                  <p>Sign in with email and password to obtain access and refresh tokens.</p>

                  <div className="space-y-2">
                    <h4 className="font-medium">Request Body</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        {`{
  "email": "user@example.com",
  "password": "securepassword"
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Response (200 OK)</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        {`{
  "message": "Signed in successfully",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com"
  },
  "profile": {
    "id": "user-uuid",
    "role": "customer",
    "full_name": "John Doe"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "aBcDeFgHiJkLmNoPqRsTuVwXyZ...",
    "expires_at": 1679644800
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded">POST</span>
                    <h3 className="text-xl font-semibold">/api/auth/refresh</h3>
                  </div>
                  <p>Refresh the access token using a refresh token.</p>

                  <div className="space-y-2">
                    <h4 className="font-medium">Request Body</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        {`{
  "refresh_token": "aBcDeFgHiJkLmNoPqRsTuVwXyZ..."
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Response (200 OK)</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        {`{
  "message": "Session refreshed successfully",
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "aBcDeFgHiJkLmNoPqRsTuVwXyZ...",
    "expires_at": 1679644800
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded">GET</span>
                    <h3 className="text-xl font-semibold">/api/auth/session</h3>
                  </div>
                  <p>Check if the current session is valid.</p>

                  <div className="space-y-2">
                    <h4 className="font-medium">Request</h4>
                    <p className="text-sm text-muted-foreground">
                      No request body required. Authentication is handled through the Authorization header with the
                      access token.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Response (200 OK)</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        {`{
  "authenticated": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe"
    }
  }
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Response (401 Unauthorized)</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        {`{
  "authenticated": false,
  "message": "Invalid or expired token"
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded">POST</span>
                    <h3 className="text-xl font-semibold">/api/auth/signout</h3>
                  </div>
                  <p>Sign out the current user and invalidate their session.</p>

                  <div className="space-y-2">
                    <h4 className="font-medium">Request</h4>
                    <p className="text-sm text-muted-foreground">
                      No request body required. Authentication is handled through the Authorization header.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Response (200 OK)</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        {`{
  "message": "Signed out successfully"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Client Implementation Section */}
            <section id="client-implementation" className="space-y-6">
              <div className="border-b pb-2">
                <h2 className="text-2xl font-bold">Client Implementation</h2>
                <p className="text-muted-foreground">How to implement authentication in your client application.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">1. Sign In</h3>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    {`// Sign in and store tokens
async function signIn(email, password) {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to sign in');
  }
  
  // Store tokens in localStorage or secure cookie
  localStorage.setItem('access_token', data.session.access_token);
  localStorage.setItem('refresh_token', data.session.refresh_token);
  localStorage.setItem('expires_at', data.session.expires_at);
  
  return data;
}`}
                  </pre>
                </div>

                <h3 className="text-xl font-semibold mt-6">2. Make Authenticated Requests</h3>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    {`// Function to make authenticated API requests
async function fetchWithAuth(url, options = {}) {
  // Get the access token
  const accessToken = localStorage.getItem('access_token');
  const expiresAt = localStorage.getItem('expires_at');
  
  // Check if token is expired
  const isExpired = expiresAt && new Date(Number(expiresAt) * 1000) <= new Date();
  
  // If token is expired, refresh it
  if (isExpired) {
    await refreshToken();
  }
  
  // Get the (potentially refreshed) access token
  const token = localStorage.getItem('access_token');
  
  // Make the request with the token
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': \`Bearer \${token}\`,
    },
  });
  
  // If unauthorized, try refreshing token and retry
  if (response.status === 401) {
    const refreshed = await refreshToken();
    
    if (refreshed) {
      // Retry with new token
      return fetchWithAuth(url, options);
    }
  }
  
  return response;
}`}
                  </pre>
                </div>

                <h3 className="text-xl font-semibold mt-6">3. Refresh Token</h3>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    {`// Function to refresh the access token
async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    return false;
  }
  
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    
    // Update stored tokens
    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('refresh_token', data.session.refresh_token);
    localStorage.setItem('expires_at', data.session.expires_at);
    
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    
    // Clear tokens on refresh failure
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    
    return false;
  }
}`}
                  </pre>
                </div>

                <h3 className="text-xl font-semibold mt-6">4. Check Session</h3>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    {`// Function to check if the session is active
async function checkSession() {
  const accessToken = localStorage.getItem('access_token');
  
  if (!accessToken) {
    return { authenticated: false, message: "No access token found" };
  }

  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Authorization': \`Bearer \${accessToken}\`,
      },
    });

    const data = await response.json();
    
    // If session is invalid but we have a refresh token, try to refresh
    if (!data.authenticated && localStorage.getItem('refresh_token')) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Check session again with new token
        return checkSession();
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error checking session:', error);
    return { authenticated: false, message: "Failed to check session" };
  }
}`}
                  </pre>
                </div>

                <h3 className="text-xl font-semibold mt-6">5. Sign Out</h3>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    {`// Function to sign out
async function signOut() {
  const token = localStorage.getItem('access_token');
  
  try {
    // Call the sign out endpoint
    await fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${token}\`,
      },
    });
  } catch (error) {
    console.error('Error signing out:', error);
  } finally {
    // Clear tokens regardless of API call success
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
  }
}`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Security Considerations Section */}
            <section id="security" className="space-y-6">
              <div className="border-b pb-2">
                <h2 className="text-2xl font-bold">Security Considerations</h2>
                <p className="text-muted-foreground">Important security practices for authentication.</p>
              </div>

              <div className="space-y-4">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Token Storage</strong>: For production applications, consider using secure HTTP-only cookies
                    instead of localStorage to store tokens.
                  </li>
                  <li>
                    <strong>HTTPS</strong>: Always use HTTPS in production to encrypt token transmission.
                  </li>
                  <li>
                    <strong>Token Expiration</strong>: Set appropriate expiration times for access tokens (short-lived)
                    and refresh tokens (longer-lived).
                  </li>
                  <li>
                    <strong>CORS</strong>: Configure CORS properly to prevent unauthorized domains from accessing your
                    API.
                  </li>
                  <li>
                    <strong>Rate Limiting</strong>: Implement rate limiting on authentication endpoints to prevent brute
                    force attacks.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Grocery Management API
        </div>
      </footer>
    </div>
  )
}
