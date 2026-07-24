package users.java.LifeOS.demo.catalog;

import users.java.LifeOS.task.TaskPriority;

public record TaskDefinition(
        String title,
        String description,
        String taskType,
        TaskPriority priority
) {
}
