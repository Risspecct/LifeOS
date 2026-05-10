package users.java.LifeOS.task;

import java.time.LocalDateTime;

public record TaskView (
        long userId,
        long id,
        String title,
        String description,
        String labelName,
        LocalDateTime dueDate
)
{}
