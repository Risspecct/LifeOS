package users.java.LifeOS.stats.streak;

import users.java.LifeOS.user.User;

import java.time.LocalDate;

public record StreakView (
    User user,
    Integer currentStreak,
    LocalDate lastActiveDate
) {}
