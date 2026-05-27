package users.java.LifeOS.Dashboard;

public record DashboardSummary(
        Long totalTasks,
        Long completedTasks,
        Long pendingTasks,
        Long overdueTasks,
        Integer currentStreak
) {
}