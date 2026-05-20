package users.java.LifeOS.learderboard;

public record LeaderboardEntryDto(
        Long userId,
        String username,
        Long points,
        Integer streak,
        Integer rank
) {}