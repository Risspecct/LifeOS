package users.java.LifeOS.student;

public record StudentUpdateDto(
        String name,
        Integer age,
        String college,
        Integer year,
        String bio
) {}