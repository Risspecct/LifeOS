package users.java.LifeOS.level;

public record UserLevelResponse(
        int level,
        long totalPoints,
        long currentLevelProgress,
        long pointsRequiredForNextLevel
) {}