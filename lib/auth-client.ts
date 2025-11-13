import { createClient } from "@supabase/supabase-js"

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Enable session persistence
    autoRefreshToken: true, // Enable automatic token refresh
  },
})

// Function to get the current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error("Error getting session:", error)
    return null
  }

  return data.session
}

// Function to refresh the session
export async function refreshToken() {
  const refreshToken = localStorage.getItem("refresh_token")

  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()

    // Update stored tokens
    localStorage.setItem("access_token", data.access_token)
    localStorage.setItem("refresh_token", data.refresh_token)
    localStorage.setItem("expires_at", data.expires_at)

    return true
  } catch (error) {
    console.error("Error refreshing token:", error)

    // Clear tokens on refresh failure
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("expires_at")

    return false
  }
}

// Add this new function to check if the session is active
export async function checkSession() {
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    return { authenticated: false, message: "No access token found" }
  }

  try {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    // If session is invalid but we have a refresh token, try to refresh
    if (!data.authenticated && localStorage.getItem("refresh_token")) {
      const refreshed = await refreshToken()
      if (refreshed) {
        // Check session again with new token
        return checkSession()
      }
    }

    return data
  } catch (error) {
    console.error("Error checking session:", error)
    return { authenticated: false, message: "Failed to check session" }
  }
}

// Update the getAuthToken function to check session validity
export async function getAuthToken() {
  const accessToken = localStorage.getItem("access_token")
  const expiresAt = localStorage.getItem("expires_at")

  // If no token exists, return null
  if (!accessToken) {
    return null
  }

  // Check if token is expired based on local expiry time
  const isExpired = expiresAt && new Date(Number(expiresAt) * 1000) <= new Date()

  // If token is expired, refresh it
  if (isExpired) {
    const refreshed = await refreshToken()
    if (refreshed) {
      return localStorage.getItem("access_token")
    }
    return null
  }

  // Verify token is still valid with the server
  const { authenticated } = await checkSession()
  if (!authenticated) {
    // Try refreshing if session is invalid
    const refreshed = await refreshToken()
    if (refreshed) {
      return localStorage.getItem("access_token")
    }
    return null
  }

  return accessToken
}

// Function to make authenticated API requests
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get the access token
  const token = await getAuthToken()

  if (!token) {
    throw new Error("No authentication token available")
  }

  // Make the request with the token
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })

  // If unauthorized, try refreshing token and retry
  if (response.status === 401) {
    const refreshed = await refreshToken()

    if (refreshed) {
      // Retry with new token
      const newToken = localStorage.getItem("access_token")
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      })
    }
  }

  return response
}
