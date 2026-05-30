package users.java.LifeOS.stats;

import java.time.LocalDate;

public record UserStatsDto(
        Long totalPoints,

        Integer currentStreak,
        Integer longestStreak,

        Integer tasksCreated,
        Integer tasksCompleted,

        LocalDate lastActiveDate,
        Integer totalDaysActive,

        Integer friendCount

) {
}
