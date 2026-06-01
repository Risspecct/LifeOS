package users.java.LifeOS.student;

import users.java.LifeOS.friend.RelationshipStatus;

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
        Integer friendCount,

        RelationshipStatus status,
        Long pendingRequestId
) {}