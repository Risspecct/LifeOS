package users.java.LifeOS.task.label;

public record LabelResponse(
        Long id,
        String name,
        String color,
        Integer priorityWeight
) {
}