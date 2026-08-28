import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TaskBoard from './pages/TaskBoard';
import TaskDetails from './pages/TaskDetails';

/* ── Constants ──────────────────────────────────────────────────── */
const STORAGE_KEY = 'taskboard_tasks';
const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const API_LIMIT = 15; // how many API items to seed on first visit

/* ── Loading / Error UI styles ──────────────────────────────────── */
const centeredStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '40vh',
  gap: '0.75rem',
  padding: '2rem',
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid #e2e8f0',
  borderTop: '4px solid #4f46e5',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

const loadingTextStyle = {
  color: '#64748b',
  fontWeight: '600',
  fontSize: '1rem',
};

const errorCardStyle = {
  backgroundColor: '#fff7ed',
  border: '1px solid #fed7aa',
  borderRadius: '10px',
  padding: '1.5rem 2rem',
  textAlign: 'center',
  maxWidth: '420px',
};

const errorHeadingStyle = {
  fontSize: '1.1rem',
  fontWeight: '700',
  color: '#9a3412',
  marginBottom: '0.4rem',
};

const errorBodyStyle = {
  color: '#c2410c',
  fontSize: '0.9rem',
  marginBottom: '1rem',
};

const retryBtnStyle = {
  padding: '0.45rem 1.2rem',
  backgroundColor: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '0.88rem',
  cursor: 'pointer',
};

/* ── localStorage helpers ───────────────────────────────────────── */

/**
 * Try to read and parse saved tasks from localStorage.
 * Returns the parsed array on success, null on failure or absence.
 */
function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;          // key doesn't exist yet
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null; // unexpected shape
    return parsed;
  } catch {
    // corrupted JSON — clear it so we can fetch fresh data
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

/** Persist the current tasks array to localStorage. */
function writeToStorage(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* ── App ────────────────────────────────────────────────────────── */

/**
 * App — root component and single source of truth for task state.
 *
 * Initialization flow:
 *   1. On mount, check localStorage.
 *   2. If valid saved tasks exist → load them, skip API.
 *   3. If nothing saved (or corrupted) → fetch API, seed with first 15 todos.
 *   4. Mark `initialized = true` only after step 2 or 3 completes.
 *
 * Persistence flow:
 *   Whenever `tasks` changes AND `initialized` is true, write to localStorage.
 *   The `initialized` guard prevents writing an empty array to storage before
 *   the API response arrives (which would cause the API data to be "lost").
 *
 * Props passed down:
 *   TaskBoard    — tasks, setTasks, loading, error, onRetry
 *   TaskDetails  — tasks
 */
function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * `initialized` flips to true once the startup load (localStorage or API)
   * has completed. The persistence effect watches this flag so it never
   * writes an empty `[]` to storage while the first load is still in flight.
   */
  const [initialized, setInitialized] = useState(false);

  // ── Effect 1: initialization (runs once on mount) ───────────────
  useEffect(() => {
    async function initialize() {
      setLoading(true);
      setError('');

      // Step 1 — check localStorage
      const saved = readFromStorage();

      if (saved !== null) {
        // Case A: valid saved data exists → use it, skip API entirely
        // Even an empty array [] is treated as intentional user data.
        setTasks(saved);
        setLoading(false);
        setInitialized(true);
        return;
      }

      // Case B: nothing in storage (first visit, or corrupted data cleared)
      //         → fetch seed data from JSONPlaceholder
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch tasks`);
        }

        const todos = await response.json();

        // Map API shape → application task shape, limit to API_LIMIT items
        const seededTasks = todos.slice(0, API_LIMIT).map((todo) => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
        }));

        setTasks(seededTasks);
        writeToStorage(seededTasks); // persist immediately so next visit skips API
        setLoading(false);
        setInitialized(true);
      } catch (err) {
        console.error('[TaskBoard] API fetch failed:', err.message);
        setError('Unable to load tasks. Please try again.');
        setLoading(false);
        // Do NOT set initialized here — user must retry before CRUD is usable
      }
    }

    initialize();
  }, []); // empty dep array → runs once on mount only

  // ── Effect 2: persistence (runs whenever tasks change) ──────────
  // The `initialized` guard is the key safety measure:
  // it ensures we NEVER write to localStorage during the initial load phase,
  // which would overwrite API data with the starting empty array.
  useEffect(() => {
    if (!initialized) return;
    writeToStorage(tasks);
  }, [tasks, initialized]);

  // ── Retry handler (shown in the error UI) ───────────────────────
  function handleRetry() {
    // Clear any corrupted storage then re-run initialization
    localStorage.removeItem(STORAGE_KEY);
    setInitialized(false);
    setTasks([]);
    setError('');
    setLoading(true);

    async function refetch() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const todos = await response.json();
        const seededTasks = todos.slice(0, API_LIMIT).map((todo) => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
        }));
        setTasks(seededTasks);
        writeToStorage(seededTasks);
        setLoading(false);
        setInitialized(true);
      } catch (err) {
        console.error('[TaskBoard] Retry failed:', err.message);
        setError('Unable to load tasks. Please try again.');
        setLoading(false);
      }
    }

    refetch();
  }

  // ── Render: Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <>
        {/* Keyframe for the spinner — injected inline to avoid a separate CSS file */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={centeredStyle}>
          <div style={spinnerStyle} />
          <p style={loadingTextStyle}>Loading tasks…</p>
        </div>
      </>
    );
  }

  // ── Render: Error ───────────────────────────────────────────────
  if (error) {
    return (
      <div style={centeredStyle}>
        <div style={errorCardStyle}>
          <p style={errorHeadingStyle}>⚠️ Unable to load tasks</p>
          <p style={errorBodyStyle}>
            {error}
          </p>
          <button style={retryBtnStyle} onClick={handleRetry}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Normal app ──────────────────────────────────────────
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
