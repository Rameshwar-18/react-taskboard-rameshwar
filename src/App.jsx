import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TaskBoard from './pages/TaskBoard';
import TaskDetails from './pages/TaskDetails';

/* ── Shared initial tasks ─────────────────────────────────────────
   Lifted here so both TaskBoard (/ route) and TaskDetails (/task/:id)
   can access the same task list without duplicating state or introducing
   Context / Redux. TaskBoard still owns all CRUD handlers via setTasks.
───────────────────────────────────────────────────────────────── */
const initialTasks = [
  { id: 1, title: 'Design the UI layout', completed: true },
  { id: 2, title: 'Set up project routing', completed: true },
  { id: 3, title: 'Implement CRUD with useState', completed: false },
  { id: 4, title: 'Integrate JSONPlaceholder API', completed: false },
  { id: 5, title: 'Add localStorage persistence', completed: false },
];

/**
 * App — root component.
 *
 * Owns the shared `tasks` state so that both TaskBoard and TaskDetails
 * can read from the same data source.
 *
 * TaskBoard receives `tasks` + `setTasks` and manages all CRUD logic.
 * TaskDetails receives `tasks` (read-only) to look up the selected task.
 */
function App() {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<TaskBoard tasks={tasks} setTasks={setTasks} />}
        />
        <Route
          path="/task/:id"
          element={<TaskDetails tasks={tasks} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
