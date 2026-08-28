import TaskCard from './TaskCard';

/**
 * TaskList — renders TaskCards in a responsive CSS grid.
 *
 * Props:
 *   tasks              — array of task objects from TaskBoard state
 *   onToggleComplete(id)
 *   onEdit(task)
 *   onDelete(id)
 *
 * Styling: index.css (.task-list, .task-list__empty, etc.)
 */
function TaskList({ tasks, onToggleComplete, onEdit, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="task-list__empty" role="status">
          <span className="task-list__empty-icon" aria-hidden="true">📭</span>
          <p className="task-list__empty-text">No tasks yet</p>
          <p className="task-list__empty-hint">Add your first task using the form above.</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="task-list" role="list" aria-label="Task list">
      {tasks.map((task) => (
        <li key={task.id} style={{ listStyle: 'none' }}>
          <TaskCard
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
