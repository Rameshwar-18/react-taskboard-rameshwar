import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

/* ── Styles ─────────────────────────────────────────────────────── */
const pageStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '2rem 1.5rem',
};

const headingStyle = {
  fontSize: '1.75rem',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '0.35rem',
};

const subheadingStyle = {
  color: '#64748b',
  marginBottom: '2rem',
};

const dividerStyle = {
  borderTop: '1px solid #e2e8f0',
  marginBottom: '1.5rem',
};

const sectionTitleStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  color: '#475569',
  marginBottom: '1rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

/* ── Component ──────────────────────────────────────────────────── */

/**
 * TaskBoard — route: /
 *
 * Receives shared `tasks` + `setTasks` from App (lifted state).
 * Owns: editingTask (local UI state — not needed by other routes)
 * Exposes CRUD handlers to children via props.
 *
 * Props:
 *   tasks    — shared task array from App
 *   setTasks — shared setter from App
 */
function TaskBoard({ tasks, setTasks }) {
  // editingTask is local to TaskBoard — no other route needs it
  const [editingTask, setEditingTask] = useState(null);

  // ── Handlers ───────────────────────────────────────────────────

  /** Add a brand-new task to the list */
  function handleAddTask(title) {
    const newTask = {
      id: Date.now(), // unique, simple ID — no library needed
      title,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  }

  /** Update the title of the task currently being edited */
  function handleEditTask(id, newTitle) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
    setEditingTask(null); // exit edit mode after saving
  }

  /** Remove a task by id — never mutates the array */
  function handleDeleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
    if (editingTask && editingTask.id === id) {
      setEditingTask(null);
    }
  }

  /** Toggle completed flag using map + spread */
  function handleToggleComplete(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  /** Enter edit mode — pass the task object to TaskForm */
  function handleStartEdit(task) {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Cancel editing without saving */
  function handleCancelEdit() {
    setEditingTask(null);
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <main style={pageStyle}>
      <h1 style={headingStyle}>Task Board</h1>
      <p style={subheadingStyle}>Manage and track all your tasks in one place.</p>

      {/* Form: handles both Add and Edit */}
      <TaskForm
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
      />

      {/* Task list */}
      <hr style={dividerStyle} />
      <p style={sectionTitleStyle}>
        Tasks ({tasks.length}) · {tasks.filter((t) => t.completed).length} completed
      </p>

      <TaskList
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onEdit={handleStartEdit}
        onDelete={handleDeleteTask}
      />
    </main>
  );
}

export default TaskBoard;
