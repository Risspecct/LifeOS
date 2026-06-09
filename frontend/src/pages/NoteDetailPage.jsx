import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NoteDetail from "../components/notes/NoteDetail";
import NoteFormModal from "../components/notes/NoteFormModal";
import { deleteNote, getNoteById, updateNote } from "../api/notesApi";
import { getApiErrorMessage } from "../utils/errorUtils";
import { useToast } from "../components/ui/ToastProvider";

const NoteDetailPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;
    const loadNote = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getNoteById(noteId);
        if (!active) return;
        setNote(data);
      } catch (loadError) {
        if (!active) return;
        setError(getApiErrorMessage(loadError, "Unable to load note."));
        setNote(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadNote();
    return () => {
      active = false;
    };
  }, [noteId]);

  const handleEdit = () => setIsEditOpen(true);

  const handleDelete = async () => {
    if (!note?.id) return;
    const shouldGoBack = note.taskId ? `/tasks/${note.taskId}/notes` : "/dashboard";
    try {
      await deleteNote(note.id);
      showToast("Note deleted");
      navigate(shouldGoBack, { replace: true });
    } catch (deleteError) {
      setActionError(getApiErrorMessage(deleteError, "Unable to delete note."));
      showToast("Unable to delete note", "error");
    }
  };

  const handleSave = async (payload) => {
    if (!note?.id) return;
    setIsSaving(true);
    setActionError("");
    try {
      const updated = await updateNote({ noteId: note.id, ...payload });
      setNote(updated);
      setIsEditOpen(false);
      showToast("Note updated");
    } catch (saveError) {
      setActionError(getApiErrorMessage(saveError, "Unable to update note."));
      showToast("Unable to update note", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-md lg:p-xl">
      <NoteDetail
        note={note}
        loading={loading}
        error={error || actionError}
        onBack={() => navigate(note?.taskId ? `/tasks/${note.taskId}/notes` : "/dashboard")}
        onEdit={note ? handleEdit : undefined}
        onDelete={note ? handleDelete : undefined}
        backLabel={note?.taskId ? "Back to Notes" : "Back to Dashboard"}
      />

      <NoteFormModal
        isOpen={isEditOpen}
        mode="edit"
        note={note}
        isSaving={isSaving}
        error={actionError}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
};

export default NoteDetailPage;
