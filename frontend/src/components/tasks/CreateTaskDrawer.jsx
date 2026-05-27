import { useEffect } from "react";
import CreateTaskForm from "./CreateTaskForm";

const CreateTaskDrawer = ({ isOpen, isCreating, error, statusOptions, labels = [], onClose, onCreateTask }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/50" aria-label="Close create task drawer" />
      <div className="relative h-full w-full sm:w-[32rem] bg-surface border-l border-outline-variant p-md overflow-auto">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-h3 text-h3">Create Task</h3>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
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

export default CreateTaskDrawer;
