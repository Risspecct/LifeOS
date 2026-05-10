package users.java.LifeOS.task;

import java.time.LocalDateTime;

public record TaskDetailView (
    long id,
    String title,
    String description,
    Status status,
    String taskType,
    String labelName,
    LocalDateTime dueDate,
    LocalDateTime completedAt
)
{}
