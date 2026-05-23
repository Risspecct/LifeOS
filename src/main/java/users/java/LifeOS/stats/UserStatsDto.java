package users.java.LifeOS.stats;

public record UserStatsDto(
        Long totalPoints,
        Integer currentStreak,
        Integer longestStreak,
        Integer tasksCompleted

) {
}
