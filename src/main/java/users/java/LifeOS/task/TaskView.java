package users.java.LifeOS.task;

import java.time.LocalDateTime;

public record TaskView (
        long userId,
        long id,
        String title,
        String description,
        String label,
        LocalDateTime dueDate
)
{}
