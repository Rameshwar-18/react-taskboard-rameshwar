import { useParams, Link } from 'react-router-dom';

/**
 * TaskDetails — route: /task/:id
 *
 * Uses useParams() to extract the :id string from the URL.
 * Receives the shared `tasks` array from App via props.
 * Converts id to a Number before comparing — URL params are always strings.
 *
 * Props:
 *   tasks — shared task array from App
 *
 * Styling: index.css (.page--narrow, .detail-card, .not-found, etc.)
 * Logic: unchanged from Task 3
 */
function TaskDetails({ tasks }) {
  const { id } = useParams();
  const task = tasks.find((t) => t.id === Number(id));

  return (
    <main className="page page--narrow">
      {/* Back navigation */}
      <Link to="/" className="btn--back">
        ← Back to Task Board
      </Link>

      {task ? (
        /* ── Task found ── */
        <div className="detail-card">
          <h1 className="detail-card__heading">📋 Task Details</h1>

          <p className="detail-card__field-label">Title</p>
          <p className="detail-card__field-value">{task.title}</p>

          <p className="detail-card__field-label">Status</p>
          <span
            className={`detail-card__status ${
              task.completed
                ? 'detail-card__status--complete'
                : 'detail-card__status--incomplete'
            }`}
          >
            {task.completed ? '✅ Completed' : '🕐 Incomplete'}
          </span>

          <p className="detail-card__field-label" style={{ marginTop: '1.5rem' }}>
            Task ID
          </p>
          <p className="detail-card__field-value detail-card__field-value--muted">
            #{task.id}
          </p>
        </div>
      ) : (
        /* ── Task not found ── */
        <div className="not-found" role="alert">
          <p className="not-found__heading">⚠️ Task not found</p>
          <p className="not-found__text">
            No task with ID <strong>#{id}</strong> exists. It may have been deleted.
          </p>
        </div>
      )}
    </main>
  );
}

export default TaskDetails;
