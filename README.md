Inventory Management System (IMS)
Overview
The Inventory Management System (IMS) is a Node.js-based REST API for managing inventory across multiple warehouses. It supports adding/removing stock, viewing stock statistics, and identifying low-stock items. Authentication is handled using JWT access tokens (short-lived) and refresh tokens (stored in HTTP-only cookies). The system uses MongoDB for persistent storage and Redis for caching stock data.
Features

Inventory Management:
Add stock to a product in a warehouse (POST /api/inventory/add).
Remove stock from a product in a warehouse (POST /api/inventory/remove).
View stock quantity for a product in a warehouse (GET /api/inventory/stats/:productId/:warehouseId).
List low-stock items below a threshold (GET /api/inventory/low-stock).

Authentication:
User registration and login with JWT (POST /api/auth/register, POST /api/auth/login).
Access tokens (15-minute lifetime) for protected routes.
Refresh tokens (7-day lifetime) stored in HTTP-only cookies for token renewal (POST /api/auth/refresh).

Validation: Uses express-validator for input validation.
Database and Cache:
MongoDB for storing users, products, warehouses, and inventory.
Redis for caching stock quantities and refresh tokens.

Prerequisites

Node.js: v16 or higher
MongoDB Atlas: Cloud database for persistent storage
Redis: For caching (local or cloud-hosted, e.g., Redis Labs)
Postman: For testing API endpoints

Setup Instructions

Clone the Repository:
git clone <your-repo-url>
cd IMS

Install Dependencies:
npm install

Configure Environment Variables:

Create a .env file in the root directory:MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/inventory?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
PORT=3000
ADMIN_USERNAME=superadmin
ADMIN_PASSWORD=SecureAdminPass123
REDIS_URL=redis://localhost:6379
NODE_ENV=development

Start MongoDB and Redis:

Ensure MongoDB Atlas is set up and your IP is allowed in Network Access.
Run Redis locally (redis-server) or use a cloud service.

Run the Application:
npm start

The server runs on http://localhost:3000.

API Endpoints
Authentication

Register User

Endpoint: POST /api/auth/register
Body:{
"username": "testuser",
"email": "test@example.com",
"password": "secure123",
"role": "user"
}

Response:{
"message": "User registered",
"accessToken": "eyJhbGci..."
}

Cookie: Sets refreshToken (HTTP-only, 7 days).
Validation: Username (3-50 chars), valid email, password (min 6 chars), role (admin or user).

Login User

Endpoint: POST /api/auth/login
Body:{
"username": "testuser",
"password": "secure123"
}

Response:{
"message": "Login successful",
"accessToken": "eyJhbGci..."
}

Cookie: Sets refreshToken (HTTP-only, 7 days).
Validation: Username and password required.

Refresh Access Token

Endpoint: POST /api/auth/refresh
Body (optional, if cookie not sent):{
"refreshToken": "<refreshToken>"
}

Response:{
"message": "Token refreshed",
"accessToken": "eyJhbGci..."
}

Notes: Uses refreshToken from HTTP-only cookie or body.

Inventory Management

Add Stock (Admin only)

Endpoint: POST /api/inventory/add
Headers: Authorization: Bearer <accessToken>
Body:{
"productId": "688b2eb889de35540fc25b0e",
"warehouseId": "688b135ef323892596d0c6a8",
"quantity": 100
}

Response:{
"message": "Stock updated",
"quantity": 100
}

Remove Stock (Admin only)

Endpoint: POST /api/inventory/remove
Headers: Authorization: Bearer <accessToken>
Body:{
"productId": "688b2eb889de35540fc25b0e",
"warehouseId": "688b135ef323892596d0c6a8",
"quantity": 50
}

Response:{
"message": "Stock updated",
"quantity": 50
}

Stock Statistics

Endpoint: GET /api/inventory/stats/:productId/:warehouseId
Headers: Authorization: Bearer <accessToken>
Example: GET /api/inventory/stats/688b2eb889de35540fc25b0e/688b135ef323892596d0c6a8
Response:{
"quantity": 50
}

Low Stock

Endpoint: GET /api/inventory/low-stock?threshold=10
Headers: Authorization: Bearer <accessToken>
Response:[
{
"productId": {
"name": "Mouse",
"sku": "MOU456"
},
"warehouseId": {
"name": "West Coast Depot"
},
"quantity": 5
}
]

Authentication Flow

Register/Login: Receive an access token (15m) and a refresh token (7d, HTTP-only cookie).
Access Protected Routes: Use access token in Authorization: Bearer <accessToken> header.
Token Expiry: If access token expires (401 error), use POST /api/auth/refresh with the refresh token cookie to get a new access token.
Security:
Access tokens are short-lived for security.
Refresh tokens are stored in HTTP-only cookies to prevent XSS attacks.
Refresh tokens are validated against Redis for revocation.

Testing

Postman:
Enable cookie support in Postman settings to handle HTTP-only cookies.
Test register and login to get tokens.
Use access token for protected routes (/api/inventory/\*).
Test refresh after access token expires (15m).

Redis:redis-cli
GET refresh:<userId>
GET stock:<productId>:<warehouseId>

MongoDB Atlas: Check users, products, warehouses, inventory collections.

Troubleshooting

MongoDB Connection: Ensure MONGODB_URI is correct and your IP is allowed in Atlas Network Access.
Redis: Verify redis-server is running or use a cloud Redis instance.
Token Issues: Check Postman cookies for refreshToken and ensure JWT_SECRET/JWT_REFRESH_SECRET are set.
Logs: Check server logs in the console or logs/app.log for errors.

Future Improvements

Add endpoints for product and warehouse management.
Implement stock movement history.
Create a frontend interface (e.g., React).
Add unit tests with Jest.

License
MIT License
