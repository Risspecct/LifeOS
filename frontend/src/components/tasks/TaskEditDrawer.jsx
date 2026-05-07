import { useEffect, useState } from "react";
import TaskStatusSelector from "./TaskStatusSelector";

const getInputDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const TaskEditDrawer = ({ task, isOpen, isSaving, error, statusOptions, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskType: "",
    status: "",
    dueDate: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!task) return;
    setFormData({
      title: task.title ?? "",
      description: task.description ?? "",
      taskType: task.taskType ?? "",
      status: task.status ?? "",
      dueDate: getInputDateTime(task.dueDate)
    });
    setFieldErrors({});
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.title.trim()) nextErrors.title = "Title is required.";
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      taskType: formData.taskType.trim(),
      status: formData.status,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/50" aria-label="Close task edit panel" />
      <div className="relative h-full w-full sm:w-[30rem] bg-surface border-l border-outline-variant p-md overflow-auto">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-h3 text-h3">Edit Task</h3>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-sm" noValidate>
          <div className="space-y-xs">
            <label className="font-label-sm text-on-surface-variant" htmlFor="task-title">Title</label>
            <input
              id="task-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full rounded-lg px-sm py-xs bg-surface-container border ${fieldErrors.title ? "border-error" : "border-outline-variant"}`}
            />
            {fieldErrors.title ? <p className="text-error text-label-xs">{fieldErrors.title}</p> : null}
          </div>
          <div className="space-y-xs">
            <label className="font-label-sm text-on-surface-variant" htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant resize-none"
            />
          </div>
          <div className="space-y-xs">
            <label className="font-label-sm text-on-surface-variant" htmlFor="task-type">Task Type</label>
            <input
              id="task-type"
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
              className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant"
            />
          </div>
          <div className="space-y-xs">
            <label className="font-label-sm text-on-surface-variant" htmlFor="task-status">Status</label>
            <TaskStatusSelector
              id="task-status"
              value={formData.status}
              options={statusOptions}
              disabled={isSaving}
              onChange={(value) => handleChange({ target: { name: "status", value } })}
            />
          </div>
          <div className="space-y-xs">
            <label className="font-label-sm text-on-surface-variant" htmlFor="task-dueDate">Due Date</label>
            <input
              id="task-dueDate"
              name="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant"
            />
          </div>
          {error ? <p className="text-error text-label-sm">{error}</p> : null}
          <div className="flex justify-end gap-sm pt-sm">
            <button type="button" onClick={onClose} className="rounded-lg px-md py-xs border border-outline-variant text-on-surface-variant">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="rounded-lg px-md py-xs bg-primary text-on-primary disabled:opacity-60">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditDrawer;
