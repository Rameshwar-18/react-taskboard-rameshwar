import TaskList from '../components/TaskList';

const pageStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '2rem 1.5rem',
};

const headingStyle = {
  fontSize: '1.75rem',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '0.5rem',
};

const subheadingStyle = {
  color: '#64748b',
  marginBottom: '2rem',
};

/**
 * TaskBoard page — route: /
 * Renders the task list. CRUD features will be added in Task 2.
 */
function TaskBoard() {
  return (
    <main style={pageStyle}>
      <h1 style={headingStyle}>Task Board</h1>
      <p style={subheadingStyle}>Manage and track all your tasks in one place.</p>
      <TaskList />
    </main>
  );
}

export default TaskBoard;
