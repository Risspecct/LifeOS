import { useNavigate } from "react-router-dom";

const QuickActionsSection = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "Create Task", icon: "add_circle", onClick: () => navigate("/tasks?intent=create") },
    { label: "Quick Note", icon: "edit_note", onClick: () => navigate("/tasks?intent=quick-note") },
    { label: "Add Label", icon: "label", onClick: () => navigate("/tasks?intent=add-label") }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          className="flex items-center justify-between p-md bg-surface-container border border-outline-variant rounded-xl hover:bg-secondary-container/10 transition-colors group"
        >
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">{action.icon}</span>
            <span className="font-label-sm">{action.label}</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsSection;
