package users.java.LifeOS.demo.util;

public record Identity(
        String fullName,
        String username,
        String email,
        Integer age,
        Integer year,
        String college,
        String bio
) {
}