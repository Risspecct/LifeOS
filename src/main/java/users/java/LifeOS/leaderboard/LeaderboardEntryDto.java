package users.java.LifeOS.leaderboard;

public record LeaderboardEntryDto(
        Long userId,
        String username,
        Long points,
        Integer streak,
        Integer rank
) {}