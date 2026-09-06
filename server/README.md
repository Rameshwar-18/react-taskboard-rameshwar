# Task Board API

## Overview

This repository houses the Node.js + Express backend service for the **WeVerve Systems Full Stack Intern Task Board application**. It provides a robust, RESTful API architecture built with MongoDB and Mongoose, designed to support task management and user authentication for the Task Board client.

---

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org) (v18+)
- **Framework:** [Express.js](https://expressjs.com) (v4)
- **Database:** [MongoDB](https://www.mongodb.com)
- **ODM:** [Mongoose](https://mongoosejs.com) (v8)
- **Language & Modules:** JavaScript (ES Modules, `"type": "module"`)
- **Development Tooling:** [Nodemon](https://nodemon.io), `dotenv`, `cors`

---

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js            # Reusable MongoDB connection using Mongoose
│   ├── controllers/         # (Reserved for Phase 2/3: task & auth controllers)
│   ├── middleware/          # (Reserved for Phase 2/3: auth & error handling)
│   ├── models/              # (Reserved for Phase 2: Task & User Mongoose models)
│   ├── routes/              # (Reserved for Phase 2/3: Express route definitions)
│   ├── app.js               # Express application configuration and middleware
│   └── server.js            # Server entry point (env load -> DB connect -> listen)
├── .env                     # Environment variables (git-ignored)
├── .env.example             # Template for required environment variables
├── .gitignore               # Server-specific ignore rules
├── package.json             # Project dependencies, scripts, and ES module config
└── README.md                # Backend API documentation
```

### Folder Purpose for Upcoming Phases

- **`src/config/`**: Holds configuration modules, starting with database connection setup (`db.js`).
- **`src/controllers/`**: Will contain business logic handlers for incoming HTTP requests (Task CRUD in Phase 2, Auth in Phase 3).
- **`src/middleware/`**: Will hold custom middleware including JWT authentication verification, input validation, and centralized error handling.
- **`src/models/`**: Will define Mongoose schemas and data models for persistent collections (User and Task).
- **`src/routes/`**: Will define Express routers mapping API endpoints to controller actions.

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
MONGODB_URI=mongodb://127.0.0.1:27017/taskboard
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

## Planned Data Models (Upcoming Phase)

### 1. User Model
- **`name`**: String (required)
- **`email`**: String (required, unique)
- **`password`**: String (hashed with bcrypt in Phase 3)
- **`createdAt`**: Date (timestamp)

### 2. Task Model
- **`title`**: String (required, validated)
- **`completed`**: Boolean (default: `false`)
- **`userId`**: ObjectId (references `User` model; establishing that each **Task belongs to a User**)
- **`createdAt`**: Date (timestamp)

---

## Planned API Architecture (Upcoming Phases)

### Tasks Endpoints (`/api/tasks`)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `GET` | `/api/tasks` | Retrieve all tasks for the authenticated user | *Planned (Phase 2)* |
| `GET` | `/api/tasks/:id` | Retrieve a single task by ID | *Planned (Phase 2)* |
| `POST` | `/api/tasks` | Create a new task | *Planned (Phase 2)* |
| `PATCH` | `/api/tasks/:id` | Update task title / properties | *Planned (Phase 2)* |
| `PATCH` | `/api/tasks/:id/complete` | Toggle completion status of a task | *Planned (Phase 2)* |
| `DELETE` | `/api/tasks/:id` | Delete a task | *Planned (Phase 2)* |

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | *Planned (Phase 3)* |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT token | *Planned (Phase 3)* |

*Note: Task CRUD and authentication endpoints will be implemented in subsequent phases.*
