import { useCallback, useEffect, useMemo, useState } from "react";
import { getFriendFeed } from "../api/friendsApi";
import { getApiErrorMessage } from "../utils/errorUtils";

const normalizeFriendActivity = (activity, index) => ({
  id: activity.id ?? `friend-activity-${index}`,
  userId: activity.userId,
  username: activity.username,
  title: activity.title,
  description: activity.description,
  activityType: activity.activityType,
  createdAt: activity.createdAt
});

export const useFriendFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadFriendFeed = useCallback(async ({ force = false } = {}) => {
    if (force) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const data = await getFriendFeed();
      setActivities(data.map(normalizeFriendActivity));
    } catch (loadError) {
      setActivities([]);
      setError(getApiErrorMessage(loadError, "Unable to load friend highlights."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFriendFeed();
  }, [loadFriendFeed]);

  const refresh = useCallback(() => loadFriendFeed({ force: true }), [loadFriendFeed]);

  return useMemo(
    () => ({ activities, loading, refreshing, error, refresh }),
    [activities, loading, refreshing, error, refresh]
  );
};
