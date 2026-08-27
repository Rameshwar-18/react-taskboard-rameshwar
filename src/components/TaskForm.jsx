import { useState, useEffect } from 'react';

/* ── Styles ───────────────────────────────────────────── */
const formWrapStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '1.5rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  marginBottom: '2rem',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '0.4rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.55rem 0.85rem',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.95rem',
  color: '#1e293b',
  outline: 'none',
  boxSizing: 'border-box',
};

const rowStyle = {
  display: 'flex',
  gap: '0.75rem',
  marginTop: '1rem',
};

const btnPrimary = {
  padding: '0.5rem 1.25rem',
  backgroundColor: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const btnSecondary = {
  padding: '0.5rem 1.25rem',
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const headingStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '1rem',
};

/* ── Component ────────────────────────────────────────── */

/**
 * TaskForm — handles both Add and Edit modes.
 *
 * Props:
 *   onAddTask(title)          — called when creating a new task
 *   onEditTask(id, newTitle)  — called when saving an edited task
 *   editingTask               — task object being edited, or null
 *   onCancelEdit()            — called when the user cancels editing
 */
function TaskForm({ onAddTask, onEditTask, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState('');

  // When editingTask changes, pre-fill the input with the task's current title
  useEffect(() => {
    setTitle(editingTask ? editingTask.title : '');
  }, [editingTask]);

  const isEditing = editingTask !== null;

  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return; // basic guard — full validation comes in a later phase

    if (isEditing) {
      onEditTask(editingTask.id, trimmed);
    } else {
      onAddTask(trimmed);
    }

    setTitle('');
  }

  function handleCancel() {
    setTitle('');
    onCancelEdit();
  }

  return (
    <form style={formWrapStyle} onSubmit={handleSubmit}>
      <p style={headingStyle}>{isEditing ? '✏️ Edit Task' : '➕ Add New Task'}</p>

      <label htmlFor="task-title" style={labelStyle}>
        Task Title
      </label>
      <input
        id="task-title"
        type="text"
        style={inputStyle}
        placeholder="Enter task title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div style={rowStyle}>
        <button type="submit" style={btnPrimary}>
          {isEditing ? 'Save Changes' : 'Add Task'}
        </button>

        {isEditing && (
          <button type="button" style={btnSecondary} onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
