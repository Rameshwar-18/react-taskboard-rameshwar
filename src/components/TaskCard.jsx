import { Link } from 'react-router-dom';

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '1rem 1.25rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const titleStyle = {
  fontWeight: '600',
  fontSize: '1rem',
  color: '#1e293b',
};

const badgeStyle = {
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: '600',
  backgroundColor: '#e0e7ff',
  color: '#4338ca',
};

const linkStyle = {
  fontSize: '0.85rem',
  color: '#4f46e5',
  fontWeight: '500',
  marginTop: '0.25rem',
};

/**
 * TaskCard — Displays a single task summary.
 * Props: task { id, title, status, description }
 */
function TaskCard({ task }) {
  return (
    <div style={cardStyle}>
      <span style={badgeStyle}>{task.status ?? 'TODO'}</span>
      <p style={titleStyle}>{task.title}</p>
      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{task.description}</p>
      <Link to={`/task/${task.id}`} style={linkStyle}>
        View Details →
      </Link>
    </div>
  );
}

export default TaskCard;
