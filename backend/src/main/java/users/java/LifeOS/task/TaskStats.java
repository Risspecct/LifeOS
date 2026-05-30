package users.java.LifeOS.task;

public record TaskStats (
        Long totalTasks,
        Long completedTasks,
        Long pendingTasks,
        Long overdueTasks
){
}
