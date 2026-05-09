import { useMemo } from "react";
import BranchSelect from "./BranchSelect";

const ProfileEditForm = ({
  formData,
  errors,
  apiError,
  onChange,
  branchField,
  isSaving,
  onSubmit
}) => {
  const yearOptions = useMemo(() => [1, 2, 3, 4], []);

  return (
    <form className="bg-surface-container border border-outline-variant rounded-xl p-lg space-y-md" onSubmit={onSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="space-y-xs">
          <label className="font-label-sm text-on-surface-variant" htmlFor="name">Name</label>
          <input id="name" name="name" value={formData.name} onChange={onChange} className={`w-full rounded-lg px-sm py-xs bg-surface border ${errors.name ? "border-error" : "border-outline-variant"}`} />
          {errors.name ? <p className="text-error text-label-xs">{errors.name}</p> : null}
        </div>
        <div className="space-y-xs">
          <label className="font-label-sm text-on-surface-variant" htmlFor="age">Age</label>
          <input id="age" name="age" type="number" value={formData.age} onChange={onChange} className={`w-full rounded-lg px-sm py-xs bg-surface border ${errors.age ? "border-error" : "border-outline-variant"}`} />
          {errors.age ? <p className="text-error text-label-xs">{errors.age}</p> : null}
        </div>
        <div className="space-y-xs">
          <label className="font-label-sm text-on-surface-variant" htmlFor="college">College</label>
          <input id="college" name="college" value={formData.college} onChange={onChange} className={`w-full rounded-lg px-sm py-xs bg-surface border ${errors.college ? "border-error" : "border-outline-variant"}`} />
          {errors.college ? <p className="text-error text-label-xs">{errors.college}</p> : null}
        </div>
        <div className="space-y-xs">
          <label className="font-label-sm text-on-surface-variant" htmlFor="year">Year</label>
          <select id="year" name="year" value={formData.year} onChange={onChange} className={`w-full rounded-lg px-sm py-xs bg-surface border ${errors.year ? "border-error" : "border-outline-variant"}`}>
            <option value="">Select year...</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>Year {year}</option>
            ))}
          </select>
          {errors.year ? <p className="text-error text-label-xs">{errors.year}</p> : null}
        </div>
      </div>

      <BranchSelect
        value={formData.branchId}
        branchesLoading={branchField.branchesLoading}
        branches={branchField.branches}
        error={errors.branchId}
        onSelectChange={onChange}
        onOpenAddBranch={branchField.onOpenAddBranch}
      />

      <div className="space-y-xs">
        <label className="font-label-sm text-on-surface-variant" htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows="4"
          value={formData.bio}
          onChange={onChange}
          className="w-full rounded-lg px-sm py-xs bg-surface border border-outline-variant resize-none"
          placeholder="Tell others what you're working on."
        />
      </div>

      {apiError ? <p className="text-error bg-error-container/20 border border-error-container rounded-lg px-sm py-xs">{apiError}</p> : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg px-lg py-xs bg-primary text-on-primary hover:opacity-90 disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
