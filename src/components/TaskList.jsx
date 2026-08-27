import TaskCard from './TaskCard';

/* ── Styles ─────────────────────────────────────────── */
const listStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
  gap: '1rem',
};

const emptyStyle = {
  color: '#94a3b8',
  fontStyle: 'italic',
  padding: '1rem 0',
};

/* ── Component ──────────────────────────────────────── */

/**
 * TaskList — renders TaskCards from props.
 *
 * Props:
 *   tasks              — array of task objects from TaskBoard state
 *   onToggleComplete(id)
 *   onEdit(task)
 *   onDelete(id)
 */
function TaskList({ tasks, onToggleComplete, onEdit, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return <p style={emptyStyle}>No tasks yet. Add your first task above!</p>;
  }

  return (
    <div style={listStyle}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
