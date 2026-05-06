package users.java.LifeOS.task;

public record TaskListView(
        long id,
        String title,
        Status status
) {}