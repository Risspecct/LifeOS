package users.java.LifeOS.student;

import jakarta.validation.constraints.NotBlank;

public record StudentDto(
        @NotBlank
        String name,
        Integer age,
        String college,
        Long branchId,
        Integer year,
        String bio
) {}
