package users.java.LifeOS.taskgeneration;

import users.java.LifeOS.task.TaskPriority;
import java.time.LocalDateTime;

public record GeneratedTaskDraft(
        String title,
        String description,
        TaskType taskType,
        TaskPriority priority,
        String selectedLabel,
        LocalDateTime suggestedDueDate
) {
}
