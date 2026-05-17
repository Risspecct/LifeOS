package users.java.LifeOS.insights;

public record ProductivitySummary(
        long completedTasks,
        long overdueTasks,
        int currentStreak,
        String topFocus,
        String momentum
) {
}