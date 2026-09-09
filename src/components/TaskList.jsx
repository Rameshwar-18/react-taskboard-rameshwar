import TaskCard from './TaskCard';

/**
 * TaskList — renders TaskCards in a responsive CSS grid.
 *
 * Props:
 *   tasks              — array of task objects from TaskBoard state
 *   onToggleComplete(id)
 *   onEdit(task)
 *   onDelete(id)
 *   actionLoadingId    — ID of task currently undergoing a mutation
 */
function TaskList({ tasks, onToggleComplete, onEdit, onDelete, actionLoadingId }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="task-list__empty" role="status">
          <p className="task-list__empty-text">No tasks yet</p>
          <p className="task-list__empty-hint">Add your first task using the form above.</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="task-list" role="list" aria-label="Task list">
      {tasks.map((task) => {
        const taskId = task._id || task.id;
        return (
          <li key={taskId} style={{ listStyle: 'none' }}>
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              isActionLoading={actionLoadingId === taskId}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default TaskList;
