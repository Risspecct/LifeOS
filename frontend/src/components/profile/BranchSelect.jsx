const BranchSelect = ({
  value,
  branchesLoading,
  branches,
  error,
  onSelectChange,
  onOpenAddBranch
}) => {
  const hasNoBranches = !branchesLoading && branches.length === 0;

  return (
    <div className="space-y-xs">
      <label className="font-label-sm text-on-surface-variant" htmlFor="branchId">Branch</label>

      <select
        id="branchId"
        name="branchId"
        value={value}
        onChange={onSelectChange}
        disabled={branchesLoading}
        className={`w-full rounded-lg px-sm py-xs bg-surface border ${error ? "border-error" : "border-outline-variant"} disabled:opacity-70`}
      >
        <option value="">{branchesLoading ? "Loading branches..." : "Select branch..."}</option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
            {branch.code ? ` (${branch.code})` : ""}
          </option>
        ))}
      </select>

      {error ? <p className="text-error text-label-xs">{error}</p> : null}

      <div className="rounded-lg border border-outline-variant/70 bg-surface-container/60 p-sm">
        {hasNoBranches ? (
          <div className="flex items-center justify-between gap-sm">
            <p className="text-on-surface-variant text-label-sm">No branches available yet.</p>
            <button
              type="button"
              onClick={onOpenAddBranch}
              className="text-primary font-label-sm hover:underline"
            >
              Can&apos;t find your branch?
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-sm">
            <p className="text-on-surface-variant text-label-sm">Can&apos;t find your branch?</p>
            <button
              type="button"
              onClick={onOpenAddBranch}
              className="text-primary font-label-sm hover:underline"
            >
              Add new branch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchSelect;
