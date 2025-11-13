import { CodeBlock } from "@/components/code-block"
import { DocPaper } from "@/components/doc-paper"

export default function ProductsApiDocs() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Products API Documentation</h1>

      {/* Overview Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The Products API allows you to manage product information in the grocery management system. You can list,
          create, update, and delete products, as well as manage product inventory, pricing, and categories.
        </p>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Base URL</h3>
          <CodeBlock language="plaintext">https://api.groceryapp.com/api</CodeBlock>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Authentication</h3>
          <p>All API requests require authentication using a Bearer token in the Authorization header.</p>
          <CodeBlock language="plaintext">Authorization: Bearer {"{your_access_token}"}</CodeBlock>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Rate Limiting</h3>
          <p>
            API requests are limited to 100 requests per minute per user. If you exceed this limit, you will receive a
            429 Too Many Requests response.
          </p>
        </div>
      </DocPaper>

      {/* Endpoints Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>

        {/* List Products */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">List Products</h3>
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 font-medium px-2 py-1 rounded mr-2">GET</span>
            <code>/api/products</code>
          </div>
          <p className="mb-3">
            Returns a paginated list of products. You can filter products by category, availability, and search terms.
          </p>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Query Parameters</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Parameter</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Required</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">page</td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Page number (default: 1)</td>
                </tr>
                <tr>
                  <td className="border p-2">limit</td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Items per page (default: 20, max: 100)</td>
                </tr>
                <tr>
                  <td className="border p-2">category_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Filter by category ID</td>
                </tr>
                <tr>
                  <td className="border p-2">in_stock</td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Filter by stock availability</td>
                </tr>
                <tr>
                  <td className="border p-2">search</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Search term for product name or description</td>
                </tr>
                <tr>
                  <td className="border p-2">sort</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Sort field (name, price, created_at)</td>
                </tr>
                <tr>
                  <td className="border p-2">order</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Sort order (asc, desc)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123456",
        "name": "Organic Bananas",
        "description": "Fresh organic bananas from Ecuador",
        "price": 2.99,
        "sale_price": 2.49,
        "sku": "ORG-BAN-001",
        "barcode": "9876543210123",
        "category_id": "cat_fruits",
        "brand": "Nature's Best",
        "stock_quantity": 150,
        "unit": "bunch",
        "weight": 1.2,
        "weight_unit": "kg",
        "is_featured": true,
        "is_active": true,
        "images": [
          {
            "id": "img_123",
            "url": "https://example.com/images/organic-bananas.jpg",
            "alt": "Organic Bananas",
            "is_primary": true
          }
        ],
        "tags": ["organic", "fruit", "fresh"],
        "created_at": "2023-05-15T10:30:00Z",
        "updated_at": "2023-05-20T14:15:00Z"
      },
      // More products...
    ],
    "pagination": {
      "total": 245,
      "page": 1,
      "limit": 20,
      "pages": 13
    }
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get Product by ID */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Get Product by ID</h3>
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 font-medium px-2 py-1 rounded mr-2">GET</span>
            <code>/api/products/{"{product_id}"}</code>
          </div>
          <p className="mb-3">Returns detailed information about a specific product.</p>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Path Parameters</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Parameter</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Required</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">product_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Unique identifier of the product</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "id": "prod_123456",
    "name": "Organic Bananas",
    "description": "Fresh organic bananas from Ecuador",
    "price": 2.99,
    "sale_price": 2.49,
    "sku": "ORG-BAN-001",
    "barcode": "9876543210123",
    "category_id": "cat_fruits",
    "category": {
      "id": "cat_fruits",
      "name": "Fruits",
      "slug": "fruits"
    },
    "brand": "Nature's Best",
    "stock_quantity": 150,
    "unit": "bunch",
    "weight": 1.2,
    "weight_unit": "kg",
    "is_featured": true,
    "is_active": true,
    "images": [
      {
        "id": "img_123",
        "url": "https://example.com/images/organic-bananas.jpg",
        "alt": "Organic Bananas",
        "is_primary": true
      },
      {
        "id": "img_124",
        "url": "https://example.com/images/organic-bananas-2.jpg",
        "alt": "Organic Bananas Side View",
        "is_primary": false
      }
    ],
    "tags": ["organic", "fruit", "fresh"],
    "nutrition_facts": {
      "serving_size": "1 banana (118g)",
      "calories": 105,
      "total_fat": "0.4g",
      "saturated_fat": "0.1g",
      "cholesterol": "0mg",
      "sodium": "1mg",
      "total_carbs": "27g",
      "dietary_fiber": "3.1g",
      "sugars": "14.4g",
      "protein": "1.3g"
    },
    "related_products": ["prod_789012", "prod_345678"],
    "created_at": "2023-05-15T10:30:00Z",
    "updated_at": "2023-05-20T14:15:00Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Create Product */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Create Product</h3>
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded mr-2">POST</span>
            <code>/api/products</code>
          </div>
          <p className="mb-3">Creates a new product in the system. Requires admin or manager role.</p>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "name": "Organic Apples",
  "description": "Fresh organic apples from Washington state",
  "price": 3.99,
  "sale_price": 3.49,
  "sku": "ORG-APP-001",
  "barcode": "9876543210124",
  "category_id": "cat_fruits",
  "brand": "Nature's Best",
  "stock_quantity": 200,
  "unit": "lb",
  "weight": 0.2,
  "weight_unit": "kg",
  "is_featured": false,
  "is_active": true,
  "images": [
    {
      "url": "https://example.com/images/organic-apples.jpg",
      "alt": "Organic Apples",
      "is_primary": true
    }
  ],
  "tags": ["organic", "fruit", "fresh"],
  "nutrition_facts": {
    "serving_size": "1 medium apple (182g)",
    "calories": 95,
    "total_fat": "0.3g",
    "saturated_fat": "0.1g",
    "cholesterol": "0mg",
    "sodium": "2mg",
    "total_carbs": "25g",
    "dietary_fiber": "4.4g",
    "sugars": "19g",
    "protein": "0.5g"
  }
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "id": "prod_789012",
    "name": "Organic Apples",
    "description": "Fresh organic apples from Washington state",
    "price": 3.99,
    "sale_price": 3.49,
    "sku": "ORG-APP-001",
    "barcode": "9876543210124",
    "category_id": "cat_fruits",
    "brand": "Nature's Best",
    "stock_quantity": 200,
    "unit": "lb",
    "weight": 0.2,
    "weight_unit": "kg",
    "is_featured": false,
    "is_active": true,
    "images": [
      {
        "id": "img_125",
        "url": "https://example.com/images/organic-apples.jpg",
        "alt": "Organic Apples",
        "is_primary": true
      }
    ],
    "tags": ["organic", "fruit", "fresh"],
    "nutrition_facts": {
      "serving_size": "1 medium apple (182g)",
      "calories": 95,
      "total_fat": "0.3g",
      "saturated_fat": "0.1g",
      "cholesterol": "0mg",
      "sodium": "2mg",
      "total_carbs": "25g",
      "dietary_fiber": "4.4g",
      "sugars": "19g",
      "protein": "0.5g"
    },
    "created_at": "2023-06-01T09:45:00Z",
    "updated_at": "2023-06-01T09:45:00Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Update Product */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Update Product</h3>
          <div className="mb-3">
            <span className="inline-block bg-yellow-100 text-yellow-800 font-medium px-2 py-1 rounded mr-2">PUT</span>
            <code>/api/products/{"{product_id}"}</code>
          </div>
          <p className="mb-3">Updates an existing product. Requires admin or manager role.</p>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Path Parameters</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Parameter</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Required</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">product_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Unique identifier of the product</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "name": "Organic Red Apples",
  "price": 4.29,
  "sale_price": 3.79,
  "stock_quantity": 180,
  "is_featured": true
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "id": "prod_789012",
    "name": "Organic Red Apples",
    "description": "Fresh organic apples from Washington state",
    "price": 4.29,
    "sale_price": 3.79,
    "sku": "ORG-APP-001",
    "barcode": "9876543210124",
    "category_id": "cat_fruits",
    "brand": "Nature's Best",
    "stock_quantity": 180,
    "unit": "lb",
    "weight": 0.2,
    "weight_unit": "kg",
    "is_featured": true,
    "is_active": true,
    "images": [
      {
        "id": "img_125",
        "url": "https://example.com/images/organic-apples.jpg",
        "alt": "Organic Apples",
        "is_primary": true
      }
    ],
    "tags": ["organic", "fruit", "fresh"],
    "updated_at": "2023-06-02T11:20:00Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Delete Product */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Delete Product</h3>
          <div className="mb-3">
            <span className="inline-block bg-red-100 text-red-800 font-medium px-2 py-1 rounded mr-2">DELETE</span>
            <code>/api/products/{"{product_id}"}</code>
          </div>
          <p className="mb-3">
            Deletes a product from the system. This is a soft delete that marks the product as inactive. Requires admin
            role.
          </p>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Path Parameters</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Parameter</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Required</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">product_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Unique identifier of the product</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "message": "Product successfully deleted"
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Update Product Stock */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Update Product Stock</h3>
          <div className="mb-3">
            <span className="inline-block bg-purple-100 text-purple-800 font-medium px-2 py-1 rounded mr-2">PATCH</span>
            <code>/api/products/{"{product_id}"}/stock</code>
          </div>
          <p className="mb-3">Updates the stock quantity of a product. Requires admin, manager, or inventory role.</p>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Path Parameters</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Parameter</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Required</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">product_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Unique identifier of the product</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
  "stock_quantity": 250,
  "operation": "set"  // Options: "set", "add", "subtract"
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "id": "prod_789012",
    "name": "Organic Red Apples",
    "stock_quantity": 250,
    "updated_at": "2023-06-03T14:30:00Z"
  }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get Product Reviews */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Get Product Reviews</h3>
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 font-medium px-2 py-1 rounded mr-2">GET</span>
            <code>/api/products/{"{product_id}"}/reviews</code>
          </div>
          <p className="mb-3">Returns a list of customer reviews for a specific product.</p>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Path Parameters</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Parameter</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Required</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">product_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Unique identifier of the product</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Query Parameters</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Parameter</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Required</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">page</td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Page number (default: 1)</td>
                </tr>
                <tr>
                  <td className="border p-2">limit</td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Items per page (default: 20, max: 50)</td>
                </tr>
                <tr>
                  <td className="border p-2">rating</td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Filter by rating (1-5)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev_123456",
        "product_id": "prod_789012",
        "user_id": "user_987654",
        "user_name": "John D.",
        "rating": 5,
        "title": "Great quality apples",
        "comment": "These apples are crisp, juicy, and delicious. Will buy again!",
        "images": [
          {
            "id": "img_rev_123",
            "url": "https://example.com/images/user-review-apple.jpg"
          }
        ],
        "verified_purchase": true,
        "helpful_votes": 12,
        "created_at": "2023-06-10T16:45:00Z"
      },
      // More reviews...
    ],
    "summary": {
      "average_rating": 4.7,
      "total_reviews": 42,
      "rating_distribution": {
        "5": 30,
        "4": 8,
        "3": 2,
        "2": 1,
        "1": 1
      }
    },
    "pagination": {
      "total": 42,
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

        {/* Product Model */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Product</h3>
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
                <td className="border p-2">Unique identifier for the product</td>
              </tr>
              <tr>
                <td className="border p-2">name</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Product name</td>
              </tr>
              <tr>
                <td className="border p-2">description</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Detailed product description</td>
              </tr>
              <tr>
                <td className="border p-2">price</td>
                <td className="border p-2">number</td>
                <td className="border p-2">Regular price of the product</td>
              </tr>
              <tr>
                <td className="border p-2">sale_price</td>
                <td className="border p-2">number | null</td>
                <td className="border p-2">Discounted price (if applicable)</td>
              </tr>
              <tr>
                <td className="border p-2">sku</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Stock keeping unit (unique product code)</td>
              </tr>
              <tr>
                <td className="border p-2">barcode</td>
                <td className="border p-2">string | null</td>
                <td className="border p-2">Product barcode (UPC, EAN, etc.)</td>
              </tr>
              <tr>
                <td className="border p-2">category_id</td>
                <td className="border p-2">string</td>
                <td className="border p-2">ID of the product category</td>
              </tr>
              <tr>
                <td className="border p-2">brand</td>
                <td className="border p-2">string | null</td>
                <td className="border p-2">Product brand name</td>
              </tr>
              <tr>
                <td className="border p-2">stock_quantity</td>
                <td className="border p-2">number</td>
                <td className="border p-2">Current stock quantity</td>
              </tr>
              <tr>
                <td className="border p-2">unit</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Unit of measurement (e.g., kg, lb, each)</td>
              </tr>
              <tr>
                <td className="border p-2">weight</td>
                <td className="border p-2">number | null</td>
                <td className="border p-2">Product weight</td>
              </tr>
              <tr>
                <td className="border p-2">weight_unit</td>
                <td className="border p-2">string | null</td>
                <td className="border p-2">Unit of weight (e.g., kg, g, lb, oz)</td>
              </tr>
              <tr>
                <td className="border p-2">is_featured</td>
                <td className="border p-2">boolean</td>
                <td className="border p-2">Whether the product is featured</td>
              </tr>
              <tr>
                <td className="border p-2">is_active</td>
                <td className="border p-2">boolean</td>
                <td className="border p-2">Whether the product is active and visible</td>
              </tr>
              <tr>
                <td className="border p-2">images</td>
                <td className="border p-2">array</td>
                <td className="border p-2">Array of product images</td>
              </tr>
              <tr>
                <td className="border p-2">tags</td>
                <td className="border p-2">array</td>
                <td className="border p-2">Array of product tags</td>
              </tr>
              <tr>
                <td className="border p-2">nutrition_facts</td>
                <td className="border p-2">object | null</td>
                <td className="border p-2">Nutritional information</td>
              </tr>
              <tr>
                <td className="border p-2">created_at</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Creation timestamp (ISO 8601)</td>
              </tr>
              <tr>
                <td className="border p-2">updated_at</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Last update timestamp (ISO 8601)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Product Image Model */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Product Image</h3>
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
                <td className="border p-2">Unique identifier for the image</td>
              </tr>
              <tr>
                <td className="border p-2">url</td>
                <td className="border p-2">string</td>
                <td className="border p-2">URL of the image</td>
              </tr>
              <tr>
                <td className="border p-2">alt</td>
                <td className="border p-2">string | null</td>
                <td className="border p-2">Alternative text for the image</td>
              </tr>
              <tr>
                <td className="border p-2">is_primary</td>
                <td className="border p-2">boolean</td>
                <td className="border p-2">Whether this is the primary product image</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Product Review Model */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Product Review</h3>
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
                <td className="border p-2">Unique identifier for the review</td>
              </tr>
              <tr>
                <td className="border p-2">product_id</td>
                <td className="border p-2">string</td>
                <td className="border p-2">ID of the reviewed product</td>
              </tr>
              <tr>
                <td className="border p-2">user_id</td>
                <td className="border p-2">string</td>
                <td className="border p-2">ID of the user who wrote the review</td>
              </tr>
              <tr>
                <td className="border p-2">user_name</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Display name of the reviewer</td>
              </tr>
              <tr>
                <td className="border p-2">rating</td>
                <td className="border p-2">number</td>
                <td className="border p-2">Rating from 1 to 5</td>
              </tr>
              <tr>
                <td className="border p-2">title</td>
                <td className="border p-2">string | null</td>
                <td className="border p-2">Review title</td>
              </tr>
              <tr>
                <td className="border p-2">comment</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Review content</td>
              </tr>
              <tr>
                <td className="border p-2">images</td>
                <td className="border p-2">array</td>
                <td className="border p-2">Images attached to the review</td>
              </tr>
              <tr>
                <td className="border p-2">verified_purchase</td>
                <td className="border p-2">boolean</td>
                <td className="border p-2">Whether the reviewer purchased the product</td>
              </tr>
              <tr>
                <td className="border p-2">helpful_votes</td>
                <td className="border p-2">number</td>
                <td className="border p-2">Number of users who found this review helpful</td>
              </tr>
              <tr>
                <td className="border p-2">created_at</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Creation timestamp (ISO 8601)</td>
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
          <h3 className="text-xl font-semibold mb-3">JavaScript</h3>
          <CodeBlock language="javascript">
            {`// Fetch products with filtering and pagination
async function fetchProducts() {
  try {
    const response = await fetch(
      'https://api.groceryapp.com/api/products?category_id=cat_fruits&in_stock=true&page=1&limit=20',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Products:', data.data.products);
      console.log('Pagination:', data.data.pagination);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

// Create a new product
async function createProduct(productData) {
  try {
    const response = await fetch('https://api.groceryapp.com/api/products', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Product created:', data.data);
      return data.data;
    } else {
      console.error('Error creating product:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Failed to create product:', error);
    return null;
  }
}

// Update product stock
async function updateProductStock(productId, quantity, operation = 'set') {
  try {
    const response = await fetch(
      \`https://api.groceryapp.com/api/products/\${productId}/stock\`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stock_quantity: quantity,
          operation: operation // 'set', 'add', or 'subtract'
        })
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Stock updated:', data.data);
      return data.data;
    } else {
      console.error('Error updating stock:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Failed to update stock:', error);
    return null;
  }
}`}
          </CodeBlock>
        </div>

        {/* cURL Example */}
        <div>
          <h3 className="text-xl font-semibold mb-3">cURL</h3>
          <CodeBlock language="bash">
            {`# List products
curl -X GET \\
  'https://api.groceryapp.com/api/products?category_id=cat_fruits&in_stock=true' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'

# Get product by ID
curl -X GET \\
  'https://api.groceryapp.com/api/products/prod_123456' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'

# Create product
curl -X POST \\
  'https://api.groceryapp.com/api/products' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Organic Apples",
    "description": "Fresh organic apples from Washington state",
    "price": 3.99,
    "sale_price": 3.49,
    "sku": "ORG-APP-001",
    "category_id": "cat_fruits",
    "brand": "Nature'\''s Best",
    "stock_quantity": 200,
    "unit": "lb",
    "is_active": true
  }'

# Update product
curl -X PUT \\
  'https://api.groceryapp.com/api/products/prod_789012' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Organic Red Apples",
    "price": 4.29,
    "sale_price": 3.79
  }'

# Update product stock
curl -X PATCH \\
  'https://api.groceryapp.com/api/products/prod_789012/stock' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "stock_quantity": 250,
    "operation": "set"
  }'

# Delete product
curl -X DELETE \\
  'https://api.groceryapp.com/api/products/prod_789012' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`}
          </CodeBlock>
        </div>
      </DocPaper>

      {/* Errors Section */}
      <DocPaper>
        <h2 className="text-2xl font-semibold mb-6">Errors</h2>
        <p className="mb-4">
          The Products API uses conventional HTTP response codes to indicate the success or failure of an API request.
          In general, codes in the 2xx range indicate success, codes in the 4xx range indicate an error that resulted
          from the provided information (e.g., a required parameter was missing), and codes in the 5xx range indicate an
          error with our servers.
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
              <td className="border p-2">The request was successful.</td>
            </tr>
            <tr>
              <td className="border p-2">201 - Created</td>
              <td className="border p-2">The resource was successfully created.</td>
            </tr>
            <tr>
              <td className="border p-2">400 - Bad Request</td>
              <td className="border p-2">The request was invalid or cannot be served.</td>
            </tr>
            <tr>
              <td className="border p-2">401 - Unauthorized</td>
              <td className="border p-2">Authentication failed or user doesn't have permissions.</td>
            </tr>
            <tr>
              <td className="border p-2">403 - Forbidden</td>
              <td className="border p-2">
                The request is understood, but it has been refused or access is not allowed.
              </td>
            </tr>
            <tr>
              <td className="border p-2">404 - Not Found</td>
              <td className="border p-2">The requested resource could not be found.</td>
            </tr>
            <tr>
              <td className="border p-2">409 - Conflict</td>
              <td className="border p-2">
                The request conflicts with the current state of the server (e.g., duplicate SKU).
              </td>
            </tr>
            <tr>
              <td className="border p-2">422 - Unprocessable Entity</td>
              <td className="border p-2">
                The request was well-formed but was unable to be followed due to semantic errors.
              </td>
            </tr>
            <tr>
              <td className="border p-2">429 - Too Many Requests</td>
              <td className="border p-2">Too many requests hit the API too quickly.</td>
            </tr>
            <tr>
              <td className="border p-2">500 - Internal Server Error</td>
              <td className="border p-2">Something went wrong on our end.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold mb-3">Error Response Format</h3>
        <CodeBlock language="json">
          {`{
  "success": false,
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": [
      {
        "field": "name",
        "message": "Product name is required"
      },
      {
        "field": "price",
        "message": "Price must be greater than 0"
      }
    ]
  }
}`}
        </CodeBlock>
      </DocPaper>
    </div>
  )
}
