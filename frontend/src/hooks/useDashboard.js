import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchDashboardData, getEmptyDashboard } from "../features/dashboard/dashboardService";
import { getApiErrorMessage } from "../utils/errorUtils";

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState(() => getEmptyDashboard());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async ({ force = false } = {}) => {
    if (force) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");
    try {
      const data = await fetchDashboardData({ force });
      setDashboard(data);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, "Unable to load dashboard."));
      setDashboard(getEmptyDashboard());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const refresh = useCallback(() => loadDashboard({ force: true }), [loadDashboard]);

  const updateOptimistically = useCallback((updater) => {
    setDashboard((prev) => updater(prev));
  }, []);

  return useMemo(
    () => ({ dashboard, loading, refreshing, error, refresh, updateOptimistically }),
    [dashboard, loading, refreshing, error, refresh, updateOptimistically]
  );
};
