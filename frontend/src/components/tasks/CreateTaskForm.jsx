import { useState } from "react";
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

const CreateTaskForm = ({
  isCreating,
  error,
  statusOptions,
  labels = [],
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});

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

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      taskType: formData.taskType.trim(),
      labelId: formData.labelId ? Number(formData.labelId) : null,
      dueDate: finalDueDate
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-md" noValidate>
      <div className="space-y-sm">
        <label className="font-label-sm text-on-surface-variant" htmlFor="create-title">Title</label>
        <input
          id="create-title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full rounded-lg px-sm py-xs bg-surface-container border ${fieldErrors.title ? "border-error" : "border-outline-variant"}`}
        />
        {fieldErrors.title ? <p className="text-error text-label-xs">{fieldErrors.title}</p> : null}
      </div>

      <div className="space-y-sm">
        <label className="font-label-sm text-on-surface-variant" htmlFor="create-description">Description</label>
        <textarea
          id="create-description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
        <div className="space-y-sm min-w-0">
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
        <div className="space-y-sm min-w-0">
          <label className="font-label-sm text-on-surface-variant" htmlFor="create-taskType">Task Type</label>
          <input
            id="create-taskType"
            name="taskType"
            value={formData.taskType}
            onChange={handleChange}
            placeholder="e.g. ASSIGNMENT"
            className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant"
          />
        </div>
      </div>

      <div className="space-y-sm">
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
        <div className="space-y-sm min-w-0">
          <label className="font-label-sm text-on-surface-variant" htmlFor="create-dueDate">Due Date</label>
          <input
            id="create-dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className={`w-full rounded-lg px-sm py-xs bg-surface-container border ${fieldErrors.dueDate ? "border-error" : "border-outline-variant"}`}
          />
          {fieldErrors.dueDate ? <p className="text-error text-label-xs">{fieldErrors.dueDate}</p> : null}
        </div>
        <div className="space-y-sm min-w-0">
          <label className="font-label-sm text-on-surface-variant" htmlFor="create-dueTime">Time</label>
          <input
            id="create-dueTime"
            name="dueTime"
            type="time"
            placeholder="Optional"
            value={formData.dueTime}
            onChange={handleChange}
            className="w-full rounded-lg px-sm py-xs bg-surface-container border border-outline-variant"
          />
        </div>
      </div>

      {error ? <p className="text-error text-label-sm">{error}</p> : null}

      <div className="flex flex-col sm:flex-row justify-end items-center gap-sm pt-sm">
        <button type="button" onClick={onCancel} className="rounded-lg px-md py-xs border border-outline-variant text-on-surface-variant text-label-sm">
          Cancel
        </button>
        <button type="submit" disabled={isCreating} className="rounded-lg px-md py-xs bg-primary text-on-primary text-label-sm disabled:opacity-60">
          {isCreating ? "Creating..." : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default CreateTaskForm;
