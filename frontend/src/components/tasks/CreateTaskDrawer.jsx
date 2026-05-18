import { useEffect, useState } from "react";
import TaskStatusSelector from "./TaskStatusSelector";

const initialForm = {
  title: "",
  description: "",
  status: "TO_DO",
  taskType: "",
  labelId: "",
  dueDate: "",
  dueTime: ""
};

const CreateTaskDrawer = ({ isOpen, isCreating, error, statusOptions, labels = [], onClose, onCreateTask }) => {
  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
      setFieldErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.title.trim()) nextErrors.title = "Title is required.";
    if (!formData.status) nextErrors.status = "Status is required.";
    if (formData.dueDate && Number.isNaN(new Date(`${formData.dueDate}T00:00:00`).getTime())) {
      nextErrors.dueDate = "Enter a valid due date.";
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
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

    await onCreateTask({
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      taskType: formData.taskType.trim(),
      labelId: formData.labelId ? Number(formData.labelId) : null,
      dueDate: finalDueDate
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/50" aria-label="Close create task drawer" />
      <div className="relative h-full w-full sm:w-[32rem] bg-surface border-l border-outline-variant p-md overflow-auto">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-h3 text-h3">Create Task</h3>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-sm" noValidate>
          <div className="space-y-xs">
            <label className="font-label-sm text-on-surface-variant" htmlFor="create-title">Title</label>
            <input id="create-title" name="title" value={formData.title} onChange={handleChange} className={`w-full rounded-lg px-sm py-xs bg-surface-container border ${fieldErrors.title ? "border-error" : "border-outline-variant"}`} />
            {fieldErrors.title ? <p className="text-error text-label-xs">{fieldErrors.title}</p> : null}
          </div>

          <div className="space-y-xs">
            <label className="font-label-sm text-on-surface-variant" htmlFor="create-description">Description</label>
            <textarea id="create-description" name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <label className="font-label-sm text-on-surface-variant" htmlFor="create-status">Status</label>
              <TaskStatusSelector
                id="create-status"
                value={formData.status}
                options={statusOptions}
                disabled={isCreating}
                onChange={(value) => handleChange({ target: { name: "status", value } })}
              />
              {fieldErrors.status ? <p className="text-error text-label-xs">{fieldErrors.status}</p> : null}
            </div>
            <div className="space-y-xs">
              <label className="font-label-sm text-on-surface-variant" htmlFor="create-taskType">Task Type</label>
              <input id="create-taskType" name="taskType" value={formData.taskType} onChange={handleChange} placeholder="e.g. ASSIGNMENT" className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <label className="font-label-sm text-on-surface-variant" htmlFor="create-label">Label</label>
              <select
                id="create-label"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant" htmlFor="create-dueDate">Due Date</label>
                <input id="create-dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} className={`w-full rounded-lg px-sm py-xs bg-surface-container border ${fieldErrors.dueDate ? "border-error" : "border-outline-variant"}`} />
                {fieldErrors.dueDate ? <p className="text-error text-label-xs">{fieldErrors.dueDate}</p> : null}
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant" htmlFor="create-dueTime">Time (Optional)</label>
                <input id="create-dueTime" name="dueTime" type="time" value={formData.dueTime} onChange={handleChange} className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant" />
              </div>
            </div>
          </div>

          {error ? <p className="text-error text-label-sm">{error}</p> : null}

          <div className="flex justify-end gap-sm pt-sm">
            <button type="button" onClick={onClose} className="rounded-lg px-md py-xs border border-outline-variant text-on-surface-variant">
              Cancel
            </button>
            <button type="submit" disabled={isCreating} className="rounded-lg px-md py-xs bg-primary text-on-primary disabled:opacity-60">
              {isCreating ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskDrawer;
