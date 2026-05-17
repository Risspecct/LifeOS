package users.java.LifeOS.task.prioritization;

public record TaskStats (
        Long completedTasks,
        Long pendingTasks,
        Long overdueTasks,
        Long totalTasks
){
}
