package users.java.LifeOS.task.prioritization;

public final class PriorityWeights {

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