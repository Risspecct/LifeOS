import CreateTaskForm from "../tasks/CreateTaskForm";

const DashboardTaskModal = ({ isOpen, isCreating, error, statusOptions, labels = [], onClose, onCreateTask }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md sm:p-xl">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close modal" />
      <div className="relative w-full max-w-xl bg-surface border border-outline-variant rounded-2xl p-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h3 className="font-h3 text-h3">Quick Task</h3>
            <p className="text-label-sm text-on-surface-variant mt-xs">Capture a new task to your workspace.</p>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <CreateTaskForm
          isCreating={isCreating}
          error={error}
          statusOptions={statusOptions}
          labels={labels}
          onSubmit={onCreateTask}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default DashboardTaskModal;
