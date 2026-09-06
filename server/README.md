# Task Board API

## Overview

This repository houses the Node.js + Express backend service for the **WeVerve Systems Full Stack Intern Task Board application**. It provides a robust, RESTful API architecture built with **MongoDB Atlas** and **Mongoose**, designed to support task management and user workflows for the Task Board client.

---

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org) (v18+)
- **Framework:** [Express.js](https://expressjs.com) (v4)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
  - **Database Name:** `taskboard`
- **ODM:** [Mongoose](https://mongoosejs.com) (v8)
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
│   │   └── taskController.js # Full Task CRUD controller handlers
│   ├── middleware/          # (Reserved for upcoming phases: auth & error handling)
│   ├── models/              # Mongoose data models
│   │   ├── User.js          # User model schema & validation
│   │   └── Task.js          # Task model schema & validation
│   ├── routes/
│   │   └── taskRoutes.js    # /api/tasks Express route definitions
│   ├── app.js               # Express application configuration and middleware
│   └── server.js            # Server entry point (env load -> Atlas connect -> listen)
├── .env                     # Environment variables (git-ignored)
├── .env.example             # Template for required environment variables
├── .gitignore               # Server-specific ignore rules
├── package.json             # Project dependencies, scripts, and ES module config
└── README.md                # Backend API documentation
```

### Folder Purpose for Upcoming Phases

- **`src/config/`**: Holds configuration modules, including database connection setup (`db.js`).
- **`src/controllers/`**: Contains business logic handlers for incoming HTTP requests (`taskController.js` implemented; auth controllers planned).
- **`src/middleware/`**: Will hold custom middleware including authentication verification, input validation, and centralized error handling.
- **`src/models/`**: Defines persistent Mongoose models (`User.js` and `Task.js`).
- **`src/routes/`**: Defines Express routers mapping API endpoints to controller actions (`taskRoutes.js` implemented).

---

## Database & Models

The application connects to **MongoDB Atlas** targeting the `taskboard` database.

### 1. User Model (`server/src/models/User.js`)

Represents registered users of the Task Board.

| Field | Type | Rules | Description |
|---|---|---|---|
| `name` | `String` | Required, Trimmed | User's full or display name |
| `email` | `String` | Required, Unique, Lowercase, Trimmed | Unique user email address |
| `password` | `String` | Required, Trimmed | Account password |
| `createdAt` | `Date` | Default: `Date.now` | Account creation timestamp |

### 2. Task Model (`server/src/models/Task.js`)

Represents individual tasks created and managed by users.

| Field | Type | Rules | Description |
|---|---|---|---|
| `title` | `String` | Required, Trimmed, Min length: 3 | Task title description |
| `completed` | `Boolean` | Default: `false` | Task completion status flag |
| `userId` | `ObjectId` | Required, `ref: "User"` | References the User who owns this task |
| `createdAt` | `Date` | Default: `Date.now` | Task creation timestamp |

### 3. User → Tasks Relationship

```
User (1) ────────< (Many) Task
```

- Each **Task** belongs to exactly one **User** via the `userId` field referencing the `User` collection.
- A **User** can have multiple associated tasks.

---

## Task REST API (`/api/tasks`)

> **IMPORTANT:**
> - **Authentication is NOT implemented yet.**
> - **Task ownership authorization is NOT enforced yet.**
> - **JWT authentication and user-scoped tasks will be implemented in later phases.**
> - **Temporary Development Ownership Strategy:** To satisfy the model's required `userId` relationship without accepting arbitrary user IDs from untrusted clients, tasks created during Phase 3 are automatically associated with a development user (`dev@taskboard.local`) in MongoDB Atlas. Once authentication is introduced in Phase 4, this will be replaced with `req.user.id`.

### Endpoints Table

| Method | Endpoint | Purpose | Status |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks | **Implemented** |
| `GET` | `/api/tasks/:id` | Get single task by ID | **Implemented** |
| `POST` | `/api/tasks` | Create a new task | **Implemented** |
| `PATCH` | `/api/tasks/:id` | Update task title and/or completed status | **Implemented** |
| `PATCH` | `/api/tasks/:id/complete` | Toggle task completed status | **Implemented** |
| `DELETE` | `/api/tasks/:id` | Delete a task | **Implemented** |

---

### Request & Response Examples

#### 1. Create Task
- **Request:** `POST /api/tasks`
  ```json
  {
    "title": "Learn Node.js"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "6a9d3ec9bb8b190d3df87802",
      "title": "Learn Node.js",
      "completed": false,
      "userId": "6a9d3ec9bb8b190d3df87800",
      "createdAt": "2026-09-06T10:22:01.507Z",
      "__v": 0
    }
  }
  ```

#### 2. Get All Tasks
- **Request:** `GET /api/tasks`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "6a9d3ec9bb8b190d3df87802",
        "title": "Learn Node.js",
        "completed": false,
        "userId": "6a9d3ec9bb8b190d3df87800",
        "createdAt": "2026-09-06T10:22:01.507Z"
      }
    ]
  }
  ```

#### 3. Update Task
- **Request:** `PATCH /api/tasks/6a9d3ec9bb8b190d3df87802`
  ```json
  {
    "title": "Build Task Board Backend",
    "completed": true
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "6a9d3ec9bb8b190d3df87802",
      "title": "Build Task Board Backend",
      "completed": true,
      "userId": "6a9d3ec9bb8b190d3df87800",
      "createdAt": "2026-09-06T10:22:01.507Z"
    }
  }
  ```

#### 4. Toggle Complete
- **Request:** `PATCH /api/tasks/6a9d3ec9bb8b190d3df87802/complete`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "6a9d3ec9bb8b190d3df87802",
      "title": "Build Task Board Backend",
      "completed": false,
      "userId": "6a9d3ec9bb8b190d3df87800",
      "createdAt": "2026-09-06T10:22:01.507Z"
    }
  }
  ```

#### 5. Delete Task
- **Request:** `DELETE /api/tasks/6a9d3ec9bb8b190d3df87802`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "data": {
      "_id": "6a9d3ec9bb8b190d3df87802",
      "title": "Build Task Board Backend"
    }
  }
  ```

---

### Error Responses

The API uses standardized JSON error structures and HTTP status codes:

- **400 Bad Request (Invalid Input / Validation Failure):**
  ```json
  {
    "success": false,
    "message": "Title is required, must be a string, and must be at least 3 characters after trimming"
  }
  ```

- **400 Bad Request (Invalid ObjectId Format):**
  ```json
  {
    "success": false,
    "message": "Invalid task ID format"
  }
  ```

- **404 Not Found (Task Not Found):**
  ```json
  {
    "success": false,
    "message": "Task not found"
  }
  ```

- **500 Internal Server Error:**
  ```json
  {
    "success": false,
    "message": "Server error while fetching tasks"
  }
  ```

---

## Setup

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
```

> **Note:** Never commit your `.env` file to version control. Keep database credentials private.

---

## Run

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

### Sample Response:

```json
{
  "success": true,
  "message": "API is running"
}
```
