package users.java.LifeOS.Dashboard;

import users.java.LifeOS.task.TaskStats;

public record DashboardSummary(
        TaskStats taskStats,
        Integer currentStreak
) {
}