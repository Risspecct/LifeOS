package users.java.LifeOS.task.label;

public record LabelUpdateRequest (
        String color,
        Integer priorityWeight
) {
}
