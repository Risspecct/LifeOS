import { useEffect, useState } from "react";

const initialState = { name: "", code: "" };

const AddBranchModal = ({ isOpen, isSubmitting, error, onClose, onCreate }) => {
  const [formData, setFormData] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialState);
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
    if (!formData.name.trim()) nextErrors.name = "Branch name is required.";
    if (!formData.code.trim()) nextErrors.code = "Branch code is required.";
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    await onCreate({
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase()
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity"
        aria-label="Close add branch modal"
      />
      <div className="relative w-full max-w-md bg-surface border border-outline-variant rounded-xl p-md shadow-2xl transition-all duration-200">
        <h3 className="font-h3 text-h3 text-on-surface">Add New Branch</h3>
        <p className="text-on-surface-variant mt-1">Create your branch once and use it across LifeOS forms.</p>

        <form className="mt-md space-y-sm" onSubmit={handleSubmit} noValidate>
          <div className="space-y-xs">
            <label className="font-label-sm text-on-surface-variant" htmlFor="branch-name">Branch Name</label>
            <input
              id="branch-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Artificial Intelligence"
              className={`w-full rounded-lg px-sm py-xs bg-surface-container border ${fieldErrors.name ? "border-error" : "border-outline-variant"}`}
            />
            {fieldErrors.name ? <p className="text-error text-label-xs">{fieldErrors.name}</p> : null}
          </div>

          <div className="space-y-xs">
            <label className="font-label-sm text-on-surface-variant" htmlFor="branch-code">Branch Code</label>
            <input
              id="branch-code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. AI"
              className={`w-full rounded-lg px-sm py-xs bg-surface-container border ${fieldErrors.code ? "border-error" : "border-outline-variant"}`}
            />
            {fieldErrors.code ? <p className="text-error text-label-xs">{fieldErrors.code}</p> : null}
          </div>

          {error ? (
            <p className="text-error text-label-sm bg-error-container/20 border border-error-container rounded-lg px-sm py-xs">{error}</p>
          ) : null}

          <div className="flex justify-end gap-sm pt-xs">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-md py-xs border border-outline-variant text-on-surface-variant hover:bg-surface-container-high disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg px-md py-xs bg-primary text-on-primary hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? "Adding..." : "Add Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBranchModal;
