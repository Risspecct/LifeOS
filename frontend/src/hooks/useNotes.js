import { useCallback, useEffect, useMemo, useState } from "react";
import { getNotes, getTaskNotes } from "../api/notesApi";
import { getApiErrorMessage } from "../utils/errorUtils";

const sortByUpdatedAt = (notes) => {
  return [...notes].sort((a, b) => {
    const aTime = new Date(a?.updatedAt || 0).getTime();
    const bTime = new Date(b?.updatedAt || 0).getTime();
    return bTime - aTime;
  });
};

export const useNotes = (taskId = null) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadNotes = useCallback(
    async ({ force = false } = {}) => {
      if (force) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      try {
        const data = taskId ? await getTaskNotes(taskId) : await getNotes();
        setNotes(sortByUpdatedAt(Array.isArray(data) ? data : []));
      } catch (loadError) {
        setError(getApiErrorMessage(loadError, "Unable to load notes."));
        setNotes([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [taskId]
  );

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const refresh = useCallback(() => loadNotes({ force: true }), [loadNotes]);

  const updateOptimistically = useCallback((updater) => {
    setNotes((prev) => sortByUpdatedAt(updater(prev)));
  }, []);

  return useMemo(
    () => ({ notes, loading, refreshing, error, refresh, setNotes: updateOptimistically }),
    [notes, loading, refreshing, error, refresh, updateOptimistically]
  );
};
