package users.java.LifeOS.taskgeneration.ai;

public record GeneratedTaskDraft(
        String title,
        String description,
        String taskType,
        String priority,
        String selectedLabel,
        String suggestedDueDate
) {
}
