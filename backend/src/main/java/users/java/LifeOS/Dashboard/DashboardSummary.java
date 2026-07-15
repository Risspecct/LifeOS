package users.java.LifeOS.dashboard;

import users.java.LifeOS.task.TaskStats;

public record DashboardSummary(
        TaskStats taskStats,
        Integer currentStreak
) {
}