import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeBlock } from "@/components/code-block"

export default function AddressesApiDocs() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>User Addresses API</CardTitle>
        <CardDescription>Endpoints for managing user delivery and billing addresses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Overview</h2>
          <p className="mb-4">
            The User Addresses API allows users to manage their delivery and billing addresses. Users can create, read,
            update, and delete addresses, as well as set a default address for quicker checkout.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Endpoints</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">GET /api/users/addresses</h3>
            <p className="mb-2">Get all addresses for the authenticated user</p>
            <p className="mb-2">
              <span className="font-semibold">Authentication:</span> Required
            </p>
            <p className="mb-2">
              <span className="font-semibold">Response:</span>
            </p>
            <CodeBlock language="json">
              {`[
 {
   "id": "uuid",
   "user_id": "uuid",
   "address_type": "home",
   "is_default": true,
   "name": "John Doe",
   "address_line1": "123 Main St",
   "address_line2": "Apt 4B",
   "city": "New York",
   "state": "NY",
   "postal_code": "10001",
   "country": "USA",
   "phone": "+1234567890",
   "landmark": "Near Central Park",
   "created_at": "2023-04-01T12:00:00Z",
   "updated_at": "2023-04-01T12:00:00Z"
 }
]`}
            </CodeBlock>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">POST /api/users/addresses</h3>
            <p className="mb-2">Create a new address for the authenticated user</p>
            <p className="mb-2">
              <span className="font-semibold">Authentication:</span> Required
            </p>
            <p className="mb-2">
              <span className="font-semibold">Request Body:</span>
            </p>
            <CodeBlock language="json">
              {`{
 "address_type": "home",
 "is_default": true,
 "name": "John Doe",
 "address_line1": "123 Main St",
 "address_line2": "Apt 4B",
 "city": "New York",
 "state": "NY",
 "postal_code": "10001",
 "country": "USA",
 "phone": "+1234567890",
 "landmark": "Near Central Park"
}`}
            </CodeBlock>
            <p className="mb-2">
              <span className="font-semibold">Response:</span>
            </p>
            <CodeBlock language="json">
              {`{
 "id": "uuid",
 "user_id": "uuid",
 "address_type": "home",
 "is_default": true,
 "name": "John Doe",
 "address_line1": "123 Main St",
 "address_line2": "Apt 4B",
 "city": "New York",
 "state": "NY",
 "postal_code": "10001",
 "country": "USA",
 "phone": "+1234567890",
 "landmark": "Near Central Park",
 "created_at": "2023-04-01T12:00:00Z",
 "updated_at": "2023-04-01T12:00:00Z"}`}
            </CodeBlock>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">GET /api/users/addresses/[id]</h3>
            <p className="mb-2">Get a specific address by ID</p>
            <p className="mb-2">
              <span className="font-semibold">Authentication:</span> Required
            </p>
            <p className="mb-2">
              <span className="font-semibold">Response:</span>
            </p>
            <CodeBlock language="json">
              {`{
 "id": "uuid",
 "user_id": "uuid",
 "address_type": "home",
 "is_default": true,
 "name": "John Doe",
 "address_line1": "123 Main St",
 "address_line2": "Apt 4B",
 "city": "New York",
 "state": "NY",
 "postal_code": "10001",
 "country": "USA",
 "phone": "+1234567890",
 "landmark": "Near Central Park",
 "created_at": "2023-04-01T12:00:00Z",
 "updated_at": "2023-04-01T12:00:00Z"}`}
            </CodeBlock>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">PUT /api/users/addresses/[id]</h3>
            <p className="mb-2">Update a specific address</p>
            <p className="mb-2">
              <span className="font-semibold">Authentication:</span> Required
            </p>
            <p className="mb-2">
              <span className="font-semibold">Request Body:</span>
            </p>
            <CodeBlock language="json">
              {`{
 "address_type": "work",
 "is_default": true,
 "name": "John Doe",
 "address_line1": "456 Business Ave",
 "address_line2": "Suite 100",
 "city": "New York",
 "state": "NY",
 "postal_code": "10002",
 "country": "USA",
 "phone": "+1234567890",
 "landmark": "Near Times Square"
}`}
            </CodeBlock>
            <p className="mb-2">
              <span className="font-semibold">Response:</span>
            </p>
            <CodeBlock language="json">
              {`{
 "id": "uuid",
 "user_id": "uuid",
 "address_type": "work",
 "is_default": true,
 "name": "John Doe",
 "address_line1": "456 Business Ave",
 "address_line2": "Suite 100",
 "city": "New York",
 "state": "NY",
 "postal_code": "10002",
 "country": "USA",
 "phone": "+1234567890",
 "landmark": "Near Times Square",
 "created_at": "2023-04-01T12:00:00Z",
 "updated_at": "2023-04-01T13:00:00Z"}`}
            </CodeBlock>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">DELETE /api/users/addresses/[id]</h3>
            <p className="mb-2">Delete a specific address</p>
            <p className="mb-2">
              <span className="font-semibold">Authentication:</span> Required
            </p>
            <p className="mb-2">
              <span className="font-semibold">Response:</span>
            </p>
            <CodeBlock language="json">
              {`{
 "message": "Address deleted successfully"
}`}
            </CodeBlock>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">PATCH /api/users/addresses/[id]/default</h3>
            <p className="mb-2">Set an address as default</p>
            <p className="mb-2">
              <span className="font-semibold">Authentication:</span> Required
            </p>
            <p className="mb-2">
              <span className="font-semibold">Response:</span>
            </p>
            <CodeBlock language="json">
              {`{
 "id": "uuid",
 "user_id": "uuid",
 "address_type": "home",
 "is_default": true,
 "name": "John Doe",
 "address_line1": "123 Main St",
 "address_line2": "Apt 4B",
 "city": "New York",
 "state": "NY",
 "postal_code": "10001",
 "country": "USA",
 "phone": "+1234567890",
 "landmark": "Near Central Park",
 "created_at": "2023-04-01T12:00:00Z",
 "updated_at": "2023-04-01T14:00:00Z"}`}
            </CodeBlock>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Models</h2>
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">Field</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">id</td>
                <td className="border p-2">UUID</td>
                <td className="border p-2">Unique identifier for the address</td>
              </tr>
              <tr>
                <td className="border p-2">user_id</td>
                <td className="border p-2">UUID</td>
                <td className="border p-2">ID of the user who owns this address</td>
              </tr>
              <tr>
                <td className="border p-2">address_type</td>
                <td className="border p-2">String</td>
                <td className="border p-2">Type of address (home, work, other)</td>
              </tr>
              <tr>
                <td className="border p-2">is_default</td>
                <td className="border p-2">Boolean</td>
                <td className="border p-2">Whether this is the user's default address</td>
              </tr>
              <tr>
                <td className="border p-2">name</td>
                <td className="border p-2">String</td>
                <td className="border p-2">Name associated with this address</td>
              </tr>
              <tr>
                <td className="border p-2">address_line1</td>
                <td className="border p-2">String</td>
                <td className="border p-2">First line of the address</td>
              </tr>
              <tr>
                <td className="border p-2">address_line2</td>
                <td className="border p-2">String (optional)</td>
                <td className="border p-2">Second line of the address</td>
              </tr>
              <tr>
                <td className="border p-2">city</td>
                <td className="border p-2">String</td>
                <td className="border p-2">City</td>
              </tr>
              <tr>
                <td className="border p-2">state</td>
                <td className="border p-2">String</td>
                <td className="border p-2">State or province</td>
              </tr>
              <tr>
                <td className="border p-2">postal_code</td>
                <td className="border p-2">String</td>
                <td className="border p-2">Postal or ZIP code</td>
              </tr>
              <tr>
                <td className="border p-2">country</td>
                <td className="border p-2">String</td>
                <td className="border p-2">Country</td>
              </tr>
              <tr>
                <td className="border p-2">phone</td>
                <td className="border p-2">String (optional)</td>
                <td className="border p-2">Contact phone number for this address</td>
              </tr>
              <tr>
                <td className="border p-2">landmark</td>
                <td className="border p-2">String (optional)</td>
                <td className="border p-2">Nearby landmark to help with delivery</td>
              </tr>
              <tr>
                <td className="border p-2">created_at</td>
                <td className="border p-2">Timestamp</td>
                <td className="border p-2">When the address was created</td>
              </tr>
              <tr>
                <td className="border p-2">updated_at</td>
                <td className="border p-2">Timestamp</td>
                <td className="border p-2">When the address was last updated</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Examples</h2>
          <h3 className="text-lg font-semibold mb-2">Creating a new address</h3>
          <CodeBlock language="javascript">
            {`// Example using fetch API
async function createAddress() {
 const response = await fetch('/api/users/addresses', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
   },
   body: JSON.stringify({
     address_type: 'home',
     name: 'John Doe',
     address_line1: '123 Main St',
     address_line2: 'Apt 4B',
     city: 'New York',
     state: 'NY',
     postal_code: '10001',
     country: 'USA',
     phone': '+1234567890',
     landmark: 'Near Central Park',
     is_default: true
   })
 });
 
 const data = await response.json();
 console.log('New address created:', data);
}`}
          </CodeBlock>

          <h3 className="text-lg font-semibold mb-2 mt-4">Setting an address as default</h3>
          <CodeBlock language="javascript">
            {`// Example using fetch API
async function setDefaultAddress(addressId) {
 const response = await fetch(\`/api/users/addresses/\${addressId}/default\`, {
   method: 'PATCH',
   headers: {
     'Content-Type': 'application/json',
     'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
   }
 });
 
 const data = await response.json();
 console.log('Address set as default:', data);
}`}
          </CodeBlock>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Errors</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">Status Code</th>
                <th className="border p-2 text-left">Error Message</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">400</td>
                <td className="border p-2">Missing required fields</td>
                <td className="border p-2">One or more required fields are missing from the request</td>
              </tr>
              <tr>
                <td className="border p-2">400</td>
                <td className="border p-2">Invalid address type</td>
                <td className="border p-2">The address type must be one of: home, work, other</td>
              </tr>
              <tr>
                <td className="border p-2">401</td>
                <td className="border p-2">Unauthorized</td>
                <td className="border p-2">Authentication is required or the provided token is invalid</td>
              </tr>
              <tr>
                <td className="border p-2">404</td>
                <td className="border p-2">Address not found</td>
                <td className="border p-2">The requested address does not exist or does not belong to the user</td>
              </tr>
              <tr>
                <td className="border p-2">500</td>
                <td className="border p-2">Error processing request</td>
                <td className="border p-2">An unexpected server error occurred</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Notes</h2>
          <ul className="list-disc pl-5 text-sm">
            <li className="mb-2">Users can only access and modify their own addresses</li>
            <li className="mb-2">When setting an address as default, any other default address will be unset</li>
            <li className="mb-2">
              The <code>address_type</code> field accepts values: "home", "work", or "other"
            </li>
            <li className="mb-2">All endpoints require authentication</li>
            <li className="mb-2">
              The <code>is_default</code> flag can be used to mark preferred addresses for delivery or billing
            </li>
            <li className="mb-2">
              If a user deletes their default address, the most recently created address will become the new default
            </li>
            <li className="mb-2">
              The first address created for a user will automatically be set as the default address
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
