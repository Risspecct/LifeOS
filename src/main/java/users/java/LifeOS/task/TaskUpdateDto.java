package users.java.LifeOS.task;

import java.time.LocalDateTime;

public record TaskUpdateDto(
        String title,
        String description,
        String taskType,
        LocalDateTime dueDate
) {
}
