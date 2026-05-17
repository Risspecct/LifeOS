package users.java.LifeOS.task;

import java.time.LocalDateTime;

public record UpcomingTaskDto(
        Long id,
        String title,
        Status status,
        LocalDateTime dueDate,
        String labelName,
        String labelColor
) {
}