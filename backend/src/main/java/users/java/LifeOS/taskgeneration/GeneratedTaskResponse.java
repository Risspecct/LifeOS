package users.java.LifeOS.taskgeneration;

import users.java.LifeOS.task.TaskPriority;

import java.time.LocalDateTime;

public record GeneratedTaskResponse(
        String title,
        String description,
        String taskType,
        TaskPriority priority,
        Long labelId,
        String labelName,
        LocalDateTime suggestedDueDate
) {
}