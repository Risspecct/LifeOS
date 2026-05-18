package users.java.LifeOS.task;

import java.time.LocalDateTime;

public record TaskListView(
        long id,
        String title,
        String description,
        Status status,
        String taskType,
        String labelName,
        LocalDateTime dueDate
) {}