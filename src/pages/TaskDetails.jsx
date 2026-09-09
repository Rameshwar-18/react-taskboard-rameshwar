import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTaskById } from '../services/api';

/**
 * TaskDetails — route: /task/:id
 *
 * Fetches the specific task from the backend API using the authenticated JWT.
 * Safely handles 404 (not found or belongs to another user) without leaking authorization details.
 */
function TaskDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTask() {
      if (!id || !token) return;
      setLoading(true);
      setErrorStatus(null);
      setErrorMessage('');

      try {
        const response = await getTaskById(id, token);
        if (isMounted) {
          setTask(response?.data || null);
        }
      } catch (err) {
        if (isMounted) {
          setErrorStatus(err.status || 500);
          setErrorMessage(err.message || 'Unable to retrieve task details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTask();

    return () => {
      isMounted = false;
    };
  }, [id, token]);

  /* ── Loading State ───────────────────────────────────────── */
  if (loading) {
    return (
      <main className="page page--narrow">
        <Link to="/" className="btn--back">
          ← Back to Task Board
        </Link>
        <div className="loading-screen" style={{ minHeight: '300px' }} role="status" aria-live="polite">
          <div className="loading-screen__spinner" aria-hidden="true" />
          <p className="loading-screen__text">Loading task details...</p>
        </div>
      </main>
    );
  }

  /* ── Not Found / Unauthorized / Forbidden ─────────────────── */
  if (errorStatus === 404 || errorStatus === 400 || (!loading && !task && !errorMessage)) {
    return (
      <main className="page page--narrow">
        <Link to="/" className="btn--back">
          ← Back to Task Board
        </Link>

        <div className="not-found" role="alert">
          <p className="not-found__heading">Task Not Found</p>
          <p className="not-found__text">
            No task with ID <strong>#{id}</strong> exists in your workspace. It may have been deleted or does not exist.
          </p>
        </div>
      </main>
    );
  }

  /* ── General Server Error ────────────────────────────────── */
  if (errorMessage && !task) {
    return (
      <main className="page page--narrow">
        <Link to="/" className="btn--back">
          ← Back to Task Board
        </Link>

        <div className="error-card" style={{ marginTop: '1.5rem' }} role="alert">
          <p className="error-card__heading">Error Loading Task</p>
          <p className="error-card__body">{errorMessage}</p>
          <Link to="/" className="btn btn--primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  /* ── Task Details Display ────────────────────────────────── */
  return (
    <main className="page page--narrow">
      <Link to="/" className="btn--back">
        ← Back to Task Board
      </Link>

      <div className="detail-card">
        <h1 className="detail-card__heading">Task Details</h1>

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
          <span className="detail-card__status-dot" aria-hidden="true" />
          {task.completed ? 'Completed' : 'In Progress'}
        </span>

        <p className="detail-card__field-label" style={{ marginTop: '1.5rem' }}>
          Task ID
        </p>
        <p className="detail-card__field-value detail-card__field-value--muted">
          #{task._id || task.id}
        </p>

        {task.createdAt && (
          <>
            <p className="detail-card__field-label" style={{ marginTop: '1.5rem' }}>
              Created At
            </p>
            <p className="detail-card__field-value detail-card__field-value--muted">
              {new Date(task.createdAt).toLocaleString()}
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default TaskDetails;
