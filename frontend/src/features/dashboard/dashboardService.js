import { getDashboard, getLabels } from "../../api/dashboardApi";

const EMPTY_DASHBOARD = {
  profile: { name: "", username: "", branch: "", year: null },
  summary: { pendingTasks: 0, completedTasks: 0, overdueTasks: 0, currentStreak: null },
  prioritizedTasks: [],
  upcomingTasks: [],
  recentActivities: []
};

let cachedDashboard = null;
let pendingDashboardPromise = null;

const PRIORITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

const unwrapData = (value) => {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value;
  if ("data" in value && value.data !== undefined) return value.data;
  return value;
};

const normalizePriority = (task) => {
  const candidate = String(task?.priority || task?.smartPriority || "").toUpperCase();
  if (PRIORITY_ORDER.includes(candidate)) return candidate;
  return "LOW";
};

const normalizeLabelMeta = (rawLabels) => {
  const data = unwrapData(rawLabels);
  const labels = Array.isArray(data) ? data : [];
  return labels.reduce((acc, label) => {
    const name = String(label?.name || "").trim();
    if (!name) return acc;
    acc[name.toLowerCase()] = { name, color: label?.color || null };
    return acc;
  }, {});
};

const buildActivityIcon = (item) => {
  const fingerprint = `${item?.activityType || ""} ${item?.title || ""} ${item?.description || ""}`.toLowerCase();
  if (fingerprint.includes("complete")) return { icon: "check_circle", iconTone: "text-primary" };
  if (fingerprint.includes("streak") || fingerprint.includes("fire")) {
    return { icon: "local_fire_department", iconTone: "text-tertiary" };
  }
  if (fingerprint.includes("note") || fingerprint.includes("read")) {
    return { icon: "menu_book", iconTone: "text-cyan-300" };
  }
  return { icon: "bolt", iconTone: "text-on-surface-variant" };
};

const normalizeDashboardResponse = (rawDashboard, labelMap) => {
  const payload = unwrapData(rawDashboard) ?? {};
  const profile = payload?.profile ?? {};
  const summary = payload?.summary ?? {};
  const taskStats = payload?.summary?.taskStats ?? {};
  const prioritized = Array.isArray(payload?.prioritizedTasks) ? payload.prioritizedTasks : [];
  const upcoming = Array.isArray(payload?.upcomingTasks) ? payload.upcomingTasks : [];
  const activities = Array.isArray(payload?.recentActivities) ? payload.recentActivities : [];

  return {
    profile: {
      name: profile?.name || "",
      username: profile?.username || "",
      branch: profile?.branch || "",
      year: profile?.year || null
    },
    summary: {
      pendingTasks: Number(taskStats?.pendingTasks ?? summary?.pendingTasks ?? 0),
      completedTasks: Number(taskStats?.completedTasks ?? summary?.completedTasks ?? 0),
      overdueTasks: Number(taskStats?.overdueTasks ?? summary?.overdueTasks ?? 0),
      currentStreak:
        summary?.currentStreak === null || summary?.currentStreak === undefined
          ? null
          : Number(summary.currentStreak)
    },
    prioritizedTasks: prioritized.slice(0, 5).map((task, index) => {
      const displayLabel = String(task?.labelName || task?.label || task?.taskType || "General");
      const labelMeta = labelMap[displayLabel.toLowerCase()];
      return {
        id: task?.id ?? `${displayLabel}-${index}`,
        title: task?.title || "Untitled Task",
        status: task?.status || "TO_DO",
        dueDate: task?.dueDate || null,
        priority: normalizePriority(task),
        displayLabel: labelMeta?.name || displayLabel,
        labelColor: task?.labelColor || labelMeta?.color || null
      };
    }),
    upcomingTasks: upcoming.slice(0, 4).map((task, index) => ({
      id: task?.id ?? `upcoming-${index}`,
      title: task?.title || "Untitled Task",
      dueDate: task?.dueDate || null
    })),
    recentActivities: activities.slice(0, 4).map((item, index) => {
      const iconMeta = buildActivityIcon(item);
      return {
        id: item?.id ?? `activity-${index}`,
        taskId: item?.taskId ?? null,
        icon: iconMeta.icon,
        iconTone: iconMeta.iconTone,
        text: item?.taskTitle || item?.title || item?.description || "Activity updated",
        time: item?.createdAt || "Recently"
      };
    })
  };
};

export const getEmptyDashboard = () => EMPTY_DASHBOARD;

export const fetchDashboardData = async ({ force = false } = {}) => {
  if (!force && cachedDashboard) return cachedDashboard;
  if (!force && pendingDashboardPromise) return pendingDashboardPromise;

  pendingDashboardPromise = getDashboard()
    .then(async (dashboardData) => {
      let labelsData = [];
      try {
        labelsData = await getLabels();
      } catch {
        labelsData = [];
      }
      const labelMap = normalizeLabelMeta(labelsData);
      const normalized = normalizeDashboardResponse(dashboardData, labelMap);
      cachedDashboard = normalized;
      return normalized;
    })
    .finally(() => {
      pendingDashboardPromise = null;
    });

  return pendingDashboardPromise;
};
