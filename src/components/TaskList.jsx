import TaskCard from './TaskCard';

/** Placeholder tasks — real data/state will come in Task 2 */
const PLACEHOLDER_TASKS = [
  { id: 1, title: 'Design the UI layout', status: 'TODO', description: 'Create wireframes for all main views.' },
  { id: 2, title: 'Set up API endpoints', status: 'IN PROGRESS', description: 'Define REST endpoints for task CRUD.' },
  { id: 3, title: 'Write unit tests', status: 'DONE', description: 'Cover core business logic with tests.' },
];

const listStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '1rem',
};

/**
 * TaskList — Renders a grid of TaskCard components.
 * Props: tasks (array) — will be passed from TaskBoard once state is wired up.
 */
function TaskList({ tasks = PLACEHOLDER_TASKS }) {
  if (tasks.length === 0) {
    return <p style={{ color: '#64748b' }}>No tasks yet. Add your first task!</p>;
  }

  return (
    <div style={listStyle}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
