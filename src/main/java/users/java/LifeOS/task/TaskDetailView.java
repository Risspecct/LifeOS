package users.java.LifeOS.task;

import java.time.LocalDateTime;

public record TaskDetailView (
    long id,
    String description,
    Status status,
    String taskType,
    LocalDateTime dueDate
)
{}
