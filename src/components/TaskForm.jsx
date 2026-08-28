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

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '0.55rem 0.85rem',
  border: `1px solid ${hasError ? '#f87171' : '#cbd5e1'}`,
  borderRadius: '6px',
  fontSize: '0.95rem',
  color: '#1e293b',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: hasError ? '#fff5f5' : '#ffffff',
});

const errorStyle = {
  fontSize: '0.8rem',
  color: '#dc2626',
  fontWeight: '500',
  marginTop: '0.35rem',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
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

/* ── Validation helper ────────────────────────────────── */

/**
 * Validates a task title.
 * Returns an error string if invalid, or "" if valid.
 */
function validateTitle(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Title is required.';
  if (trimmed.length < 3) return 'Title must be at least 3 characters.';
  return '';
}

/* ── Component ────────────────────────────────────────── */

/**
 * TaskForm — handles both Add and Edit modes with inline validation.
 *
 * Props:
 *   onAddTask(title)          — called when creating a new task
 *   onEditTask(id, newTitle)  — called when saving an edited task
 *   editingTask               — task object being edited, or null
 *   onCancelEdit()            — called when the user cancels editing
 */
function TaskForm({ onAddTask, onEditTask, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(''); // "" means no error

  // Pre-fill the input (and clear any stale error) when editingTask changes
  useEffect(() => {
    setTitle(editingTask ? editingTask.title : '');
    setError('');
  }, [editingTask]);

  const isEditing = editingTask !== null;

  // ── Input change handler ──────────────────────────────
  // Re-validate on every keystroke so the error clears as soon as the user
  // types enough characters — no stale error messages left on screen.
  function handleChange(e) {
    const newValue = e.target.value;
    setTitle(newValue);

    // Only show live feedback if there is already an error visible
    if (error) {
      setError(validateTitle(newValue));
    }
  }

  // ── Submit handler ────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();

    // Full validation on submit — always run even if no previous error
    const validationError = validateTitle(title);
    if (validationError) {
      setError(validationError);
      return; // stop — do not create or update the task
    }

    // Valid — proceed
    const trimmed = title.trim();
    if (isEditing) {
      onEditTask(editingTask.id, trimmed);
    } else {
      onAddTask(trimmed);
    }

    setTitle('');
    setError('');
  }

  // ── Cancel handler ────────────────────────────────────
  function handleCancel() {
    setTitle('');
    setError('');
    onCancelEdit();
  }

  // ── Render ────────────────────────────────────────────
  return (
    <form style={formWrapStyle} onSubmit={handleSubmit} noValidate>
      <p style={headingStyle}>{isEditing ? '✏️ Edit Task' : '➕ Add New Task'}</p>

      <label htmlFor="task-title" style={labelStyle}>
        Task Title
      </label>

      <input
        id="task-title"
        type="text"
        style={inputStyle(Boolean(error))}
        placeholder="Enter task title… (min. 3 characters)"
        value={title}
        onChange={handleChange}
      />

      {/* Inline validation error — only rendered when there is an error */}
      {error && (
        <p style={errorStyle} role="alert" aria-live="polite">
          ⚠ {error}
        </p>
      )}

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
