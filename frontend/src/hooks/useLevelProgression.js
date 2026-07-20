import { useCallback, useEffect, useMemo, useState } from "react";
import { getMyLevel } from "../api/levelApi";
import { DATA_REFRESH_EVENT } from "../utils/dataRefreshEvents";

export const useLevelProgression = () => {
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadLevelProgression = useCallback(async ({ force = false } = {}) => {
    if (force) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getMyLevel();
      setLevelData(data);
    } catch {
      setLevelData(null);
      setError("Unable to load level progression.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLevelProgression();
  }, [loadLevelProgression]);

  useEffect(() => {
    const refreshLevelProgression = () => loadLevelProgression({ force: true });
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        refreshLevelProgression();
      }
    };

    window.addEventListener(DATA_REFRESH_EVENT, refreshLevelProgression);
    window.addEventListener("focus", refreshLevelProgression);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener(DATA_REFRESH_EVENT, refreshLevelProgression);
      window.removeEventListener("focus", refreshLevelProgression);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [loadLevelProgression]);

  const refresh = useCallback(() => loadLevelProgression({ force: true }), [loadLevelProgression]);

  return useMemo(
    () => ({ levelData, loading, refreshing, error, refresh }),
    [levelData, loading, refreshing, error, refresh]
  );
};
