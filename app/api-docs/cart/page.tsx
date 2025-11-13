import { DocPaper } from "@/components/doc-paper"
import { CodeBlock } from "@/components/code-block"

export default function CartApiDocs() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cart API</h1>

      <DocPaper title="Overview">
        <p>
          The Cart API allows users to manage their shopping cart. Users can add products to their cart, update
          quantities, remove items, and proceed to checkout.
        </p>
      </DocPaper>

      <DocPaper title="Endpoints">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Get Cart</h3>
            <p className="text-sm text-gray-600 mb-2">Retrieves the current user's cart</p>
            <CodeBlock>GET /api/cart</CodeBlock>
            <p className="mt-2">Response:</p>
            <CodeBlock>{`{
  "cart_id": "uuid",
  "user_id": "uuid",
  "items": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "product_name": "Organic Apples",
      "quantity": 2,
      "price": 3.99,
      "total_price": 7.98,
      "image_url": "/images/products/apples.jpg"
    }
  ],
  "subtotal": 7.98,
  "tax": 0.64,
  "total": 8.62,
  "created_at": "2023-06-15T10:30:00Z",
  "updated_at": "2023-06-15T10:30:00Z"
}`}</CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Add Item to Cart</h3>
            <p className="text-sm text-gray-600 mb-2">Adds a product to the user's cart</p>
            <CodeBlock>POST /api/cart/items</CodeBlock>
            <p className="mt-2">Request Body:</p>
            <CodeBlock>{`{
  "product_id": "uuid",
  "quantity": 1
}`}</CodeBlock>
            <p className="mt-2">Response:</p>
            <CodeBlock>{`{
  "success": true,
  "message": "Item added to cart",
  "cart_item": {
    "id": "uuid",
    "product_id": "uuid",
    "product_name": "Organic Apples",
    "quantity": 1,
    "price": 3.99,
    "total_price": 3.99,
    "image_url": "/images/products/apples.jpg"
  },
  "cart": {
    "subtotal": 3.99,
    "tax": 0.32,
    "total": 4.31
  }
}`}</CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Update Cart Item</h3>
            <p className="text-sm text-gray-600 mb-2">Updates the quantity of an item in the cart</p>
            <CodeBlock>PUT /api/cart/items/{"{item_id}"}</CodeBlock>
            <p className="mt-2">Request Body:</p>
            <CodeBlock>{`{
  "quantity": 3
}`}</CodeBlock>
            <p className="mt-2">Response:</p>
            <CodeBlock>{`{
  "success": true,
  "message": "Cart item updated",
  "cart_item": {
    "id": "uuid",
    "product_id": "uuid",
    "product_name": "Organic Apples",
    "quantity": 3,
    "price": 3.99,
    "total_price": 11.97,
    "image_url": "/images/products/apples.jpg"
  },
  "cart": {
    "subtotal": 11.97,
    "tax": 0.96,
    "total": 12.93
  }
}`}</CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Remove Item from Cart</h3>
            <p className="text-sm text-gray-600 mb-2">Removes an item from the cart</p>
            <CodeBlock>DELETE /api/cart/items/{"{item_id}"}</CodeBlock>
            <p className="mt-2">Response:</p>
            <CodeBlock>{`{
  "success": true,
  "message": "Item removed from cart",
  "cart": {
    "subtotal": 0,
    "tax": 0,
    "total": 0
  }
}`}</CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Clear Cart</h3>
            <p className="text-sm text-gray-600 mb-2">Removes all items from the cart</p>
            <CodeBlock>DELETE /api/cart</CodeBlock>
            <p className="mt-2">Response:</p>
            <CodeBlock>{`{
  "success": true,
  "message": "Cart cleared"
}`}</CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Checkout</h3>
            <p className="text-sm text-gray-600 mb-2">Converts the cart to an order</p>
            <CodeBlock>POST /api/cart/checkout</CodeBlock>
            <p className="mt-2">Request Body:</p>
            <CodeBlock>{`{
  "shipping_address_id": "uuid",
  "payment_method_id": "uuid",
  "notes": "Please leave at the front door"
}`}</CodeBlock>
            <p className="mt-2">Response:</p>
            <CodeBlock>{`{
  "success": true,
  "message": "Checkout successful",
  "order_id": "uuid",
  "order": {
    "id": "uuid",
    "user_id": "uuid",
    "status": "pending",
    "subtotal": 11.97,
    "tax": 0.96,
    "shipping": 5.00,
    "total": 17.93,
    "created_at": "2023-06-15T10:45:00Z"
  }
}`}</CodeBlock>
          </div>
        </div>
      </DocPaper>

      <DocPaper title="Models">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Cart</h3>
            <CodeBlock>{`{
  "cart_id": "uuid",
  "user_id": "uuid",
  "items": CartItem[],
  "subtotal": number,
  "tax": number,
  "total": number,
  "created_at": string,
  "updated_at": string
}`}</CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Cart Item</h3>
            <CodeBlock>{`{
  "id": "uuid",
  "product_id": "uuid",
  "product_name": string,
  "quantity": number,
  "price": number,
  "total_price": number,
  "image_url": string
}`}</CodeBlock>
          </div>
        </div>
      </DocPaper>

      <DocPaper title="Examples">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">JavaScript Example</h3>
            <p className="mb-2">Example of adding an item to the cart and then checking out:</p>
            <CodeBlock>{`// Add item to cart
const addToCart = async (productId, quantity) => {
  try {
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${userToken}\`
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add item to cart');
    }
    
    return data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

// Checkout
const checkout = async (shippingAddressId, paymentMethodId, notes) => {
  try {
    const response = await fetch('/api/cart/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${userToken}\`
      },
      body: JSON.stringify({
        shipping_address_id: shippingAddressId,
        payment_method_id: paymentMethodId,
        notes: notes
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Checkout failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};`}</CodeBlock>
          </div>
        </div>
      </DocPaper>

      <DocPaper title="Errors">
        <div className="space-y-4">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Status Code</th>
                <th className="px-4 py-2 text-left">Error Code</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">400</td>
                <td className="border px-4 py-2">INVALID_REQUEST</td>
                <td className="border px-4 py-2">The request body is invalid or missing required fields</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">401</td>
                <td className="border px-4 py-2">UNAUTHORIZED</td>
                <td className="border px-4 py-2">Authentication is required or the provided token is invalid</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">404</td>
                <td className="border px-4 py-2">CART_ITEM_NOT_FOUND</td>
                <td className="border px-4 py-2">The requested cart item does not exist</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">404</td>
                <td className="border px-4 py-2">PRODUCT_NOT_FOUND</td>
                <td className="border px-4 py-2">The requested product does not exist</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">409</td>
                <td className="border px-4 py-2">PRODUCT_OUT_OF_STOCK</td>
                <td className="border px-4 py-2">The requested product is out of stock</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">422</td>
                <td className="border px-4 py-2">INVALID_QUANTITY</td>
                <td className="border px-4 py-2">The requested quantity is invalid or exceeds available stock</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">500</td>
                <td className="border px-4 py-2">SERVER_ERROR</td>
                <td className="border px-4 py-2">An unexpected error occurred on the server</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocPaper>
    </div>
  )
}
