import TaskListRow from "./TaskListRow";

const TaskListView = ({ tasks, selectedTaskId, onSelectTask }) => {
  return (
    <div className="space-y-xs">
      {tasks.map((task) => (
        <TaskListRow
          key={task.id}
          task={task}
          isActive={selectedTaskId === task.id}
          onSelectTask={onSelectTask}
        />
      ))}
    </div>
  );
};

export default TaskListView;
