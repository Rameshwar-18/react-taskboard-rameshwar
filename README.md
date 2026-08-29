# React Task Board

## Overview

A React Task Board application built for the **WeVerve Full Stack Intern practical assignment**. The app allows users to create, manage, and track tasks through a clean, professional interface. It seeds initial data from the [JSONPlaceholder](https://jsonplaceholder.typicode.com) API and persists all user changes to `localStorage`.

---

## Features

- **Create tasks** — Add new tasks with validated titles
- **Edit tasks** — Update an existing task's title inline
- **Delete tasks** — Remove tasks permanently
- **Mark tasks complete** — Toggle task completion status with a colour-coded dot indicator
- **Task Details route** — Dedicated `/task/:id` page per task
- **API seed data** — First 15 tasks fetched from JSONPlaceholder on first visit
- **Loading state** — Animated spinner shown while fetching
- **API error state** — Error message with a Retry button
- **Form validation** — Title required; minimum 3 non-whitespace characters; inline errors
- **localStorage persistence** — All changes survive page refresh
- **Responsive UI** — Designed for desktop (1440px+), tablet (768px), and mobile (375px)
- **Professional design** — Blue and white colour palette, no emoji, CSS dot indicators for task status

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI components and state management |
| [Vite 8](https://vite.dev) | Development server and production build |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| JavaScript (ES Modules) | Application logic |
| Vanilla CSS | Styling, design tokens, responsive layout |
| Browser `localStorage` | Client-side task persistence |
| [JSONPlaceholder API](https://jsonplaceholder.typicode.com/todos) | Seed data on first load |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Sticky top navigation bar
│   ├── TaskForm.jsx      # Add / Edit form with inline validation
│   ├── TaskList.jsx      # Responsive grid of TaskCards
│   └── TaskCard.jsx      # Single task card with action buttons
│
├── pages/
│   ├── TaskBoard.jsx     # Route: / — CRUD orchestration
│   └── TaskDetails.jsx   # Route: /task/:id — read-only task detail view
│
├── App.jsx               # Root — state, API fetch, localStorage, routing
├── main.jsx              # React DOM entry point
└── index.css             # Global design system and component styles
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- npm (comes with Node.js)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Build

To create an optimised production bundle:

```bash
npm run build
```

Output is written to the `dist/` folder. Preview the production build locally with:

```bash
npm run preview
```

---

## How It Works

### Initial data

On the **first visit** (no data in `localStorage`), the app fetches the first 15 todos from `https://jsonplaceholder.typicode.com/todos`. The `id` and `completed` fields come from the API; titles are mapped to English task descriptions. Tasks are saved to `localStorage` immediately so subsequent visits skip the API call entirely.

```js
{ id, title, completed }
```

### Persistence

All task changes (add, edit, delete, toggle) are written to `localStorage` under the key `taskboard_tasks_v2`. The app reads this key on startup. If the stored value is corrupted or missing, it clears the key and falls back to a fresh API fetch.

### State management

React `useState` holds the task array as a single source of truth inside `App`. State is lifted so both the Task Board and Task Details routes share the same live data. `useEffect` coordinates the one-time startup load and the per-change persistence write.

### Routing

| Path | Component | Description |
|---|---|---|
| `/` | `TaskBoard` | Task grid and Add / Edit form |
| `/task/:id` | `TaskDetails` | Read-only detail view for a single task |

Navigating to a non-existent ID (e.g. `/task/999999`) renders a Task Not Found message.

### Validation

Task titles are validated on submit and on change (once the user has attempted a submission):

| Input | Result |
|---|---|
| Empty (`""`) | Title is required. |
| Whitespace only (`"   "`) | Title is required. |
| 1 or 2 characters | Title must be at least 3 characters. |
| 3 or more characters | Accepted |

Validation runs in both Add and Edit mode. Invalid submissions never modify the task list.

### Design

The UI uses a professional blue and white colour palette. Status is communicated through CSS dot indicators (blue for In Progress, green for Completed), text labels, and card border colours — no emoji. The design system is defined entirely through CSS custom properties in `index.css`.

---

## Screenshots

> Screenshots will be added before final submission.

---

## Approach

### Component architecture

State is lifted to `App` so the task array is the single source of truth. `TaskBoard` owns only local UI state (`editingTask`). `TaskDetails` is a pure read-only consumer. All CRUD handlers are defined in `TaskBoard` and passed down via props, keeping child components simple and callback-driven.

### API and persistence guard

A boolean `initialized` flag prevents the persistence `useEffect` from writing an empty array to `localStorage` before the initial API response arrives, ensuring seed data is never silently discarded.

### Accessibility

- Inputs have explicit `<label>` elements with `htmlFor`
- Invalid inputs expose `aria-invalid` and `aria-describedby`
- The loading screen uses `role="status"` and `aria-live="polite"`
- The error screen and task-not-found box use `role="alert"`
- All buttons have descriptive `aria-label` attributes
- Task status is communicated via dot indicator, text label, and visual styling — not colour alone
- All interactive elements have visible `:focus-visible` outlines

### Styling

A CSS custom-properties design system in `index.css` defines all colour, spacing, shadow, and radius tokens. Components consume tokens; no ad-hoc inline styles. Responsive breakpoints at `768px` and `480px` handle tablet and mobile layouts.

---

## Known Limitations

- The JSONPlaceholder API is used only for initial seed data. The app does not POST, PATCH, or DELETE to any backend.
- Tasks are stored in browser `localStorage` and are local to the device and browser profile.
- There is no user authentication or multi-user support.
- Changes made in one browser tab are not reflected in another without a page reload.
