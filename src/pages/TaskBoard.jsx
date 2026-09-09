import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getTasks,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
} from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

/**
 * TaskBoard — route: /
 *
 * Primary dashboard view for authenticated users.
 * Directly communicates with the backend API; tasks are never written to localStorage.
 */
function TaskBoard() {
  const { token } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Fetch user's tasks from the backend
  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const response = await getTasks(token);
      setTasks(response?.data || []);
    } catch (err) {
      console.error('[TaskBoard] Error loading tasks:', err.message);
      setError(err.message || 'Unable to load tasks from server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /* ── CRUD handlers connected directly to Backend API ──────── */

  async function handleAddTask(title) {
    setActionError('');
    const response = await createTask({ title }, token);
    if (response?.data) {
      setTasks((prev) => [response.data, ...prev]);
    }
  }

  async function handleEditTask(id, newTitle) {
    setActionError('');
    const response = await updateTask(id, { title: newTitle }, token);
    if (response?.data) {
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === id ? response.data : t))
      );
      setEditingTask(null);
    }
  }

  async function handleToggleComplete(id) {
    setActionError('');
    setActionLoadingId(id);
    try {
      const response = await toggleTaskComplete(id, token);
      if (response?.data) {
        setTasks((prev) =>
          prev.map((t) => ((t._id || t.id) === id ? response.data : t))
        );
      }
    } catch (err) {
      setActionError(err.message || 'Failed to toggle task completion.');
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDeleteTask(id) {
    setActionError('');
    setActionLoadingId(id);
    try {
      await deleteTask(id, token);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== id));
      if (editingTask && (editingTask._id || editingTask.id) === id) {
        setEditingTask(null);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to delete task.');
    } finally {
      setActionLoadingId(null);
    }
  }

  function handleStartEdit(task) {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  /* ── Derived counts ─────────────────────────────────────── */
  const completedCount = tasks.filter((t) => t.completed).length;

  /* ── Render: Loading ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="loading-screen" role="status" aria-live="polite">
        <div className="loading-screen__spinner" aria-hidden="true" />
        <p className="loading-screen__text">Loading tasks from cloud...</p>
        <p className="loading-screen__sub">Please wait a moment.</p>
      </div>
    );
  }

  /* ── Render: Error ───────────────────────────────────────── */
  if (error) {
    return (
      <div className="error-screen">
        <div className="error-card" role="alert">
          <p className="error-card__heading">Unable to Load Tasks</p>
          <p className="error-card__body">
            {error}
            <br />
            Please verify the backend server is running and try again.
          </p>
          <button className="btn btn--primary" onClick={fetchTasks}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ── Render: Normal Task Board ───────────────────────────── */
  return (
    <main className="page">
      <h1 className="page__heading">Task Board</h1>
      <p className="page__subheading">Manage and track all your tasks with secure cloud sync.</p>

      {actionError && (
        <div
          className="task-form__error"
          style={{ marginBottom: '1.5rem', maxWidth: 'var(--form-width)' }}
          role="alert"
        >
          {actionError}
        </div>
      )}

      {/* Form — handles Add and Edit */}
      <TaskForm
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
      />

      {/* Section header */}
      <hr className="section-divider" />
      <p className="section-label">
        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} · {completedCount} completed
      </p>

      {/* Task grid */}
      <TaskList
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onEdit={handleStartEdit}
        onDelete={handleDeleteTask}
        actionLoadingId={actionLoadingId}
      />
    </main>
  );
}

export default TaskBoard;
