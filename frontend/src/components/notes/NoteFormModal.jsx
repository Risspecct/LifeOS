import { useEffect, useMemo, useRef, useState } from "react";
import { getAllTasks } from "../../api/taskApi";
import { getApiErrorMessage } from "../../utils/errorUtils";

const initialForm = {
  title: "",
  message: "",
  taskId: ""
};

const markupForAction = {
  bold: "**",
  italic: "_",
  code: "`"
};

const NoteFormModal = ({
  isOpen,
  mode = "create",
  note = null,
  defaultTaskId = "",
  isSaving = false,
  error = "",
  onClose,
  onSubmit
}) => {
  const [form, setForm] = useState(initialForm);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskLoadError, setTaskLoadError] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      title: note?.title ?? "",
      message: note?.message ?? note?.content ?? "",
      taskId: note?.taskId ?? defaultTaskId ?? ""
    });
  }, [isOpen, note, defaultTaskId]);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    const loadTasks = async () => {
      setLoadingTasks(true);
      setTaskLoadError("");
      try {
        const data = await getAllTasks();
        if (!active) return;
        setTasks(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (!active) return;
        setTaskLoadError(getApiErrorMessage(loadError, "Unable to load task options."));
        setTasks([]);
      } finally {
        if (active) setLoadingTasks(false);
      }
    };

    loadTasks();
    return () => {
      active = false;
    };
  }, [isOpen]);

  const taskOptions = useMemo(() => {
    return tasks.map((task) => ({
      value: String(task.id),
      label: task.title || `Task ${task.id}`
    }));
  }, [tasks]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const insertMarkup = (action) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const markup = markupForAction[action];
    if (!markup) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.slice(selectionStart, selectionEnd);
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);

    const nextValue = `${before}${markup}${selectedText}${markup}${after}`;
    setForm((prev) => ({ ...prev, message: nextValue }));

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart + markup.length, selectionEnd + markup.length);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      taskId: form.taskId ? Number(form.taskId) : null
    };
    await onSubmit?.(payload);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md sm:p-xl">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close note modal" />
      <div className="relative w-full max-w-3xl bg-surface border border-outline-variant rounded-2xl shadow-2xl max-h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-md py-sm border-b border-outline-variant bg-surface-container">
          <div>
            <h3 className="font-h3 text-h3">{mode === "edit" ? "Edit Note" : "Create Note"}</h3>
            <p className="text-label-sm text-on-surface-variant mt-1">Capture research, reminders, or task context.</p>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(88vh-72px)]">
          <div className="flex-1 overflow-y-auto p-sm md:p-md space-y-sm">
            <div className="space-y-xs">
              <label className="block text-label-xs uppercase tracking-widest text-on-surface-variant font-bold" htmlFor="note-title">
                Note Title
              </label>
              <input
                id="note-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter a descriptive title..."
                className="w-full border-b-2 border-outline-variant bg-transparent py-xs text-h3 font-h3 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors"
                autoFocus
              />
            </div>

            <div className="space-y-xs">
              <label className="block text-label-xs uppercase tracking-widest text-on-surface-variant font-bold" htmlFor="note-task">
                Optional Task
              </label>
              <select
                id="note-task"
                name="taskId"
                value={form.taskId}
                onChange={handleChange}
                className="w-full rounded-xl border border-outline-variant bg-surface-container px-sm py-sm text-label-sm"
              >
                <option value="">Standalone note</option>
                {taskOptions.map((task) => (
                  <option key={task.value} value={task.value}>
                    {task.label}
                  </option>
                ))}
              </select>
              {loadingTasks ? <p className="text-label-xs text-on-surface-variant">Loading task options...</p> : null}
              {taskLoadError ? <p className="text-label-xs text-error">{taskLoadError}</p> : null}
            </div>

            <div className="flex flex-wrap items-center gap-xs border-b border-outline-variant pb-xs">
              {["bold", "italic", "code"].map((action) => (
                <button
                  key={action}
                  type="button"
                  title={action}
                  onClick={() => insertMarkup(action)}
                  className="rounded-lg p-xs text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {action === "bold" ? "format_bold" : action === "italic" ? "format_italic" : "code"}
                  </span>
                </button>
              ))}
              <div className="ml-auto text-label-xs text-on-surface-variant flex items-center gap-xs">
                <span className="material-symbols-outlined text-[14px]">markdown</span>
                Markdown supported
              </div>
            </div>

            <div className="space-y-xs">
              <label className="block text-label-xs uppercase tracking-widest text-on-surface-variant font-bold" htmlFor="note-message">
                Content
              </label>
              <textarea
                ref={textareaRef}
                id="note-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Start typing your thoughts, logs, or technical documentation..."
                className="w-full min-h-[280px] resize-none bg-transparent text-body-md font-body-md text-on-surface leading-relaxed focus:outline-none placeholder:text-on-surface-variant/30"
              />
            </div>

            {error ? <p className="text-error text-label-sm">{error}</p> : null}
          </div>

          <div className="px-sm md:px-md py-sm border-t border-outline-variant bg-surface-container flex items-center justify-between gap-sm">
            <p className="text-label-xs text-on-surface-variant">
              {mode === "edit" ? "Update the note and keep it linked if needed." : "Save as standalone or link it to a task."}
            </p>
            <div className="flex items-center gap-sm">
              <button type="button" onClick={onClose} className="rounded-lg px-md py-xs text-label-sm text-on-surface-variant hover:text-on-surface">
                Cancel
              </button>
              <button type="submit" disabled={isSaving || !form.title.trim()} className="rounded-lg bg-primary px-xl py-xs text-label-sm font-bold text-on-primary disabled:opacity-60">
                {isSaving ? "Saving..." : mode === "edit" ? "Update Note" : "Save Note"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteFormModal;
