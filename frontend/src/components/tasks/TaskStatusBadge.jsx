import { getStatusLabel } from "../../utils/taskUtils";
import { getTaskStatusStyle } from "../../utils/statusConfig";

const TaskStatusBadge = ({ status }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-label-xs font-semibold tracking-wide ${getTaskStatusStyle(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
};

export default TaskStatusBadge;
