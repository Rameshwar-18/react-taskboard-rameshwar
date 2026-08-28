import { useParams, Link } from 'react-router-dom';

/* ── Styles ─────────────────────────────────────────────── */
const pageStyle = {
  maxWidth: '680px',
  margin: '0 auto',
  padding: '2rem 1.5rem',
};

const backLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  color: '#4f46e5',
  fontWeight: '600',
  fontSize: '0.9rem',
  marginBottom: '1.5rem',
  padding: '6px 14px',
  border: '1px solid #c7d2fe',
  borderRadius: '6px',
  backgroundColor: '#eef2ff',
  transition: 'background 0.2s',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '2rem 2.25rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
};

const pageHeadingStyle = {
  fontSize: '1.4rem',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '1.75rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #f1f5f9',
};

const fieldLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: '700',
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '0.35rem',
};

const fieldValueStyle = {
  fontSize: '1.05rem',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '1.5rem',
};

const statusBadge = (completed) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 14px',
  borderRadius: '999px',
  fontSize: '0.85rem',
  fontWeight: '700',
  backgroundColor: completed ? '#dcfce7' : '#f1f5f9',
  color: completed ? '#15803d' : '#475569',
});

/* Not-found styles */
const notFoundStyle = {
  backgroundColor: '#fff7ed',
  border: '1px solid #fed7aa',
  borderRadius: '10px',
  padding: '2rem',
  textAlign: 'center',
};

const notFoundHeadingStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#9a3412',
  marginBottom: '0.5rem',
};

const notFoundTextStyle = {
  color: '#c2410c',
  fontSize: '0.95rem',
};

/* ── Component ──────────────────────────────────────────── */

/**
 * TaskDetails — route: /task/:id
 *
 * Uses useParams() to extract the id from the URL.
 * Receives the shared `tasks` array from App via props to look up
 * the correct task without duplicating state.
 *
 * Props:
 *   tasks — shared task array from App
 */
function TaskDetails({ tasks }) {
  // useParams() gives us the :id segment as a string
  const { id } = useParams();

  // Task IDs are numbers; URL params are always strings — convert before comparing
  const task = tasks.find((t) => t.id === Number(id));

  return (
    <main style={pageStyle}>
      {/* ── Back link ── */}
      <Link to="/" style={backLinkStyle}>
        ← Back to Task Board
      </Link>

      {task ? (
        /* ── Task found ── */
        <div style={cardStyle}>
          <h1 style={pageHeadingStyle}>📋 Task Details</h1>

          <p style={fieldLabelStyle}>Title</p>
          <p style={fieldValueStyle}>{task.title}</p>

          <p style={fieldLabelStyle}>Status</p>
          <span style={statusBadge(task.completed)}>
            {task.completed ? '✅ Completed' : '🕐 Incomplete'}
          </span>

          <p style={{ ...fieldLabelStyle, marginTop: '1.5rem' }}>Task ID</p>
          <p style={{ ...fieldValueStyle, color: '#94a3b8', fontSize: '0.9rem' }}>
            #{task.id}
          </p>
        </div>
      ) : (
        /* ── Task not found ── */
        <div style={notFoundStyle}>
          <p style={notFoundHeadingStyle}>⚠️ Task not found</p>
          <p style={notFoundTextStyle}>
            No task with ID <strong>#{id}</strong> exists. It may have been deleted.
          </p>
        </div>
      )}
    </main>
  );
}

export default TaskDetails;
