package users.java.LifeOS.student;

public record StudentProfileView(
        long userId,
        String username,
        String email,
        String name,
        int age,
        String college,
        int year,
        String branchCode,
        String bio
) {}