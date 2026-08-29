import { Link } from 'react-router-dom';

/**
 * TaskCard — displays a single task with complete / edit / delete controls.
 *
 * Props:
 *   task            — { id, title, completed }
 *   onToggleComplete(id)
 *   onEdit(task)
 *   onDelete(id)
 *
 * Styling: index.css (.task-card, .btn, etc.)
 */
function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const cardClass = `task-card${task.completed ? ' task-card--done' : ''}`;
  const titleClass = `task-card__title${task.completed ? ' task-card__title--done' : ''}`;
  const badgeClass = `task-card__badge ${
    task.completed ? 'task-card__badge--complete' : 'task-card__badge--incomplete'
  }`;

  return (
    <article className={cardClass} aria-label={`Task: ${task.title}`}>
      {/* Status badge — dot indicator + text, no emoji */}
      <span className={badgeClass}>
        <span className="task-card__badge-dot" aria-hidden="true" />
        {task.completed ? 'Completed' : 'In Progress'}
      </span>

      {/* Title */}
      <p className={titleClass}>{task.title}</p>

      <hr className="task-card__divider" />

      {/* Action buttons */}
      <div className="task-card__actions">
        <button
          className={`btn ${task.completed ? 'btn--uncomplete' : 'btn--complete'}`}
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>

        <button
          className="btn btn--edit"
          onClick={() => onEdit(task)}
          aria-label={`Edit task: ${task.title}`}
        >
          Edit
        </button>

        <button
          className="btn btn--delete"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete task: ${task.title}`}
        >
          Delete
        </button>
      </div>

      {/* View Details link */}
      <Link to={`/task/${task.id}`} className="task-card__link">
        View Details →
      </Link>
    </article>
  );
}

export default TaskCard;
