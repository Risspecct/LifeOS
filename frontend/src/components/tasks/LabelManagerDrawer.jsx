import { useMemo, useState } from "react";

const colorOptions = ["RED", "ORANGE", "BLUE", "PURPLE", "GREEN", "YELLOW", "CYAN", "SLATE"];

const colorClass = {
  RED: "bg-rose-400",
  ORANGE: "bg-orange-400",
  BLUE: "bg-blue-400",
  PURPLE: "bg-purple-400",
  GREEN: "bg-emerald-400",
  YELLOW: "bg-amber-300",
  CYAN: "bg-cyan-300",
  SLATE: "bg-slate-400"
};

const initialForm = { name: "", color: "CYAN", priorityWeight: 10 };

const LabelManagerDrawer = ({
  isOpen,
  labels,
  loading,
  saving,
  error,
  infoMessage,
  onClose,
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
  onSeedDefaults
}) => {
  const [form, setForm] = useState(initialForm);
  const [editingLabelId, setEditingLabelId] = useState(null);

  const editingLabel = useMemo(
    () => labels.find((label) => label.id === editingLabelId) || null,
    [labels, editingLabelId]
  );

  if (!isOpen) return null;

  const submitLabel = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    const payload = {
      name: form.name.trim(),
      color: form.color,
      priorityWeight: Number(form.priorityWeight) || 0
    };
    if (editingLabelId) {
      await onUpdateLabel(editingLabelId, payload);
      setEditingLabelId(null);
    } else {
      await onCreateLabel(payload);
    }
    setForm(initialForm);
  };

  return (
    <div className="fixed inset-0 z-[58] flex justify-end">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/40" aria-label="Close label manager" />
      <aside className="relative h-full w-full sm:w-[30rem] bg-surface border-l border-outline-variant shadow-2xl p-md space-y-md overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-h3 text-h3">Manage Labels</h3>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error ? <p className="text-error text-label-sm">{error}</p> : null}
        {infoMessage ? <p className="text-primary text-label-sm">{infoMessage}</p> : null}

        <section className="space-y-sm">
          <h4 className="font-label-sm uppercase tracking-wider text-on-surface-variant">Labels</h4>
          {loading ? <p className="text-on-surface-variant text-label-sm">Loading labels...</p> : null}
          <div className="space-y-xs">
            {labels.map((label) => (
              <div key={label.id} className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container p-sm">
                <div className="flex items-center gap-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${colorClass[label.color] ?? "bg-cyan-300"}`} />
                  <span className="font-label-sm">{label.name}</span>
                  <span className="text-[10px] text-on-surface-variant">W{label.priorityWeight ?? 0}</span>
                </div>
                <div className="flex items-center gap-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLabelId(label.id);
                      setForm({
                        name: label.name || "",
                        color: label.color || "CYAN",
                        priorityWeight: label.priorityWeight ?? 0
                      });
                    }}
                    className="p-1 text-on-surface-variant hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button type="button" onClick={() => onDeleteLabel(label.id)} className="p-1 text-on-surface-variant hover:text-error">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
            {!loading && labels.length === 0 ? <p className="text-label-sm text-on-surface-variant">No labels yet.</p> : null}
          </div>
        </section>

        <section className="space-y-sm rounded-xl border border-outline-variant bg-surface-container p-sm">
          <h4 className="font-label-sm uppercase tracking-wider text-on-surface-variant">
            {editingLabel ? `Edit ${editingLabel.name}` : "Create Label"}
          </h4>
          <form onSubmit={submitLabel} className="space-y-sm">
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Label name"
              className="w-full rounded-lg border border-outline-variant bg-surface px-sm py-xs text-label-sm"
            />
            <div className="grid grid-cols-2 gap-sm">
              <select
                value={form.color}
                onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
                className="rounded-lg border border-outline-variant bg-surface px-sm py-xs text-label-sm"
              >
                {colorOptions.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              <input
                type="number"
                value={form.priorityWeight}
                onChange={(event) => setForm((prev) => ({ ...prev, priorityWeight: event.target.value }))}
                placeholder="Weight"
                className="rounded-lg border border-outline-variant bg-surface px-sm py-xs text-label-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" disabled={saving} className="rounded-lg px-md py-xs bg-primary text-on-primary text-label-sm disabled:opacity-60">
                {saving ? "Saving..." : editingLabel ? "Update Label" : "Create Label"}
              </button>
              {editingLabel ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingLabelId(null);
                    setForm(initialForm);
                  }}
                  className="text-label-sm text-on-surface-variant hover:text-on-surface"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-outline-variant bg-surface-container p-sm flex items-center justify-between gap-sm">
          <p className="text-label-sm text-on-surface-variant">Add recommended starter labels.</p>
          <button type="button" onClick={onSeedDefaults} disabled={saving} className="rounded-lg px-sm py-xs border border-outline-variant text-primary text-label-sm disabled:opacity-60">
            Add Recommended Labels
          </button>
        </section>
      </aside>
    </div>
  );
};

export default LabelManagerDrawer;
