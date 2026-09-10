# React Task Board — Full Stack Application

## Overview

A modern, full-stack Task Board web application built for the **WeVerve Full Stack Intern practical assignment**. The application features secure user authentication (registration, login, bcrypt password hashing, JWT session management) and user-scoped task management backed by a **Node.js + Express** REST API and **MongoDB Atlas**.

---

## Architecture & Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev) + [Vite 8](https://vite.dev)
- **Routing:** [React Router v7](https://reactrouter.com)
- **State Management:** React Context (`AuthContext`) for authentication state; component-level API data fetching for tasks
- **Styling:** Vanilla CSS with custom property tokens in `src/index.css` (professional blue & white palette, responsive layout, accessible forms)
- **Session Persistence:** `localStorage` is used **exclusively** for the user's JWT token and basic profile info (`token`, `user`). Tasks are **never** stored in localStorage.

### Backend
- **Runtime & Framework:** [Node.js](https://nodejs.org) (ES Modules) + [Express.js](https://expressjs.com)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose 8](https://mongoosejs.com) ODM
- **Security & Auth:** [bcryptjs](https://www.npmjs.com/package/bcryptjs) (10 salt rounds), [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (JWT)
- **Authorization:** `authMiddleware` verifying `Authorization: Bearer <token>` on all `/api/tasks` endpoints
- **Data Isolation:** All database operations are strictly scoped to the authenticated user (`req.user.id`).

---

## Project Structure

```
react-taskboard-rameshwar/
├── server/                          # Backend Express + MongoDB service
│   ├── src/
│   │   ├── config/db.js             # MongoDB Atlas connection setup
│   │   ├── controllers/
│   │   │   ├── authController.js    # Registration and login logic
│   │   │   └── taskController.js    # Authenticated, user-scoped Task CRUD logic
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # JWT verification & req.user attachment
│   │   ├── models/
│   │   │   ├── User.js              # User Mongoose schema (bcrypt password)
│   │   │   └── Task.js              # Task schema with userId ref to User
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth routes
│   │   │   └── taskRoutes.js        # /api/tasks protected routes
│   │   ├── app.js                   # Express application setup and routes
│   │   └── server.js                # Server entry point
│   ├── .env.example                 # Template for backend environment variables
│   └── README.md                    # Detailed backend API documentation
│
├── src/                             # Frontend React application
│   ├── components/
│   │   ├── Navbar.jsx               # Navigation bar with auth status and logout
│   │   ├── ProtectedRoute.jsx       # Route guard for authenticated paths
│   │   ├── TaskCard.jsx             # Individual task display card
│   │   ├── TaskForm.jsx             # Task creation and inline edit form
│   │   └── TaskList.jsx             # Responsive grid of TaskCards
│   ├── context/
│   │   ├── AuthContext.jsx          # AuthProvider managing token and user
│   │   └── useAuth.js               # useAuth hook
│   ├── pages/
│   │   ├── Login.jsx                # User sign-in page
│   │   ├── Register.jsx             # User registration page
│   │   ├── TaskBoard.jsx            # Main dashboard view (route: /)
│   │   └── TaskDetails.jsx          # Task details view (route: /task/:id)
│   ├── services/
│   │   └── api.js                   # Centralized API service for auth and tasks
│   ├── App.jsx                      # Root router configuration
│   ├── main.jsx                     # DOM root
│   └── index.css                    # Professional design system styles
├── .env.example                     # Template for frontend environment variables
├── package.json                     # Frontend scripts and dependencies
└── README.md                        # Full project overview
```

---

## Environment Setup

### 1. Backend Environment (`server/.env`)

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskboard?retryWrites=true&w=majority
JWT_SECRET=your-secure-random-secret-key
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173,https://react-taskboard-rameshwar.vercel.app
```

### 2. Frontend Environment (`.env`)

Copy `.env.example` to `.env` in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note:** The frontend environment contains only the public API URL. Never place database credentials or JWT secrets in frontend files.

---

## Running the Application

### 1. Start the Backend Server

```bash
cd server
npm install
npm run dev
```

The Express API will listen on `http://localhost:5000`.

### 2. Start the Frontend Development Server

In the project root:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Authentication & API Flow

```
1. REGISTER
   Client (Register.jsx) -> POST /api/auth/register -> bcrypt hash -> MongoDB Atlas -> Redirect to /login

2. LOGIN
   Client (Login.jsx) -> POST /api/auth/login -> bcrypt.compare -> Issue JWT -> Client stores token in localStorage -> Redirect to /

3. PROTECTED REQUESTS
   Client (TaskBoard / TaskDetails) -> GET/POST/PATCH/DELETE /api/tasks
   Headers: Authorization: Bearer <token>
   -> authMiddleware verifies JWT -> req.user.id -> MongoDB Atlas queries scoped by { userId: req.user.id }
   -> Returns only the authenticated user's tasks
```

### Client-Side Route Protection

- `/login` — Public sign-in page
- `/register` — Public registration page
- `/` — **Protected** Task Board. Redirects unauthenticated visitors to `/login`.
- `/task/:id` — **Protected** Task Details. Redirects unauthenticated visitors to `/login`. Displays a 404 state if the task does not exist or belongs to another user.

---

## Task Management (MongoDB Atlas)

- **Create Task:** `POST /api/tasks` (Client sends `{ title }`, backend assigns `userId: req.user.id`)
- **Get Tasks:** `GET /api/tasks` (Returns array of tasks for current user)
- **Get Task By ID:** `GET /api/tasks/:id` (Returns single task if owned by user, otherwise 404)
- **Update Task:** `PATCH /api/tasks/:id` (Updates title and/or completed)
- **Toggle Complete:** `PATCH /api/tasks/:id/complete` (Toggles boolean status)
- **Delete Task:** `DELETE /api/tasks/:id` (Permanently deletes user's task)

All tasks survive page refreshes and browser restarts because they are stored in MongoDB Atlas. `localStorage` is **never** used as a task data store.

---

## Building for Production

```bash
# Build frontend bundle
npm run build

# Run lint checks
npm run lint
```

---

## Known Limitations

1. **No Refresh Tokens:** By design for this stage of the project, authentication relies on standard single-token JWTs stored in `localStorage`. When the JWT expires (or if the secret changes), the frontend handles the resulting `401 Unauthorized` by clearing the session and redirecting the user to `/login`. Refresh token rotation is not implemented.
2. **Backend Cloud Deployment Pending:** The Node.js Express server runs locally by default (`http://localhost:5000`). While the frontend is deployed to Vercel, the production Vercel frontend requires `VITE_API_BASE_URL` to be configured in Vercel Project Settings pointing to a deployed backend instance (e.g., on Render or Railway).
3. **No Task Pagination:** All tasks owned by the authenticated user are retrieved in a single request ordered by `createdAt` descending. For enterprise workloads with thousands of tasks, cursor-based pagination would be a recommended future enhancement.

