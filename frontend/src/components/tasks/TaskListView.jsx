import TaskListRow from "./TaskListRow";

const TaskListView = ({ tasks, selectedTaskId, onSelectTask, priorityView = false }) => {
  return (
    <div className="space-y-xs">
      {tasks.map((task) => (
        <TaskListRow
          key={task.id}
          task={task}
          isActive={selectedTaskId === task.id}
          onSelectTask={onSelectTask}
          priorityView={priorityView}
        />
      ))}
    </div>
  );
};

export default TaskListView;
