import { Link } from 'react-router-dom';

/* ── Styles ───────────────────────────────────────────── */
const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '1.1rem 1.25rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
};

const titleBase = {
  fontWeight: '600',
  fontSize: '1rem',
  color: '#1e293b',
};

const titleDone = {
  ...titleBase,
  textDecoration: 'line-through',
  color: '#94a3b8',
};

const actionsRow = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
  marginTop: '0.25rem',
};

const btnBase = {
  padding: '4px 12px',
  borderRadius: '5px',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer',
  border: 'none',
};

const btnComplete = (completed) => ({
  ...btnBase,
  backgroundColor: completed ? '#dcfce7' : '#e0e7ff',
  color: completed ? '#16a34a' : '#4338ca',
});

const btnEdit = {
  ...btnBase,
  backgroundColor: '#fef9c3',
  color: '#854d0e',
};

const btnDelete = {
  ...btnBase,
  backgroundColor: '#fee2e2',
  color: '#b91c1c',
};

const statusBadge = (completed) => ({
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: '999px',
  fontSize: '0.73rem',
  fontWeight: '700',
  backgroundColor: completed ? '#dcfce7' : '#f1f5f9',
  color: completed ? '#15803d' : '#475569',
  alignSelf: 'flex-start',
});

const viewDetailsStyle = {
  fontSize: '0.82rem',
  color: '#4f46e5',
  fontWeight: '500',
  marginTop: '0.15rem',
};

/* ── Component ────────────────────────────────────────── */

/**
 * TaskCard — displays a single task with complete / edit / delete controls.
 *
 * Props:
 *   task            — { id, title, completed }
 *   onToggleComplete(id)
 *   onEdit(task)
 *   onDelete(id)
 */
function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  return (
    <div style={cardStyle}>
      {/* Status badge */}
      <span style={statusBadge(task.completed)}>
        {task.completed ? '✅ Completed' : '🕐 Incomplete'}
      </span>

      {/* Title — strike-through when done */}
      <p style={task.completed ? titleDone : titleBase}>{task.title}</p>

      {/* Action buttons */}
      <div style={actionsRow}>
        <button
          style={btnComplete(task.completed)}
          onClick={() => onToggleComplete(task.id)}
        >
          {task.completed ? '↩ Uncomplete' : '✓ Complete'}
        </button>

        <button
          style={btnEdit}
          onClick={() => onEdit(task)}
        >
          ✏️ Edit
        </button>

        <button
          style={btnDelete}
          onClick={() => onDelete(task.id)}
        >
          🗑 Delete
        </button>
      </div>

      {/* Link to detail page */}
      <Link to={`/task/${task.id}`} style={viewDetailsStyle}>
        View Details →
      </Link>
    </div>
  );
}

export default TaskCard;
