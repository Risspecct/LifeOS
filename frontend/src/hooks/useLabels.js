import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createLabel as createLabelApi,
  deleteLabel as deleteLabelApi,
  getLabels,
  seedDefaultLabels as seedDefaultLabelsApi,
  updateLabel as updateLabelApi
} from "../api/labelApi";
import { getApiErrorMessage } from "../utils/errorUtils";

export const useLabels = () => {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getLabels();
      setLabels(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, "Unable to load labels."));
      setLabels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createLabel = useCallback(async (payload) => {
    setSaving(true);
    try {
      await createLabelApi(payload);
      await refresh();
    } finally {
      setSaving(false);
    }
  }, [refresh]);

  const updateLabel = useCallback(async (labelId, payload) => {
    setSaving(true);
    try {
      await updateLabelApi(labelId, payload);
      await refresh();
    } finally {
      setSaving(false);
    }
  }, [refresh]);

  const deleteLabel = useCallback(async (labelId) => {
    setSaving(true);
    try {
      await deleteLabelApi(labelId);
      await refresh();
    } finally {
      setSaving(false);
    }
  }, [refresh]);

  const addDefaults = useCallback(async () => {
    setSaving(true);
    try {
      await seedDefaultLabelsApi();
      await refresh();
    } finally {
      setSaving(false);
    }
  }, [refresh]);

  return useMemo(
    () => ({
      labels,
      loading,
      saving,
      error,
      refresh,
      createLabel,
      updateLabel,
      deleteLabel,
      addDefaults
    }),
    [labels, loading, saving, error, refresh, createLabel, updateLabel, deleteLabel, addDefaults]
  );
};
