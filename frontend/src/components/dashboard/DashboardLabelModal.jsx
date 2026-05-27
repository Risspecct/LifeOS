import { useState, useEffect } from "react";

const colorOptions = ["RED", "ORANGE", "BLUE", "PURPLE", "GREEN", "YELLOW", "CYAN", "SLATE"];

const initialForm = { name: "", color: "CYAN", priorityWeight: 10 };

const DashboardLabelModal = ({ isOpen, isCreating, error, onClose, onCreateLabel }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    const payload = {
      name: form.name.trim(),
      color: form.color,
      priorityWeight: Number(form.priorityWeight) || 0
    };
    await onCreateLabel(payload);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md sm:p-xl">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close modal" />
      <div className="relative w-full max-w-sm bg-surface border border-outline-variant rounded-2xl p-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h3 className="font-h3 text-h3">Add Label</h3>
            <p className="text-label-sm text-on-surface-variant mt-xs">Create a new organizational tag.</p>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error ? <p className="text-error text-label-sm mb-md">{error}</p> : null}

        <form onSubmit={handleSubmit} className="space-y-md">
          <div className="space-y-xs">
            <label className="font-label-sm text-on-surface-variant" htmlFor="label-name">Name</label>
            <input
              id="label-name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="e.g. WORK"
              className="w-full rounded-lg border border-outline-variant bg-surface-container px-sm py-xs text-label-sm"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <label className="font-label-sm text-on-surface-variant" htmlFor="label-color">Color</label>
              <select
                id="label-color"
                value={form.color}
                onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
                className="w-full rounded-lg border border-outline-variant bg-surface-container px-sm py-xs text-label-sm"
              >
                {colorOptions.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            <div className="space-y-xs">
              <label className="font-label-sm text-on-surface-variant" htmlFor="label-weight">Weight</label>
              <input
                id="label-weight"
                type="number"
                value={form.priorityWeight}
                onChange={(event) => setForm((prev) => ({ ...prev, priorityWeight: event.target.value }))}
                placeholder="10"
                className="w-full rounded-lg border border-outline-variant bg-surface-container px-sm py-xs text-label-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-sm pt-sm">
            <button type="button" onClick={onClose} className="rounded-lg px-md py-xs border border-outline-variant text-on-surface-variant text-label-sm">
              Cancel
            </button>
            <button type="submit" disabled={isCreating || !form.name.trim()} className="rounded-lg px-md py-xs bg-primary text-on-primary text-label-sm disabled:opacity-60">
              {isCreating ? "Adding..." : "Add Label"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardLabelModal;
