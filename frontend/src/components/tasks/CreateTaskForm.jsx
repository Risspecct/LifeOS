import { useState } from "react";
import TaskStatusSelector from "./TaskStatusSelector";
import { useToast } from "../ui/ToastProvider";
import { generateTask } from "../../api/taskApi";
import { getApiErrorMessage } from "../../utils/errorUtils";

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
  const [showAi, setShowAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showAiSuccess, setShowAiSuccess] = useState(false);
  const { showToast } = useToast();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const parseSuggestedDueDate = (dateStr) => {
    if (!dateStr) return { date: "", time: "" };
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return { date: "", time: "" };
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}` };
  };

  const handleGenerate = async () => {
    if (generating) return;
    if (!aiPrompt || !aiPrompt.trim()) {
      showToast("Enter a prompt to generate a task", "error");
      return;
    }

    setGenerating(true);
    try {
      const res = await generateTask(aiPrompt.trim());

      // Merge generated values into existing form, but do not overwrite user-provided values.
      setFormData((prev) => {
        const next = { ...prev };
        if (!prev.title && res.title) next.title = res.title;
        if (!prev.description && res.description) next.description = res.description;
        if (!prev.taskType && res.taskType) next.taskType = res.taskType;
        if ((!prev.labelId || prev.labelId === "") && (res.labelId !== undefined && res.labelId !== null)) next.labelId = String(res.labelId);

        if ((!prev.dueDate || prev.dueDate === "") && res.suggestedDueDate) {
          const parsed = parseSuggestedDueDate(res.suggestedDueDate);
          if (parsed.date) next.dueDate = parsed.date;
          if (parsed.time) next.dueTime = parsed.time;
        }

        return next;
      });

      setShowAi(false);
      setShowAiSuccess(true);
      setAiPrompt("");
      setTimeout(() => setShowAiSuccess(false), 3000);
    } catch (e) {
      const msg = getApiErrorMessage(e, "Unable to generate task.");
      showToast(msg, "error");
    } finally {
      setGenerating(false);
    }
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
      {/* AI generation lightweight action */}
      <div className="flex items-start gap-sm">
        <button
          type="button"
          onClick={() => {
            setShowAi((s) => !s);
            // clear any previous small prompt when opening
            if (!showAi) setAiPrompt("");
          }}
          className="text-label-sm text-on-surface-variant hover:text-on-surface flex items-center gap-xs"
        >
          <span aria-hidden>✨</span>
          <span>Generate with AI</span>
        </button>

        { /* subtle success indicator */ }
        {false ? null : null}
      </div>

      {showAi ? (
        <div className="mt-2">
          <label className="sr-only" htmlFor="ai-prompt">AI prompt</label>
          <textarea
            id="ai-prompt"
            name="aiPrompt"
            rows={3}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full rounded-md px-sm py-xs bg-surface-container border border-outline-variant resize-none text-label-sm"
            placeholder="Describe what you need to do..."
          />
          <p className="text-on-surface-variant text-label-xs mt-1">Example: Need to prepare for my Spring Boot interview next week.</p>

          <div className="flex justify-end items-center gap-sm mt-2">
            <button
              type="button"
              onClick={() => setShowAi(false)}
              className="rounded-md px-sm py-1 border border-outline-variant text-on-surface-variant text-label-sm"
              disabled={generating}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="rounded-md px-sm py-1 bg-primary text-on-primary text-label-sm disabled:opacity-60"
            >
              {generating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      ) : null}

      { /* small success hint */ }
      { /* show a subtle success indicator when AI suggestions applied */ }
      { /* We'll display it inline near the title field */ }
      <div className="space-y-sm">
        <div className="flex items-center justify-between">
          <label className="font-label-sm text-on-surface-variant" htmlFor="create-title">Title</label>
          {showAiSuccess ? (
            <span className="text-on-surface-variant text-label-xs flex items-center gap-xs">✓ AI suggestions applied</span>
          ) : null}
        </div>
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
