package users.java.LifeOS.stats;

import users.java.LifeOS.user.User;

import java.time.LocalDate;

public record StreakView (
    User user,
    Integer currentStreak,
    LocalDate lastActiveDate
) {}
