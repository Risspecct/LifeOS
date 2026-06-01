package users.java.LifeOS.student;

public record PublicStudentProfileView(
        long userId,
        String username,

        String name,
        String college,
        int year,
        String branchCode,
        String bio,

        Long totalPoints,
        Integer currentStreak,
        Integer longestStreak,
        Integer tasksCompleted,
        Integer friendCount
) {}