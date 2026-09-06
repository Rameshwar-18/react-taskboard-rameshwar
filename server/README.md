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
│   ├── controllers/         # (Reserved for upcoming phases: task & auth controllers)
│   ├── middleware/          # (Reserved for upcoming phases: auth & error handling)
│   ├── models/              # Mongoose data models
│   │   ├── User.js          # User model schema & validation
│   │   └── Task.js          # Task model schema & validation
│   ├── routes/              # (Reserved for upcoming phases: Express route definitions)
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
- **`src/controllers/`**: Will contain business logic handlers for incoming HTTP requests (Task CRUD, Auth).
- **`src/middleware/`**: Will hold custom middleware including authentication verification, input validation, and centralized error handling.
- **`src/models/`**: Defines persistent Mongoose models (`User.js` and `Task.js`).
- **`src/routes/`**: Will define Express routers mapping API endpoints to controller actions.

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

---

## Planned API Architecture (Upcoming Phases)

### Tasks Endpoints (`/api/tasks`)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `GET` | `/api/tasks` | Retrieve all tasks for the user | *Planned* |
| `GET` | `/api/tasks/:id` | Retrieve a single task by ID | *Planned* |
| `POST` | `/api/tasks` | Create a new task | *Planned* |
| `PATCH` | `/api/tasks/:id` | Update task title / properties | *Planned* |
| `PATCH` | `/api/tasks/:id/complete` | Toggle completion status of a task | *Planned* |
| `DELETE` | `/api/tasks/:id` | Delete a task | *Planned* |

*Note: Task CRUD and authentication endpoints will be implemented in subsequent phases.*
