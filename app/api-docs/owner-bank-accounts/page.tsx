import { CodeBlock } from "@/components/code-block"
import { DocPaper } from "@/components/doc-paper"

export default function OwnerBankAccountsApiDocs() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Owner Bank Accounts API Documentation</h1>

      {/* Overview Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The Owner Bank Accounts API allows management of bank account information for shop owners. This includes
          listing, creating, retrieving, updating, and deleting bank account records.
        </p>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Base URL</h3>
          <CodeBlock language="plaintext">https://api.groceryapp.com/api</CodeBlock>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Authentication</h3>
          <p>
            No authentication is required for these endpoints. They can be accessed directly from mobile applications
            including Flutter apps.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Rate Limiting</h3>
          <p>
            API requests are limited to 100 requests per minute per IP address. If you exceed this limit, you will
            receive a 429 Too Many Requests response.
          </p>
        </div>
      </DocPaper>

      {/* Endpoints Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>

        {/* List Owner Bank Accounts */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">List Owner Bank Accounts</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/owner-bank-accounts</span>
          </div>
          <p className="mb-3">Retrieves a list of all owner bank accounts for a given registration ID.</p>
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
                  <td className="border p-2">registration_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Filter by registration ID (required)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
 "owner_bank_accounts": [
   {
     "id": "bank_123456",
     "registration_id": "reg_789012",
     "account_holder_name": "John Doe",
     "account_number": "1234567890",
     "bank_name": "Bank of America",
     "branch_name": "Main Street",
     "ifsc_code": "BOFA1234567",
     "account_type": "savings",
     "is_primary": true,
     "created_at": "2023-06-15T10:30:00Z",
     "updated_at": "2023-06-15T10:30:00Z"
   },
   {
     "id": "bank_123457",
     "registration_id": "reg_789012",
     "account_holder_name": "John Doe",
     "account_number": "9876543210",
     "bank_name": "Chase Bank",
     "branch_name": "Downtown",
     "ifsc_code": "CHAS9876543",
     "account_type": "current",
     "is_primary": false,
     "created_at": "2023-06-16T14:20:00Z",
     "updated_at": "2023-06-16T14:20:00Z"
   }
 ]
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Get Owner Bank Account by ID */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Get Owner Bank Account by ID</h3>
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 font-mono">GET</span>
            <span className="font-mono">/api/owner-bank-accounts/{"{id}"}</span>
          </div>
          <p className="mb-3">Retrieves detailed information about a specific owner bank account.</p>
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
                  <td className="border p-2">id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the owner bank account</td>
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
   "id": "bank_123456",
   "registration_id": "reg_789012",
   "account_holder_name": "John Doe",
   "account_number": "1234567890",
   "bank_name": "Bank of America",
   "branch_name": "Main Street",
   "ifsc_code": "BOFA1234567",
   "account_type": "savings",
   "is_primary": true,
   "created_at": "2023-06-15T10:30:00Z",
   "updated_at": "2023-06-15T10:30:00Z"
 }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Create Owner Bank Account */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Create Owner Bank Account</h3>
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono">POST</span>
            <span className="font-mono">/api/owner-bank-accounts</span>
          </div>
          <p className="mb-3">
            Creates a new owner bank account. This endpoint can be accessed directly from mobile applications including
            Flutter apps.
          </p>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
 "registration_id": "reg_789012",
 "account_holder_name": "John Doe",
 "account_number": "1234567890",
 "bank_name": "Bank of America",
 "branch_name": "Main Street",
 "ifsc_code": "BOFA1234567",
 "account_type": "savings",
 "is_primary": true
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
 "success": true,
 "message": "Owner bank account created successfully",
 "data": {
   "id": "bank_123458",
   "registration_id": "reg_789012",
   "account_holder_name": "John Doe",
   "account_number": "1234567890",
   "bank_name": "Bank of America",
   "branch_name": "Main Street",
   "ifsc_code": "BOFA1234567",
   "account_type": "savings",
   "is_primary": true,
   "created_at": "2023-06-23T10:30:00Z",
   "updated_at": "2023-06-23T10:30:00Z"
 }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Update Owner Bank Account */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Update Owner Bank Account</h3>
          <div className="mb-3">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 font-mono">PATCH</span>
            <span className="font-mono">/api/owner-bank-accounts/{"{id}"}</span>
          </div>
          <p className="mb-3">Updates an existing owner bank account.</p>
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
                  <td className="border p-2">id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the owner bank account</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Request Body</h4>
            <CodeBlock language="json">
              {`{
 "account_holder_name": "John A. Doe",
 "account_number": "1234567890",
 "bank_name": "Bank of America",
 "branch_name": "Downtown",
 "ifsc_code": "BOFA1234567",
 "account_type": "savings",
 "is_primary": false
}`}
            </CodeBlock>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
 "success": true,
 "data": {
   "id": "bank_123457",
   "registration_id": "reg_789012",
   "account_holder_name": "John A. Doe",
   "account_number": "1234567890",
   "bank_name": "Bank of America",
   "branch_name": "Downtown",
   "ifsc_code": "BOFA1234567",
   "account_type": "savings",
   "is_primary": false,
   "created_at": "2023-06-16T14:20:00Z",
   "updated_at": "2023-06-23T11:00:00Z"
 }
}`}
            </CodeBlock>
          </div>
        </div>

        {/* Delete Owner Bank Account */}
        <div>
          <h3 className="text-xl font-medium mb-3">Delete Owner Bank Account</h3>
          <div className="mb-3">
            <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 font-mono">DELETE</span>
            <span className="font-mono">/api/owner-bank-accounts/{"{id}"}</span>
          </div>
          <p className="mb-3">Deletes an owner bank account.</p>
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
                  <td className="border p-2">id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Unique identifier of the owner bank account</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-3">
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <CodeBlock language="json">
              {`{
 "success": true,
 "message": "Owner bank account deleted successfully"
}`}
            </CodeBlock>
          </div>
        </div>
      </DocPaper>

      {/* Flutter Integration Section */}
      <DocPaper className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Flutter Integration</h2>
        <p className="mb-4">
          These endpoints are designed to be easily integrated with Flutter applications. Here's an example of how to
          create a bank account from a Flutter app:
        </p>
        <CodeBlock language="dart">
          {`import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> createBankAccount({
  required String registrationId,
  required String accountHolderName,
  required String accountNumber,
  required String bankName,
  required String branchName,
  required String ifscCode,
  required String accountType,
  bool isPrimary = false,
}) async {
  final url = Uri.parse('https://api.groceryapp.com/api/owner-bank-accounts');
  
  final httpResponse = await http.post(
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      'registration_id': registrationId,
      'account_holder_name': accountHolderName,
      'account_number': accountNumber,
      'bank_name': bankName,
      'branch_name': branchName,
      'ifsc_code': ifscCode,
      'account_type': accountType,
      'is_primary': isPrimary,
    }),
  );
  
  if (httpResponse.statusCode == 201) {
    return jsonDecode(httpResponse.body);
  } else {
    throw Exception('Failed to create bank account: \${httpResponse.body}');
  }
}`}
        </CodeBlock>
      </DocPaper>

      {/* Error Handling Section */}
      <DocPaper>
        <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
        <p className="mb-4">
          The API returns appropriate HTTP status codes along with error messages in case of failures.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Status Code</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Example Response</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">400</td>
              <td className="border p-2">Bad Request - Missing or invalid parameters</td>
              <td className="border p-2">
                <CodeBlock language="json">
                  {`{
  "success": false,
  "error": "Missing required field: registration_id"
}`}
                </CodeBlock>
              </td>
            </tr>
            <tr>
              <td className="border p-2">404</td>
              <td className="border p-2">Not Found - Resource not found</td>
              <td className="border p-2">
                <CodeBlock language="json">
                  {`{
  "success": false,
  "error": "Bank account not found"
}`}
                </CodeBlock>
              </td>
            </tr>
            <tr>
              <td className="border p-2">500</td>
              <td className="border p-2">Internal Server Error</td>
              <td className="border p-2">
                <CodeBlock language="json">
                  {`{
  "success": false,
  "error": "An unexpected error occurred"
}`}
                </CodeBlock>
              </td>
            </tr>
          </tbody>
        </table>
      </DocPaper>
    </div>
  )
}
