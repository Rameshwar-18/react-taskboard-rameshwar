# Task Board API

## Overview

This repository houses the Node.js + Express backend service for the **WeVerve Systems Full Stack Intern Task Board application**. It provides a robust, RESTful API architecture built with **MongoDB Atlas**, **Mongoose**, **bcryptjs**, and **JSON Web Tokens (JWT)**, designed to provide secure user authentication and user-isolated task management for the Task Board client.

---

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org) (v18+)
- **Framework:** [Express.js](https://expressjs.com) (v4)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
  - **Database Name:** `taskboard`
- **ODM:** [Mongoose](https://mongoosejs.com) (v8)
- **Authentication & Security:** [bcryptjs](https://www.npmjs.com/package/bcryptjs) (password hashing with 10 salt rounds), [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (JWT)
- **Language & Modules:** JavaScript (ES Modules, `"type": "module"`)
- **Development Tooling:** [Nodemon](https://nodemon.io), `dotenv`, `cors`

---

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js            # MongoDB Atlas connection utility using Mongoose
│   ├── controllers/
│   │   ├── authController.js # User registration and login controller
│   │   └── taskController.js # Authenticated & user-scoped Task CRUD controller
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification and req.user attachment middleware
│   ├── models/              # Mongoose data models
│   │   ├── User.js          # User schema (name, email, hashed password)
│   │   └── Task.js          # Task schema with userId reference to User
│   ├── routes/
│   │   ├── authRoutes.js    # /api/auth routes (register, login)
│   │   └── taskRoutes.js    # /api/tasks protected routes
│   ├── app.js               # Express application configuration and route mounting
│   └── server.js            # Server entry point (env load -> Atlas connect -> listen)
├── .env                     # Environment variables (git-ignored)
├── .env.example             # Template for required environment variables
├── .gitignore               # Server-specific ignore rules
├── package.json             # Project dependencies, scripts, and ES module config
└── README.md                # Backend API documentation
```

---

## Database & Models

The application connects to **MongoDB Atlas** targeting the `taskboard` database.

### 1. User Model (`server/src/models/User.js`)

Represents registered users of the Task Board. Passwords are never stored in plaintext and are securely hashed using `bcryptjs`.

| Field | Type | Rules | Description |
|---|---|---|---|
| `name` | `String` | Required, Trimmed | User's full or display name |
| `email` | `String` | Required, Unique, Lowercase, Trimmed | Unique user email address |
| `password` | `String` | Required, Trimmed | Bcrypt-hashed password |
| `createdAt` | `Date` | Default: `Date.now` | Account creation timestamp |

### 2. Task Model (`server/src/models/Task.js`)

Represents individual tasks created and owned by users.

| Field | Type | Rules | Description |
|---|---|---|---|
| `title` | `String` | Required, Trimmed, Min length: 3 | Task title description |
| `completed` | `Boolean` | Default: `false` | Task completion status flag |
| `userId` | `ObjectId` | Required, `ref: "User"` | References the User who owns this task |
| `createdAt` | `Date` | Default: `Date.now` | Task creation timestamp |

### 3. User → Tasks Relationship & Ownership

```
User (1) ────────< (Many) Task
```

- Each **Task** belongs to exactly one **User** via the `userId` field.
- All task operations are strictly scoped to the authenticated user (`req.user.id`).
- Users can only view, update, toggle, or delete their own tasks.
- Attempting to access another user's task ID returns `404 Not Found`, completely shielding user task existence.

---

## Authentication API (`/api/auth`)

Public endpoints for user onboarding and session token generation.

### Endpoints Table

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & obtain JWT | Public |

---

### Request & Response Examples

#### 1. Register User
- **Request:** `POST /api/auth/register`
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Validation Rules:**
  - `name`: Required, non-empty string.
  - `email`: Required, valid string, normalized (trimmed, lowercased).
  - `password`: Required, string, minimum length 6 characters.
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "67cfd123456789abcdef0001",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```
- **Duplicate Email Response (409 Conflict):**
  ```json
  {
    "success": false,
    "message": "User with this email already exists"
  }
  ```

#### 2. User Login
- **Request:** `POST /api/auth/login`
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Validation Rules:**
  - `email`: Required, normalized (trimmed, lowercased).
  - `password`: Required string.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "67cfd123456789abcdef0001",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```
- **Invalid Credentials Response (401 Unauthorized):**
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```
  *(Generic response prevents revealing whether the email exists)*

---

## JWT Authentication & Protected Routes

All endpoints under `/api/tasks` require a valid JSON Web Token.

### Authorization Header

Clients must include the JWT token in the `Authorization` HTTP header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Authentication Middleware (`authMiddleware`)

1. Reads the `Authorization` header.
2. Confirms it starts with `Bearer `.
3. Extracts and cryptographically verifies the token using `JWT_SECRET`.
4. Extracts `decoded.userId` and sets `req.user = { id: decoded.userId }`.
5. Rejects missing headers or invalid/expired tokens with HTTP `401`.

---

## Protected Task REST API (`/api/tasks`)

> **All task endpoints require authentication via `Authorization: Bearer <JWT_TOKEN>`.**
> Data is strictly scoped to the authenticated user. Client-supplied user IDs are never trusted or accepted.

### Endpoints Table

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks belonging to the current user | Private (JWT) |
| `GET` | `/api/tasks/:id` | Get single task by ID (must belong to user) | Private (JWT) |
| `POST` | `/api/tasks` | Create a new task for the current user | Private (JWT) |
| `PATCH` | `/api/tasks/:id` | Update task title and/or completed status | Private (JWT) |
| `PATCH` | `/api/tasks/:id/complete` | Toggle task completed status | Private (JWT) |
| `DELETE` | `/api/tasks/:id` | Delete a task belonging to user | Private (JWT) |

---

### Request & Response Examples

#### 1. Create Task
- **Request:** `POST /api/tasks`
  - **Headers:** `Authorization: Bearer <token>`
  ```json
  {
    "title": "Learn JWT & Auth"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "67cfd23456789abcdef0002",
      "title": "Learn JWT & Auth",
      "completed": false,
      "userId": "67cfd123456789abcdef0001",
      "createdAt": "2026-09-09T12:00:00.000Z"
    }
  }
  ```

#### 2. Get User Tasks
- **Request:** `GET /api/tasks`
  - **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "67cfd23456789abcdef0002",
        "title": "Learn JWT & Auth",
        "completed": false,
        "userId": "67cfd123456789abcdef0001",
        "createdAt": "2026-09-09T12:00:00.000Z"
      }
    ]
  }
  ```

#### 3. Update Task
- **Request:** `PATCH /api/tasks/67cfd23456789abcdef0002`
  - **Headers:** `Authorization: Bearer <token>`
  ```json
  {
    "title": "Master JWT & Task Board Security",
    "completed": true
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "67cfd23456789abcdef0002",
      "title": "Master JWT & Task Board Security",
      "completed": true,
      "userId": "67cfd123456789abcdef0001",
      "createdAt": "2026-09-09T12:00:00.000Z"
    }
  }
  ```

#### 4. Toggle Complete
- **Request:** `PATCH /api/tasks/67cfd23456789abcdef0002/complete`
  - **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "67cfd23456789abcdef0002",
      "title": "Master JWT & Task Board Security",
      "completed": false,
      "userId": "67cfd123456789abcdef0001",
      "createdAt": "2026-09-09T12:00:00.000Z"
    }
  }
  ```

