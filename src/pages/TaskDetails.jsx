import { useParams, Link } from 'react-router-dom';

const pageStyle = {
  maxWidth: '700px',
  margin: '0 auto',
  padding: '2rem 1.5rem',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '2rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
};

const headingStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '0.5rem',
};

const backLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  color: '#4f46e5',
  fontWeight: '500',
  marginBottom: '1.5rem',
  fontSize: '0.9rem',
};

/**
 * TaskDetails page — route: /task/:id
 * Displays details for a single task. Data fetching will be added in Task 2.
 */
function TaskDetails() {
  const { id } = useParams();

  return (
    <main style={pageStyle}>
      <Link to="/" style={backLinkStyle}>
        ← Back to Task Board
      </Link>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Task Details</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Showing details for task ID: <strong style={{ color: '#4f46e5' }}>#{id}</strong>
        </p>
        <hr style={{ margin: '1.25rem 0', borderColor: '#e2e8f0' }} />
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Full task details, edit form, and delete controls will be implemented in Task 2.
        </p>
      </div>
    </main>
  );
}

export default TaskDetails;
