    package users.java.LifeOS.stats;

    import java.time.LocalDate;

    public record UserStatsBuildDto(
            Long totalPoints,

            Integer currentStreak,
            Integer longestStreak,

            Integer tasksCreated,
            Integer tasksCompleted,

            Integer totalDaysActive,
            LocalDate lastActiveDate,

            Integer friendCount
    ) {
    }
