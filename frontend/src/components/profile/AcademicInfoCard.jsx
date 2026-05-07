const AcademicInfoCard = ({ college, branch, year }) => {
  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-md space-y-sm">
      <h3 className="font-h3 text-h3 text-on-surface">Academic Snapshot</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm text-body-md">
        <div>
          <p className="text-on-surface-variant font-label-sm">College</p>
          <p className="text-on-surface">{college || "Not set"}</p>
        </div>
        <div>
          <p className="text-on-surface-variant font-label-sm">Branch</p>
          <p className="text-on-surface">{branch || "Not set"}</p>
        </div>
        <div>
          <p className="text-on-surface-variant font-label-sm">Year</p>
          <p className="text-on-surface">{year ? `Year ${year}` : "Not set"}</p>
        </div>
      </div>
    </section>
  );
};

export default AcademicInfoCard;
