const statItems = [
  { label: "Study Sessions", value: "24" },
  { label: "Tasks Completed", value: "87" },
  { label: "Focus Score", value: "91%" }
];

const ProfileStatsCard = () => {
  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-md">
      <h3 className="font-h3 text-h3 text-on-surface mb-sm">Performance Signals</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
        {statItems.map((item) => (
          <div key={item.label} className="rounded-lg bg-surface-container-high border border-outline-variant p-sm">
            <p className="text-on-surface-variant font-label-sm">{item.label}</p>
            <p className="text-on-surface font-h3 text-h3">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileStatsCard;
