import { CodeBlock } from "@/components/code-block"
import { DocPaper } from "@/components/doc-paper"

export default function CategoriesApiDocs() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Categories API Documentation</h1>

      {/* Overview Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The Categories API allows you to manage product categories in the grocery management system. Categories are
          used to organize products and help customers navigate the product catalog.
        </p>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Base URL</h3>
          <CodeBlock language="plaintext">https://api.groceryapp.com</CodeBlock>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Authentication</h3>
          <p>All API requests require authentication using a Bearer token in the Authorization header:</p>
          <CodeBlock language="plaintext">Authorization: Bearer YOUR_API_TOKEN</CodeBlock>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Rate Limiting</h3>
          <p>
            Requests are limited to 100 per minute per API token. If you exceed this limit, you will receive a 429 Too
            Many Requests response.
          </p>
        </div>
      </DocPaper>

      {/* Endpoints Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>

        {/* List Categories */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">List Categories</h3>
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/categories</span>
          </div>
          <p className="mb-3">Returns a list of all categories. Results can be filtered and paginated.</p>
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
                  <td className="border p-2">integer</td>
                  <td className="border p-2">Page number for pagination (default: 1)</td>
                </tr>
                <tr>
                  <td className="border p-2">limit</td>
                  <td className="border p-2">integer</td>
                  <td className="border p-2">Number of items per page (default: 20, max: 100)</td>
                </tr>
                <tr>
                  <td className="border p-2">parent_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Filter by parent category ID</td>
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
    "categories": [
      {
        "id": "cat_123456",
        "name": "Fruits & Vegetables",
        "slug": "fruits-vegetables",
        "description": "Fresh fruits and vegetables",
        "parent_id": null,
        "image_url": "https://example.com/images/categories/fruits-vegetables.jpg",
        "is_active": true,
        "product_count": 156,
        "created_at": "2023-01-15T08:30:00Z",
        "updated_at": "2023-06-22T14:15:30Z"
      },
      {
        "id": "cat_789012",
        "name": "Dairy & Eggs",
        "slug": "dairy-eggs",
        "description": "Milk, cheese, yogurt, and eggs",
        "parent_id": null,
        "image_url": "https://example.com/images/categories/dairy-eggs.jpg",
        "is_active": true,
        "product_count": 87,
        "created_at": "2023-01-15T09:15:00Z",
        "updated_at": "2023-05-18T11:20:45Z"
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

        {/* Get Category by ID */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get Category by ID</h3>
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/categories/{"{category_id}"}</span>
          </div>
          <p className="mb-3">Returns detailed information about a specific category.</p>
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
                  <td className="border p-2">category_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the category</td>
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
    "id": "cat_123456",
    "name": "Fruits & Vegetables",
    "slug": "fruits-vegetables",
    "description": "Fresh fruits and vegetables",
    "parent_id": null,
    "image_url": "https://example.com/images/categories/fruits-vegetables.jpg",
    "is_active": true,
    "product_count": 156,
    "subcategories": [
      {
        "id": "cat_123457",
        "name": "Fresh Fruits",
        "slug": "fresh-fruits",
        "description": "All types of fresh fruits",
        "parent_id": "cat_123456",
        "image_url": "https://example.com/images/categories/fresh-fruits.jpg",
        "is_active": true,
        "product_count": 78
      },
      {
        "id": "cat_123458",
        "name": "Fresh Vegetables",
        "slug": "fresh-vegetables",
        "description": "All types of fresh vegetables",
        "parent_id": "cat_123456",
        "image_url": "https://example.com/images/categories/fresh-vegetables.jpg",
        "is_active": true,
        "product_count": 78
      }
    ],
    "created_at": "2023-01-15T08:30:00Z",
    "updated_at": "2023-06-22T14:15:30Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Create Category */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Create Category</h3>
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono">POST</span>
            <span className="font-mono">/api/categories</span>
          </div>
          <p className="mb-3">Creates a new product category.</p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "name": "Organic Products",
  "slug": "organic-products",
  "description": "Certified organic fruits, vegetables, and groceries",
  "parent_id": null,
  "image_url": "https://example.com/images/categories/organic-products.jpg",
  "is_active": true
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "id": "cat_345678",
    "name": "Organic Products",
    "slug": "organic-products",
    "description": "Certified organic fruits, vegetables, and groceries",
    "parent_id": null,
    "image_url": "https://example.com/images/categories/organic-products.jpg",
    "is_active": true,
    "product_count": 0,
    "created_at": "2023-07-10T15:45:22Z",
    "updated_at": "2023-07-10T15:45:22Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Update Category */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Update Category</h3>
          <div className="mb-3">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono">PUT</span>
            <span className="font-mono">/api/categories/{"{category_id}"}</span>
          </div>
          <p className="mb-3">Updates an existing category.</p>
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
                  <td className="border p-2">category_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the category</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "name": "Organic & Natural Products",
  "description": "Certified organic and natural fruits, vegetables, and groceries",
  "is_active": true
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "id": "cat_345678",
    "name": "Organic & Natural Products",
    "slug": "organic-products",
    "description": "Certified organic and natural fruits, vegetables, and groceries",
    "parent_id": null,
    "image_url": "https://example.com/images/categories/organic-products.jpg",
    "is_active": true,
    "product_count": 0,
    "created_at": "2023-07-10T15:45:22Z",
    "updated_at": "2023-07-10T16:30:15Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Delete Category */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Delete Category</h3>
          <div className="mb-3">
            <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 font-mono">DELETE</span>
            <span className="font-mono">/api/categories/{"{category_id}"}</span>
          </div>
          <p className="mb-3">
            Deletes a category. This operation is only allowed if the category has no products and no subcategories.
          </p>
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
                  <td className="border p-2">category_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the category</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "message": "Category deleted successfully"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get Products by Category */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get Products by Category</h3>
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/categories/{"{category_id}"}/products</span>
          </div>
          <p className="mb-3">Returns all products belonging to a specific category.</p>
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
                  <td className="border p-2">category_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the category</td>
                </tr>
              </tbody>
            </table>
          </div>
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
                  <td className="border p-2">integer</td>
                  <td className="border p-2">Page number for pagination (default: 1)</td>
                </tr>
                <tr>
                  <td className="border p-2">limit</td>
                  <td className="border p-2">integer</td>
                  <td className="border p-2">Number of items per page (default: 20, max: 100)</td>
                </tr>
                <tr>
                  <td className="border p-2">sort</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sort field and direction (e.g., "price:asc", "name:desc")</td>
                </tr>
                <tr>
                  <td className="border p-2">include_subcategories</td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2">Include products from subcategories (default: false)</td>
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
    "products": [
      {
        "id": "prod_123456",
        "name": "Organic Bananas",
        "description": "Fresh organic bananas",
        "price": 1.99,
        "sale_price": null,
        "sku": "ORG-BAN-001",
        "stock_quantity": 150,
        "category_id": "cat_345678",
        "image_url": "https://example.com/images/products/organic-bananas.jpg",
        "is_active": true,
        "created_at": "2023-07-11T09:30:00Z",
        "updated_at": "2023-07-11T09:30:00Z"
      },
      {
        "id": "prod_123457",
        "name": "Organic Apples",
        "description": "Fresh organic apples",
        "price": 2.49,
        "sale_price": 1.99,
        "sku": "ORG-APP-001",
        "stock_quantity": 120,
        "category_id": "cat_345678",
        "image_url": "https://example.com/images/products/organic-apples.jpg",
        "is_active": true,
        "created_at": "2023-07-11T09:35:00Z",
        "updated_at": "2023-07-11T09:35:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}`}
            </CodeBlock>
          </div>
        </div>
      </DocPaper>

      {/* Models Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Models</h2>

        {/* Category Model */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Category</h3>
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
                <td className="border p-2">Unique identifier for the category</td>
              </tr>
              <tr>
                <td className="border p-2">name</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Name of the category</td>
              </tr>
              <tr>
                <td className="border p-2">slug</td>
                <td className="border p-2">string</td>
                <td className="border p-2">URL-friendly version of the name</td>
              </tr>
              <tr>
                <td className="border p-2">description</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Description of the category</td>
              </tr>
              <tr>
                <td className="border p-2">parent_id</td>
                <td className="border p-2">string | null</td>
                <td className="border p-2">ID of the parent category, null if it's a top-level category</td>
              </tr>
              <tr>
                <td className="border p-2">image_url</td>
                <td className="border p-2">string | null</td>
                <td className="border p-2">URL to the category image</td>
              </tr>
              <tr>
                <td className="border p-2">is_active</td>
                <td className="border p-2">boolean</td>
                <td className="border p-2">Whether the category is active</td>
              </tr>
              <tr>
                <td className="border p-2">product_count</td>
                <td className="border p-2">integer</td>
                <td className="border p-2">Number of products in this category</td>
              </tr>
              <tr>
                <td className="border p-2">subcategories</td>
                <td className="border p-2">array</td>
                <td className="border p-2">List of subcategories (only in detailed view)</td>
              </tr>
              <tr>
                <td className="border p-2">created_at</td>
                <td className="border p-2">string (ISO date)</td>
                <td className="border p-2">When the category was created</td>
              </tr>
              <tr>
                <td className="border p-2">updated_at</td>
                <td className="border p-2">string (ISO date)</td>
                <td className="border p-2">When the category was last updated</td>
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
            {`// Get all categories
async function getCategories() {
  const response = await fetch('https://api.groceryapp.com/api/categories', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
}

// Create a new category
async function createCategory(categoryData) {
  const response = await fetch('https://api.groceryapp.com/api/categories', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(categoryData)
  });
  
  const data = await response.json();
  return data;
}

// Get products in a category
async function getProductsByCategory(categoryId, includeSubcategories = false) {
  const url = \`https://api.groceryapp.com/api/categories/\${categoryId}/products?include_subcategories=\${includeSubcategories}\`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
}`}
          </CodeBlock>
        </div>

        {/* cURL Example */}
        <div>
          <h3 className="text-xl font-medium mb-3">cURL</h3>
          <CodeBlock language="bash">
            {`# Get all categories
curl -X GET \\
  https://api.groceryapp.com/api/categories \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json'

# Create a new category
curl -X POST \\
  https://api.groceryapp.com/api/categories \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Organic Products",
    "slug": "organic-products",
    "description": "Certified organic fruits, vegetables, and groceries",
    "parent_id": null,
    "image_url": "https://example.com/images/categories/organic-products.jpg",
    "is_active": true
  }'

# Get products in a category
curl -X GET \\
  'https://api.groceryapp.com/api/categories/cat_345678/products?include_subcategories=true' \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json'`}
          </CodeBlock>
        </div>
      </DocPaper>

      {/* Errors Section */}
      <DocPaper>
        <h2 className="text-2xl font-semibold mb-6">Errors</h2>
        <p className="mb-4">
          The API uses conventional HTTP response codes to indicate the success or failure of an API request.
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
    "code": "category_not_empty",
    "message": "Cannot delete category that contains products or subcategories",
    "details": {
      "product_count": 45,
      "subcategory_count": 2
    }
  }
}`}
          </CodeBlock>
        </div>
      </DocPaper>
    </div>
  )
}
