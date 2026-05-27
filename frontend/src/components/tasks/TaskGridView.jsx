import TaskBoardCard from "./TaskBoardCard";

const TaskGridView = ({ tasks, selectedTaskId, onSelectTask, priorityView = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-sm">
      {tasks.map((task) => (
        <TaskBoardCard
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

export default TaskGridView;
