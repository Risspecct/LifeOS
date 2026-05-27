const DashboardNoteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md sm:p-xl">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close modal" />
      <div className="relative w-full max-w-md bg-surface border border-outline-variant rounded-2xl p-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">edit_note</span>
            <h3 className="font-h3 text-h3">Quick Note</h3>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-md mb-md">
          <p className="text-label-sm text-primary">
            Quick notes and lightweight thought capture are coming soon.
          </p>
        </div>

        <div className="space-y-sm opacity-50 pointer-events-none">
          <textarea 
            rows="4" 
            placeholder="Jot down a quick thought..." 
            className="w-full rounded-lg border border-outline-variant bg-surface-container px-sm py-md text-label-sm resize-none"
            readOnly
          />
          <div className="flex justify-end">
            <button type="button" className="rounded-lg px-md py-xs bg-surface-container border border-outline-variant text-on-surface-variant text-label-sm" disabled>
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNoteModal;
