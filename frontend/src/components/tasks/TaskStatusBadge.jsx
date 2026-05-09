import { getStatusLabel } from "../../utils/taskUtils";
import { getTaskStatusStyle } from "../../utils/statusConfig";

const TaskStatusBadge = ({ status }) => {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getTaskStatusStyle(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
};

export default TaskStatusBadge;
