import { useState, useEffect } from 'react';

/* ── Validation helper ──────────────────────────────────────────── */
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

/* ── Component ──────────────────────────────────────────────────── */
/**
 * TaskForm — handles both Add and Edit modes with inline validation.
 *
 * Props:
 *   onAddTask(title)          — called when creating a new task
 *   onEditTask(id, newTitle)  — called when saving an edited task
 *   editingTask               — task object being edited, or null
 *   onCancelEdit()            — called when the user cancels editing
 *
 * Styling: index.css (.task-form, .btn, etc.)
 */
function TaskForm({ onAddTask, onEditTask, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  // Pre-fill the input and clear stale errors when editingTask changes.
  // This effect syncs controlled form state from a prop — standard React pattern
  // for resetting a form when the entity being edited switches.
  useEffect(() => {
    setTitle(editingTask ? editingTask.title : '');
    setError('');
  }, [editingTask]);

  const isEditing = editingTask !== null;

  // Live re-validation: clear error as soon as input becomes valid
  function handleChange(e) {
    const newValue = e.target.value;
    setTitle(newValue);
    if (error) setError(validateTitle(newValue));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateTitle(title);
    if (validationError) {
      setError(validationError);
      return;
    }
    const trimmed = title.trim();
    if (isEditing) {
      onEditTask(editingTask.id, trimmed);
    } else {
      onAddTask(trimmed);
    }
    setTitle('');
    setError('');
  }

  function handleCancel() {
    setTitle('');
    setError('');
    onCancelEdit();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <p className="task-form__title">
        {isEditing ? 'Edit Task' : 'Add New Task'}
      </p>

      <label htmlFor="task-title" className="task-form__label">
        Task Title
      </label>

      <input
        id="task-title"
        type="text"
        className={`task-form__input${error ? ' task-form__input--error' : ''}`}
        placeholder="Enter task title... (min. 3 characters)"
        value={title}
        onChange={handleChange}
        aria-describedby={error ? 'task-title-error' : undefined}
        aria-invalid={Boolean(error)}
      />

      {/* Inline validation error — no emoji, clean pill style */}
      {error && (
        <p
          id="task-title-error"
          className="task-form__error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      <div className="task-form__actions">
        <button type="submit" className="btn btn--primary">
          {isEditing ? 'Save Changes' : 'Add Task'}
        </button>

        {isEditing && (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
