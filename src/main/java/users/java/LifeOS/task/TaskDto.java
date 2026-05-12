package users.java.LifeOS.task;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record TaskDto(
        @NotBlank
        String title,
        String description,
        Status status,
        String taskType,
        Long labelId,
        LocalDateTime dueDate
) {}
