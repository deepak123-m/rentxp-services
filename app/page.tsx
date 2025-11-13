import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Grocery Management API</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">API Documentation</h2>

          <div className="space-y-6">
            {/* Authentication Section */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Authentication</h3>
              <p className="mb-4">
                Secure authentication system with role-based access control and token refresh mechanism.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">POST /api/auth/signup</p>
                  <p className="text-sm text-muted-foreground">Create new user account</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">POST /api/auth/signin</p>
                  <p className="text-sm text-muted-foreground">Sign in existing user</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">POST /api/auth/signout</p>
                  <p className="text-sm text-muted-foreground">Sign out current user</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">POST /api/auth/refresh</p>
                  <p className="text-sm text-muted-foreground">Refresh authentication tokens</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p className="font-medium mb-1">Token Maintenance:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Access tokens expire after a short period (typically 1 hour)</li>
                  <li>Use the refresh endpoint to obtain new tokens without requiring re-authentication</li>
                  <li>Refresh tokens have a longer lifespan but are invalidated on sign out</li>
                  <li>Client applications should automatically refresh tokens when they expire</li>
                </ul>
              </div>
            </div>

            {/* Products Section */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Products</h3>
              <p className="mb-2">Manage grocery products inventory with an approval workflow:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1 text-sm">
                <li>
                  <span className="font-medium">Vendors</span> submit product requests that require admin approval
                </li>
                <li>
                  <span className="font-medium">Admins</span> review, approve, or reject product submissions
                </li>
                <li>Products only appear in the inventory after admin approval</li>
                <li>Vendors can track the status of their product submissions</li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/products</p>
                  <p className="text-sm text-muted-foreground">List approved products</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">POST /api/products/submit</p>
                  <p className="text-sm text-muted-foreground">Submit product for approval (Vendor)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/products/pending</p>
                  <p className="text-sm text-muted-foreground">List pending product submissions (Admin)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">PATCH /api/products/:id/approve</p>
                  <p className="text-sm text-muted-foreground">Approve a product submission (Admin)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">PATCH /api/products/:id/reject</p>
                  <p className="text-sm text-muted-foreground">Reject a product submission (Admin)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/products/submissions</p>
                  <p className="text-sm text-muted-foreground">View vendor's own submissions</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">POST /api/products/:id/images</p>
                  <p className="text-sm text-muted-foreground">Upload product images</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/products/:id/images</p>
                  <p className="text-sm text-muted-foreground">Get product images</p>
                </div>
              </div>
            </div>

            {/* Categories Section */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Categories</h3>
              <p className="mb-4">
                Manage product categories with hierarchical structure, including parent categories and subcategories.
                Categories can be nested to create a multi-level organization system for products.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/categories</p>
                  <p className="text-sm text-muted-foreground">List all categories (supports parent_id filtering)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">POST /api/categories</p>
                  <p className="text-sm text-muted-foreground">Create a new category or subcategory (Admin only)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/categories/:id</p>
                  <p className="text-sm text-muted-foreground">Get a specific category with its subcategories</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">PATCH /api/categories/:id</p>
                  <p className="text-sm text-muted-foreground">Update a category or change its parent (Admin only)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">DELETE /api/categories/:id</p>
                  <p className="text-sm text-muted-foreground">Delete a category (Admin only)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/categories/:id/products</p>
                  <p className="text-sm text-muted-foreground">Get products in a category (with subcategory support)</p>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Orders</h3>
              <p className="mb-2">
                Handle customer orders with a comprehensive status flow managed by different roles:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1 text-sm">
                <li>
                  <span className="font-medium">Vendors</span> can approve/reject pending orders and mark them as
                  preparing/ready
                </li>
                <li>
                  <span className="font-medium">Delivery personnel</span> can update orders to
                  in_transit/delivered/failed
                </li>
                <li>
                  <span className="font-medium">Customers</span> can cancel orders at certain stages
                </li>
                <li>
                  <span className="font-medium">Admins</span> have full control over all status transitions
                </li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">POST /api/orders</p>
                  <p className="text-sm text-muted-foreground">Create new order (Customer)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/orders</p>
                  <p className="text-sm text-muted-foreground">List orders (filtered by role and status)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">PATCH /api/orders/:id/status</p>
                  <p className="text-sm text-muted-foreground">Update order status (role-based permissions)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/orders/:id/history</p>
                  <p className="text-sm text-muted-foreground">View order status history</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/orders/:id/available-transitions</p>
                  <p className="text-sm text-muted-foreground">Get available status transitions for current role</p>
                </div>
              </div>
            </div>

            {/* Users Section */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Users</h3>
              <p className="mb-4">User management with role-based permissions.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/users</p>
                  <p className="text-sm text-muted-foreground">List users (Admin only)</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">PATCH /api/users/:id/role</p>
                  <p className="text-sm text-muted-foreground">Update user role (Admin only)</p>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Notifications</h3>
              <p className="mb-4">Test and manage user notifications.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">POST /api/notifications/test</p>
                  <p className="text-sm text-muted-foreground">Send a test notification</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">GET /api/notifications</p>
                  <p className="text-sm text-muted-foreground">List user notifications</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">POST /api/notifications/subscribe</p>
                  <p className="text-sm text-muted-foreground">Subscribe to push notifications</p>
                </div>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="font-medium">PATCH /api/notifications/:id/read</p>
                  <p className="text-sm text-muted-foreground">Mark notification as read</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/api-docs"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              View Full API Documentation
            </Link>
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
