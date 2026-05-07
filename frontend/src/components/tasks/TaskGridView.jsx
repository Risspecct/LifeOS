import TaskBoardCard from "./TaskBoardCard";

const TaskGridView = ({ tasks, selectedTaskId, onSelectTask }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-sm">
      {tasks.map((task) => (
        <TaskBoardCard
          key={task.id}
          task={task}
          isActive={selectedTaskId === task.id}
          onSelectTask={onSelectTask}
        />
      ))}
    </div>
  );
};

export default TaskGridView;
