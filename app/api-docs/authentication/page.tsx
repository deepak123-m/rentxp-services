import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthenticationApiDocs() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Authentication API</h1>
      <p className="text-lg mb-8">
        This documentation covers all authentication-related endpoints, including signup, signin, token refresh, and
        session management.
      </p>

      {/* Sign Up */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>POST /api/auth/signup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Creates a new user account. After successful registration, the user will receive authentication tokens that
            can be used for subsequent API calls.
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-2">Request Body</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe",
  "role": "customer",  // Optional, defaults to "customer"
  "phone": "+1234567890",  // Optional
  "address": "123 Main St, City",  // Optional
  "device_token": "fcm-token-for-push-notifications",  // Optional
  "device_type": "android"  // Optional, defaults to "unknown"
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Response</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`{
  "message": "User created successfully",
  "user": {
    "id": "user_id_123",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "role": "customer"
    },
    "app_metadata": {},
    "created_at": "2023-06-23T10:30:00Z"
  },
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "aBcDeFgHiJkLmNoPqRsTuVwXyZ...",
    "expires_at": 1687518600
  }
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Error Responses</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`// Missing required fields
{
  "error": "Email, password, and full name are required"
}

// Invalid role
{
  "error": "Invalid role"
}

// Email already in use
{
  "error": "User already registered"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Sign In */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>POST /api/auth/signin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Authenticates a user and returns session tokens. These tokens are required for accessing protected
            endpoints.
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-2">Request Body</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`{
  "email": "user@example.com",
  "password": "securepassword123",
  "device_token": "fcm-token-for-push-notifications",  // Optional
  "device_type": "ios"  // Optional
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Response</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`{
  "message": "Signed in successfully",
  "user": {
    "id": "user_id_123",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "role": "customer"
    },
    "app_metadata": {},
    "created_at": "2023-06-23T10:30:00Z"
  },
  "profile": {
    "id": "user_id_123",
    "role": "customer",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St, City",
    "created_at": "2023-06-23T10:30:00Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "aBcDeFgHiJkLmNoPqRsTuVwXyZ...",
    "expires_at": 1687518600
  }
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Error Responses</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`// Missing required fields
{
  "error": "Email and password are required"
}

// Invalid credentials
{
  "error": "Invalid login credentials"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sign Out</CardTitle>
          <CardDescription>POST /api/auth/signout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Signs out the current user by invalidating their session. This endpoint should be called when a user logs
            out.
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-2">Request</h3>
            <p className="mb-2">No request body is required. The user is identified by the Authorization header.</p>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`// Headers
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Response</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`{
  "message": "Signed out successfully"
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Error Responses</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`// Unauthorized
{
  "error": "Unauthorized"
}

// Server error
{
  "error": "Error signing out",
  "details": "Error message"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Token */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Refresh Token</CardTitle>
          <CardDescription>POST /api/auth/refresh</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Refreshes an expired access token using a valid refresh token. This endpoint should be called when an access
            token expires.
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-2">Request</h3>
            <p className="mb-2">
              The refresh token can be provided either in the Authorization header or in the request body.
            </p>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`// Option 1: Using Authorization header
// Headers
{
  "Authorization": "Bearer aBcDeFgHiJkLmNoPqRsTuVwXyZ..."  // Refresh token
}

// Option 2: Using request body
// Body
{
  "refresh_token": "aBcDeFgHiJkLmNoPqRsTuVwXyZ..."
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Response</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // New access token
  "refresh_token": "aBcDeFgHiJkLmNoPqRsTuVwXyZ...",  // New refresh token
  "expires_at": 1687518600,  // Timestamp when the access token expires
  "user": {
    "id": "user_id_123",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "role": "customer"
    }
  }
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Error Responses</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`// No refresh token provided
{
  "error": "Unauthorized",
  "message": "No refresh token provided"
}

// Invalid refresh token
{
  "error": "Unauthorized",
  "message": "Invalid refresh token"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Check Session */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Check Session</CardTitle>
          <CardDescription>GET /api/auth/session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Checks if the current session is valid. This endpoint can be used to verify if a user is authenticated.</p>

          <div>
            <h3 className="text-lg font-semibold mb-2">Request</h3>
            <p className="mb-2">No request body is required. The user is identified by the Authorization header.</p>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`// Headers
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // Access token
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Response</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`// Valid session
{
  "authenticated": true,
  "user": {
    "id": "user_id_123",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "role": "customer"
    }
  }
}

// Invalid session
{
  "authenticated": false,
  "message": "Session expired or invalid"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Token Usage Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Authentication Token Usage Guide</CardTitle>
          <CardDescription>How to use authentication tokens in your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Understanding Tokens</h3>
            <p className="mb-4">The authentication system uses two types of tokens:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <strong>Access Token:</strong> A short-lived JWT token (typically valid for 1 hour) used to authenticate
                API requests.
              </li>
              <li className="mb-2">
                <strong>Refresh Token:</strong> A long-lived token (typically valid for 2 weeks) used to obtain a new
                access token when the current one expires.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Using Tokens in API Requests</h3>
            <p className="mb-2">To access protected endpoints, include the access token in the Authorization header:</p>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`// Example API request with access token
fetch('https://api.example.com/api/protected-endpoint', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Token Refresh Flow</h3>
            <p className="mb-2">When an access token expires, use the refresh token to obtain a new one:</p>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`// Example token refresh flow
async function refreshTokens() {
  const refreshToken = localStorage.getItem('refresh_token');
  
  const response = await fetch('https://api.example.com/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${refreshToken}\`
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    
    // Store the new tokens
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('expires_at', data.expires_at);
    
    return data.access_token;
  } else {
    // Refresh token is invalid or expired
    // User needs to log in again
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    
    // Redirect to login page
    window.location.href = '/login';
  }
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Handling Token Expiration</h3>
            <p className="mb-2">
              To handle token expiration gracefully, check the expiration before making API requests:
            </p>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {`// Example function to get a valid access token
async function getValidAccessToken() {
  const accessToken = localStorage.getItem('access_token');
  const expiresAt = localStorage.getItem('expires_at');
  
  // Check if token is expired or will expire soon (within 5 minutes)
  const isExpired = expiresAt && (new Date(Number(expiresAt) * 1000) <= new Date(Date.now() + 5 * 60 * 1000));
  
  if (!accessToken || isExpired) {
    // Token is expired or will expire soon, refresh it
    return await refreshTokens();
  }
  
  // Token is still valid
  return accessToken;
}

// Example API request with automatic token refresh
async function fetchProtectedData(url) {
  const token = await getValidAccessToken();
  
  const response = await fetch(url, {
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
  
  return response.json();
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Flutter Implementation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Flutter Implementation Example</CardTitle>
          <CardDescription>How to implement authentication in a Flutter app</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Here's how to implement authentication in a Flutter app:</p>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
            {`import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage';
import 'package:http/http.dart' as http;

class AuthService {
  final storage = FlutterSecureStorage();
  final String baseUrl = 'https://api.example.com';
  
  // Sign up a new user
  Future<Map<String, dynamic>> signUp(String email, String password, String fullName) async {
    final response = await http.post(
      Uri.parse('\${baseUrl}/api/auth/signup'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'full_name': fullName,
      }),
    );
    
    final data = jsonDecode(response.body);
    
    if (response.statusCode == 200) {
      // Store tokens securely
      await storage.write(key: 'access_token', value: data['tokens']['access_token']);
      await storage.write(key: 'refresh_token', value: data['tokens']['refresh_token']);
      await storage.write(key: 'expires_at', value: data['tokens']['expires_at'].toString());
      
      return data;
    } else {
      throw Exception(data['error'] ?? 'Failed to sign up');
    }
  }
  
  // Sign in an existing user
  Future<Map<String, dynamic>> signIn(String email, String password) async {
    final response = await http.post(
      Uri.parse('\${baseUrl}/api/auth/signin'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    
    final data = jsonDecode(response.body);
    
    if (response.statusCode == 200) {
      // Store tokens securely
      await storage.write(key: 'access_token', value: data['session']['access_token']);
      await storage.write(key: 'refresh_token', value: data['session']['refresh_token']);
      await storage.write(key: 'expires_at', value: data['session']['expires_at'].toString());
      
      return data;
    } else {
      throw Exception(data['error'] ?? 'Failed to sign in');
    }
  }
  
  // Get a valid access token
  Future<String?> getValidAccessToken() async {
    final accessToken = await storage.read(key: 'access_token');
    final expiresAtStr = await storage.read(key: 'expires_at');
    
    if (accessToken == null) return null;
    
    if (expiresAtStr != null) {
      final expiresAt = int.parse(expiresAtStr);
      final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
      
      // If token expires in less than 5 minutes, refresh it
      if (expiresAt - now < 300) {
        return await refreshTokens();
      }
    }
    
    return accessToken;
  }
  
  // Refresh the access token
  Future<String?> refreshTokens() async {
    final refreshToken = await storage.read(key: 'refresh_token');
    
    if (refreshToken == null) return null;
    
    try {
      final response = await http.post(
        Uri.parse('\${baseUrl}/api/auth/refresh'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer \$refreshToken',
        },
      );
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        // Store the new tokens
        await storage.write(key: 'access_token', value: data['access_token']);
        await storage.write(key: 'refresh_token', value: data['refresh_token']);
        await storage.write(key: 'expires_at', value: data['expires_at'].toString());
        
        return data['access_token'];
      } else {
        // Clear tokens on refresh failure
        await signOut();
        return null;
      }
    } catch (e) {
      // Clear tokens on refresh failure
      await signOut();
      return null;
    }
  }
  
  // Sign out the user
  Future<void> signOut() async {
    final accessToken = await storage.read(key: 'access_token');
    
    if (accessToken != null) {
      try {
        await http.post(
          Uri.parse('\${baseUrl}/api/auth/signout'),
          headers: {
            'Authorization': 'Bearer \$accessToken',
          },
        );
      } catch (e) {
        // Ignore errors when signing out
      }
    }
    
    // Clear stored tokens
    await storage.delete(key: 'access_token');
    await storage.delete(key: 'refresh_token');
    await storage.delete(key: 'expires_at');
  }
  
  // Make an authenticated API request
  Future<Map<String, dynamic>> authenticatedRequest(String url, {String method = 'GET', Map<String, dynamic>? body}) async {
    final token = await getValidAccessToken();
    
    if (token == null) {
      throw Exception('Not authenticated');
    }
    
    final headers = {
      'Authorization': 'Bearer \$token',
      'Content-Type': 'application/json',
    };
    
    http.Response response;
    
    switch (method) {
      case 'GET':
        response = await http.get(Uri.parse(url), headers: headers);
        break;
      case 'POST':
        response = await http.post(
          Uri.parse(url),
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        );
        break;
      case 'PUT':
        response = await http.put(
          Uri.parse(url),
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        );
        break;
      case 'DELETE':
        response = await http.delete(Uri.parse(url), headers: headers);
        break;
      default:
        throw Exception('Unsupported method: \$method');
    }
    
    if (response.statusCode == 401) {
      // Token might be expired or invalid
      final newToken = await refreshTokens();
      
      if (newToken == null) {
        throw Exception('Authentication failed');
      }
      
      // Retry the request with the new token
      return authenticatedRequest(url, method: method, body: body);
    }
    
    return jsonDecode(response.body);
  }
}`}
          </pre>
        </CardContent>
      </Card>

      {/* Security Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Security Best Practices</CardTitle>
          <CardDescription>Recommendations for secure authentication implementation</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6">
            <li className="mb-2">
              <strong>Secure Storage:</strong> Always store tokens in secure storage, not in local storage or cookies.
            </li>
            <li className="mb-2">
              <strong>HTTPS:</strong> Always use HTTPS for all API requests to prevent token interception.
            </li>
            <li className="mb-2">
              <strong>Token Expiration:</strong> Set appropriate expiration times for tokens. Access tokens should have
              a short lifetime (e.g., 1 hour), while refresh tokens can have a longer lifetime (e.g., 2 weeks).
            </li>
            <li className="mb-2">
              <strong>Token Revocation:</strong> Implement token revocation on logout and password change.
            </li>
            <li className="mb-2">
              <strong>Error Handling:</strong> Implement proper error handling for authentication failures.
            </li>
            <li className="mb-2">
              <strong>Rate Limiting:</strong> Implement rate limiting for authentication endpoints to prevent brute
              force attacks.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
