package users.java.LifeOS.task.prioritization;

import users.java.LifeOS.task.TaskPriority;

public final class PriorityWeights {

    public static int getPriorityWeight(TaskPriority taskPriority) {
        return switch (taskPriority) {
            case TaskPriority.URGENT ->  PRIORITY_URGENT;
            case TaskPriority.HIGH -> PRIORITY_HIGH;
            case TaskPriority.MEDIUM -> PRIORITY_MEDIUM;
            case TaskPriority.LOW -> PRIORITY_LOW;
            default -> 0;
        };
    }

    private PriorityWeights() {
    }

    // DUE DATE
    public static final int OVERDUE = 60;

    public static final int DUE_TODAY = 50;

    public static final int DUE_TOMORROW = 40;

    public static final int DUE_IN_3_DAYS = 25;

    public static final int DUE_IN_WEEK = 10;

    // MANUAL
    public static final int PRIORITY_URGENT = 30;

    public static final int PRIORITY_HIGH = 20;

    public static final int PRIORITY_MEDIUM = 10;

    public static final int PRIORITY_LOW = 5;

    //STATUS
    public static final int STATUS_IN_PROGRESS = 15;

    public static final int STATUS_TODO = 10;

    public static final int STATUS_COMPLETED = -100;
}