#### 5. Delete Task
- **Request:** `DELETE /api/tasks/67cfd23456789abcdef0002`
  - **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "data": {
      "_id": "67cfd23456789abcdef0002",
      "title": "Master JWT & Task Board Security"
    }
  }
  ```

---

### Standardized Error Responses

| Status Code | Reason | Example Response |
|---|---|---|
| **400 Bad Request** | Missing/invalid field format | `{"success": false, "message": "Password is required and must be at least 6 characters long"}` |
| **401 Unauthorized** | Missing Authorization header | `{"success": false, "message": "Authentication required"}` |
| **401 Unauthorized** | Invalid/expired token | `{"success": false, "message": "Invalid or expired token"}` |
| **401 Unauthorized** | Invalid login credentials | `{"success": false, "message": "Invalid email or password"}` |
| **404 Not Found** | Task does not exist or belongs to another user | `{"success": false, "message": "Task not found"}` |
| **409 Conflict** | Email already registered | `{"success": false, "message": "User with this email already exists"}` |
| **500 Server Error** | Unexpected internal error | `{"success": false, "message": "Server error while creating task"}` |

---

## Setup & Configuration

### 1. Install Dependencies

Navigate to the `server` directory and install the required dependencies:

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure the environment variables in `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskboard?retryWrites=true&w=majority
JWT_SECRET=your-secure-random-secret-key
JWT_EXPIRES_IN=7d
```

> **Security Note:** Never commit `.env` to version control. If `JWT_SECRET` is missing, the server will refuse to sign or verify tokens to avoid insecure fallbacks.

---

## Running the Server

### Development Mode (with hot-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

---

## Health Check

To verify that the API server is active and reachable:

- **Method:** `GET`
- **Endpoint:** `/api/health`
- **Response Status:** `200 OK`
- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "API is running"
  }
  ```
