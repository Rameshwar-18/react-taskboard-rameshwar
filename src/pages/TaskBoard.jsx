import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

/**
 * TaskBoard — route: /
 *
 * Receives shared `tasks` + `setTasks` from App (lifted state).
 * Owns `editingTask` (local UI state — no other route needs this).
 * Exposes all CRUD handlers to children via props.
 *
 * Props:
 *   tasks    — shared task array from App
 *   setTasks — shared setter from App
 *
 * Styling: index.css (.page, .section-divider, .section-label, etc.)
 * Logic: unchanged from Task 2/3/4
 */
function TaskBoard({ tasks, setTasks }) {
  const [editingTask, setEditingTask] = useState(null);

  /* ── CRUD handlers ──────────────────────────────────────── */

  function handleAddTask(title) {
    const newTask = { id: Date.now(), title, completed: false };
    setTasks([...tasks, newTask]);
  }

  function handleEditTask(id, newTitle) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title: newTitle } : t)));
    setEditingTask(null);
  }

  function handleDeleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
    if (editingTask && editingTask.id === id) setEditingTask(null);
  }

  function handleToggleComplete(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
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

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <main className="page">
      <h1 className="page__heading">Task Board</h1>
      <p className="page__subheading">Manage and track all your tasks in one place.</p>

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
      />
    </main>
  );
}

export default TaskBoard;
