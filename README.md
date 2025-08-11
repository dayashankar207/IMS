# 📦 Inventory Management System (IMS)

## 📌 Overview

The **Inventory Management System (IMS)** is a **Node.js + Express REST API** for managing inventory across multiple warehouses.  
It supports **adding/removing stock**, **viewing stock statistics**, and **tracking low-stock items**.

🔐 **Authentication** uses **JWT Access Tokens** (short-lived) and **Refresh Tokens** (stored in HTTP-only cookies).  
🗄 **MongoDB** is used for database storage, and **Redis** for caching and token storage.

---

## ✨ Features

- 🔑 **User Authentication & Roles** — Register, login, admin/user access control.
- 📦 **Inventory Management** — Add, remove, view stock, low-stock alerts, stocksbyWarehouse .
- 🏭 **Warehouse Management** — Create and list warehouses.
- 🛒 **Product Management** — Add, update, delete, and view products.
- ⚡ **Performance** — Redis caching for fast data retrieval.
- ✅ **Validation** — Request validation with `express-validator`.

---

## 🛠 Tech Stack

| Technology            | Purpose               |
| --------------------- | --------------------- |
| **Node.js**           | Backend runtime       |
| **Express.js**        | API framework         |
| **MongoDB**           | Database              |
| **Redis**             | Caching & token store |
| **JWT**               | Authentication        |
| **express-validator** | Input validation      |

---


## 📂 Project Structure

```plaintext
📦 ims
┣ 📂 config        # Database & Redis configuration
┣ 📂 controllers   # Route logic
┣ 📂 middleware    # Auth & role-based access
┣ 📂 models        # Mongoose models & validations
┣ 📂 routes        # API route definitions
┣ 📜 server.js     # Entry point
┗ 📜 .env          # Environment variables


## ⚙️ Environment Variables

To run this project, create a `.env` file in the root directory and include the following variables:

- `MONGODB_URI` — Your MongoDB connection string.  
  Example:  
  `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/inventory?retryWrites=true&w=majority`

- `JWT_SECRET` — Secret key for signing access tokens (keep this secure).

- `JWT_REFRESH_SECRET` — Secret key for signing refresh tokens (keep this secure).

- `PORT` — Port number the server will listen on (e.g., `3000`).

- `ADMIN_USERNAME` — Username for the default admin user.

- `ADMIN_PASSWORD` — Password for the default admin user.

- `REDIS_URL` — Redis connection URL (e.g., `redis://localhost:6379`).

- `NODE_ENV` — Environment mode, usually `development` or `production`.





📡 API Endpoints ---

🔐 Authentication

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/auth/registerUser` | Register a new user  |
| POST   | `/auth/loginUser`    | Login and get tokens |

🛒 Products

| Method | Endpoint                     | Role       | Description    |
| ------ | ---------------------------- | ---------- | -------------- |
| POST   | `/product/newProduct`        | Admin      | Add product    |
| PUT    | `/product/updateProduct/:id` | Admin      | Update product |
| DELETE | `/product/deleteProduct/:id` | Admin      | Delete product |
| GET    | `/product/getProduct`        | Admin/User | List products  |

📦 Inventory

| Method | Endpoint                                   | Role  | Description        |
| ------ | ------------------------------------------ | ----- | ------------------ |
| POST   | `/inventory/add`                           | Admin | Add stock          |
| POST   | `/inventory/remove`                        | Admin | Remove stock       |
| GET    | `/inventory/stats/:productId/:warehouseId` | Admin | Stock stats        |
| POST   | `/inventory/low-stock`                     | Admin | Low stock list     |
| POST   | `/inventory/stockByWarehouse`              | Admin | Stock by warehouse |

🏢 Warehouses

| Method | Endpoint                  | Role  | Description      |
| ------ | ------------------------- | ----- | ---------------- |
| POST   | `/warehouse/newWarehouse` | Admin | Create warehouse |
| POST   | `/warehouse/allWarehouse` | Admin | List warehouses  |

🔄 Auth Flow

1. Register/Login → Receive Access Token (1h) + Refresh Token (7d, HTTP-only cookie).

2. Use access token in Authorization: Bearer <token> header for protected routes.

3. If access token expires, call refresh endpoint to get a new one.


🧪 Testing with Postman
1. Import routes into Postman.

2. Enable cookie support in Postman settings.

3. Register/Login to get tokens.

4. Call protected routes with the access token.

5. Wait for expiry → Refresh token.


