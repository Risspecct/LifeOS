import { useEffect, useState } from "react";
import TaskStatusSelector from "./TaskStatusSelector";

const parseDateString = (value) => {
  if (!value) return { date: "", time: "" };
  const withoutZ = String(value).replace("Z", "").replace(/\+.*$/, "");
  const [datePart, timePart] = withoutZ.split("T");
  
  if (!timePart) return { date: datePart || "", time: "" };
  
  const timeStr = timePart.substring(0, 5);
  if (timePart.startsWith("23:59:59")) {
    return { date: datePart, time: "" };
  }
  return { date: datePart, time: timeStr };
};

const TaskEditDrawer = ({ task, isOpen, isSaving, error, statusOptions, labels = [], onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskType: "",
    labelId: "",
    status: "",
    dueDate: "",
    dueTime: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!task) return;
    setFormData({
      title: task.title ?? "",
      description: task.description ?? "",
      taskType: task.taskType ?? "",
      labelId: task.labelId ?? "",
      status: task.status ?? "",
      dueDate: parseDateString(task.dueDate).date,
      dueTime: parseDateString(task.dueDate).time
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
    let finalDueDate = null;
    if (formData.dueDate) {
      if (formData.dueTime) {
        finalDueDate = `${formData.dueDate}T${formData.dueTime}:00`;
      } else {
        finalDueDate = `${formData.dueDate}T23:59:59`;
      }
    }

    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      taskType: formData.taskType.trim(),
      labelId: formData.labelId ? Number(formData.labelId) : null,
      status: formData.status,
      dueDate: finalDueDate
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
            <label className="font-label-sm text-on-surface-variant" htmlFor="task-label">Label</label>
            <select
              id="task-label"
              name="labelId"
              value={formData.labelId}
              onChange={handleChange}
              className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant"
            >
              <option value="">No label</option>
              {labels.map((label) => (
                <option key={label.id} value={label.id}>{label.name}</option>
              ))}
            </select>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <label className="font-label-sm text-on-surface-variant" htmlFor="task-dueDate">Due Date</label>
              <input
                id="task-dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant"
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-sm text-on-surface-variant" htmlFor="task-dueTime">Due Time</label>
              <input
                id="task-dueTime"
                name="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={handleChange}
                className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant"
              />
            </div>
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
