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
 * TaskForm — handles both Add and Edit modes with inline validation and async state.
 *
 * Props:
 *   onAddTask(title)          — async function to create a new task
 *   onEditTask(id, newTitle)  — async function to update an existing task
 *   editingTask               — task object being edited, or null
 *   onCancelEdit()            — function to cancel edit mode
 *   isSubmitting              — (optional) external loading state
 */
function TaskForm({ onAddTask, onEditTask, editingTask, onCancelEdit, isSubmitting: externalSubmitting = false }) {
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState('');
  const [formApiError, setFormApiError] = useState('');
  const [internalSubmitting, setInternalSubmitting] = useState(false);

  const isSubmitting = externalSubmitting || internalSubmitting;

  useEffect(() => {
    setTitle(editingTask ? editingTask.title : '');
    setValidationError('');
    setFormApiError('');
  }, [editingTask]);

  const isEditing = editingTask !== null;

  function handleChange(e) {
    const newValue = e.target.value;
    setTitle(newValue);
    if (validationError) {
      setValidationError(validateTitle(newValue));
    }
    if (formApiError) {
      setFormApiError('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormApiError('');

    const error = validateTitle(title);
    if (error) {
      setValidationError(error);
      return;
    }

    const trimmed = title.trim();
    setInternalSubmitting(true);

    try {
      if (isEditing) {
        const taskId = editingTask._id || editingTask.id;
        await onEditTask(taskId, trimmed);
      } else {
        await onAddTask(trimmed);
      }
      setTitle('');
      setValidationError('');
    } catch (err) {
      setFormApiError(err.message || 'Operation failed. Please try again.');
    } finally {
      setInternalSubmitting(false);
    }
  }

  function handleCancel() {
    setTitle('');
    setValidationError('');
    setFormApiError('');
    onCancelEdit();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <p className="task-form__title">
        {isEditing ? 'Edit Task' : 'Add New Task'}
      </p>

      {formApiError && (
        <div
          className="task-form__error"
          style={{ marginBottom: '1rem' }}
          role="alert"
        >
          {formApiError}
        </div>
      )}

      <label htmlFor="task-title" className="task-form__label">
        Task Title
      </label>

      <input
        id="task-title"
        type="text"
        className={`task-form__input${validationError ? ' task-form__input--error' : ''}`}
        placeholder="Enter task title... (min. 3 characters)"
        value={title}
        onChange={handleChange}
        disabled={isSubmitting}
        aria-describedby={validationError ? 'task-title-error' : undefined}
        aria-invalid={Boolean(validationError)}
      />

      {validationError && (
        <p
          id="task-title-error"
          className="task-form__error"
          role="alert"
          aria-live="polite"
        >
          {validationError}
        </p>
      )}

      <div className="task-form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditing
              ? 'Saving...'
              : 'Adding...'
            : isEditing
            ? 'Save Changes'
            : 'Add Task'}
        </button>

        {isEditing && (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
