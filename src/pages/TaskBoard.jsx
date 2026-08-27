import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

/* ── Initial sample data ────────────────────────────────────────────
   5 tasks so the UI can be tested immediately without adding anything.
   Shape: { id: number, title: string, completed: boolean }
──────────────────────────────────────────────────────────────────── */
const initialTasks = [
  { id: 1, title: 'Design the UI layout', completed: true },
  { id: 2, title: 'Set up project routing', completed: true },
  { id: 3, title: 'Implement CRUD with useState', completed: false },
  { id: 4, title: 'Integrate JSONPlaceholder API', completed: false },
  { id: 5, title: 'Add localStorage persistence', completed: false },
];

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
 * Single source of truth for all task state.
 * Owns: tasks, editingTask
 * Exposes handlers to children via props.
 */
function TaskBoard() {
  // ── State ──────────────────────────────────────────────────────
  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState(null); // null = not editing

  // ── Handlers ───────────────────────────────────────────────────

  /** Add a brand-new task to the list */
  function handleAddTask(title) {
    const newTask = {
      id: Date.now(),   // unique, simple ID strategy (no library needed)
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

  /** Remove a task by id using filter — never mutates the array */
  function handleDeleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
    // If we happen to delete the task currently being edited, cancel edit mode
    if (editingTask && editingTask.id === id) {
      setEditingTask(null);
    }
  }

  /** Toggle the completed flag for a single task using map + spread */
  function handleToggleComplete(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  /** Enter edit mode — pass the task object down to TaskForm */
  function handleStartEdit(task) {
    setEditingTask(task);
    // Scroll to the top of the page so the user can see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Cancel editing without saving changes */
  function handleCancelEdit() {
    setEditingTask(null);
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <main style={pageStyle}>
      <h1 style={headingStyle}>Task Board</h1>
      <p style={subheadingStyle}>Manage and track all your tasks in one place.</p>

      {/* ── Form: handles both Add and Edit ── */}
      <TaskForm
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
      />

      {/* ── Task list ── */}
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
